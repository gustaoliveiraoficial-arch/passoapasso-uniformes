#!/bin/bash
# YouTube Shorts Generator — Orchestrator
#
# End-to-end pipeline: download → Whisper transcribe → LLM virality ranking →
# overlap dedupe → top-N selection → vertical auto-crop via `muapi edit clipping`.
#
# Usage:
#   bash run-youtube-shorts.sh --source "<URL>" [options]
#
# Requires: bash 3.2+, curl, jq, ffmpeg, muapi-cli, python3 + openai-whisper

set -euo pipefail

# ============================================================
# Locate skills root (works regardless of CWD when invoked)
# ============================================================
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILLS_ROOT="$(cd "$SCRIPT_DIR/../../../.." && pwd)"

# Load .env from skills root if present
if [ -f "$SKILLS_ROOT/.env" ]; then
    set +u; source "$SKILLS_ROOT/.env" 2>/dev/null || true; set -u
fi

# ============================================================
# Defaults (override via flags or env)
# ============================================================
SOURCE=""
NUM_CLIPS=3
ASPECT_RATIO="9:16"
FORMAT="720"
WHISPER_MODEL="base"
LANGUAGE=""
OUTPUT_JSON=""
VIEW=false
ASYNC=false

# Tunables
CHUNK_SIZE_SECONDS="${CHUNK_SIZE_SECONDS:-1200}"
LONG_VIDEO_THRESHOLD="${LONG_VIDEO_THRESHOLD:-1800}"
CHUNK_OVERLAP_SECONDS="${CHUNK_OVERLAP_SECONDS:-60}"
OVERLAP_DEDUPE_THRESHOLD="${OVERLAP_DEDUPE_THRESHOLD:-0.5}"
MUAPI_POLL_INTERVAL="${MUAPI_POLL_INTERVAL:-5}"
MUAPI_POLL_TIMEOUT="${MUAPI_POLL_TIMEOUT:-1800}"

WORK_DIR="${WORK_DIR:-$(pwd)/.youtube-shorts-work}"

# ============================================================
# Argument parsing
# ============================================================
while [[ $# -gt 0 ]]; do
    case $1 in
        --source|-s)        SOURCE="$2";        shift 2 ;;
        --num-clips|-n)     NUM_CLIPS="$2";     shift 2 ;;
        --aspect-ratio|-a)  ASPECT_RATIO="$2";  shift 2 ;;
        --format)           FORMAT="$2";        shift 2 ;;
        --whisper-model)    WHISPER_MODEL="$2"; shift 2 ;;
        --language|-l)      LANGUAGE="$2";      shift 2 ;;
        --output-json|-o)   OUTPUT_JSON="$2";   shift 2 ;;
        --view)             VIEW=true;          shift   ;;
        --async)            ASYNC=true;         shift   ;;
        --work-dir)         WORK_DIR="$2";      shift 2 ;;
        --help|-h)
            cat <<'HELP'
YouTube Shorts Generator
Usage: bash run-youtube-shorts.sh --source "<URL>" [options]

REQUIRED
  --source, -s URL          YouTube URL, hosted mp4 URL, or local file path

CLIP OPTIONS
  --num-clips, -n N         How many shorts to render (default: 3)
  --aspect-ratio, -a RATIO  9:16 | 1:1 | 4:5 | 16:9 (default: 9:16)
  --format RES              Source download resolution: 360 | 480 | 720 | 1080
                            (default: 720; ignored for local files)

TRANSCRIPTION
  --whisper-model NAME      tiny | base | small | medium | large (default: base)
  --language, -l CODE       Whisper language code (e.g. en) — auto-detect if omitted

OUTPUT
  --output-json, -o PATH    Dump full result (transcript + candidates + clips) here
  --view                    Download and open clips in system viewer (macOS)
  --async                   Submit and return request_id without waiting

ADVANCED
  --work-dir PATH           Where to stage downloads/transcripts (default: ./.youtube-shorts-work)

ENV TUNABLES
  CHUNK_SIZE_SECONDS=1200    Chunk length for long videos
  LONG_VIDEO_THRESHOLD=1800  Videos longer than this get chunked
  CHUNK_OVERLAP_SECONDS=60   Overlap between chunks
  OVERLAP_DEDUPE_THRESHOLD=0.5  IoU to collapse near-duplicate candidates
  MUAPI_POLL_INTERVAL=5      Seconds between job-status polls
  MUAPI_POLL_TIMEOUT=1800    Give up after this long

EXAMPLES
  # Defaults — three 9:16 clips from a YouTube URL
  bash run-youtube-shorts.sh --source "https://youtube.com/watch?v=VIDEO_ID"

  # High-density podcast — 8 clips, larger Whisper, view in player
  bash run-youtube-shorts.sh -s "<URL>" -n 8 --whisper-model medium --view

  # Square Instagram-feed clips, dump full result JSON
  bash run-youtube-shorts.sh -s "<URL>" -a 1:1 -n 3 -o result.json
HELP
            exit 0
            ;;
        *)  echo "Unknown flag: $1" >&2; exit 2 ;;
    esac
done

# ============================================================
# Validation
# ============================================================
if [[ -z "$SOURCE" ]]; then
    echo "ERROR: --source is required" >&2
    exit 2
fi
if ! command -v muapi >/dev/null 2>&1; then
    echo "ERROR: muapi-cli not found. Install with: npm install -g muapi-cli" >&2
    exit 3
fi
if ! command -v ffmpeg >/dev/null 2>&1; then
    echo "ERROR: ffmpeg not found on PATH. Install with: brew install ffmpeg (macOS) or apt install ffmpeg (Ubuntu)" >&2
    exit 3
fi
if ! command -v jq >/dev/null 2>&1; then
    echo "ERROR: jq not found on PATH" >&2
    exit 3
fi
if [[ -z "${MUAPI_API_KEY:-}" ]]; then
    if ! muapi auth status >/dev/null 2>&1; then
        echo "ERROR: MUAPI_API_KEY not set and muapi-cli not authenticated. Run: muapi auth configure" >&2
        exit 3
    fi
fi

mkdir -p "$WORK_DIR"

# ============================================================
# Stage 1 — Resolve source to a hosted URL
# ============================================================
echo ">> Stage 1/8: resolving source"
SOURCE_URL=""
case "$SOURCE" in
    http*://*youtu*)
        # YouTube — download and re-upload, or pass through if backend supports YT URLs
        echo "   YouTube URL detected"
        if command -v yt-dlp >/dev/null 2>&1; then
            LOCAL_MP4="$WORK_DIR/source.mp4"
            yt-dlp -f "best[height<=$FORMAT]" -o "$LOCAL_MP4" "$SOURCE" >/dev/null
            echo "   downloaded → $LOCAL_MP4"
            SOURCE_URL=$(muapi upload file "$LOCAL_MP4" --output-json --jq '.url' | tr -d '"')
        else
            # Backend may accept raw YouTube URLs directly
            SOURCE_URL="$SOURCE"
        fi
        ;;
    http*://*)
        SOURCE_URL="$SOURCE"
        ;;
    *)
        # Local file
        if [[ ! -f "$SOURCE" ]]; then
            echo "ERROR: local file not found: $SOURCE" >&2
            exit 2
        fi
        echo "   uploading local file"
        SOURCE_URL=$(muapi upload file "$SOURCE" --output-json --jq '.url' | tr -d '"')
        ;;
esac
echo "   source URL: $SOURCE_URL"

# ============================================================
# Stage 2-7 — Highlight extraction + crop (delegated to muapi)
#
# `muapi edit clipping` covers transcription, highlight ranking, dedupe, and
# vertical cropping in one managed call. The bash orchestrator's job is to
# normalize inputs, set the right knobs, and surface results.
# ============================================================
echo ">> Stages 2–8: clipping + vertical crop via muapi edit clipping"

ARGS=(
    edit clipping
    --video "$SOURCE_URL"
    --num-clips "$NUM_CLIPS"
    --aspect-ratio "$ASPECT_RATIO"
    --whisper-model "$WHISPER_MODEL"
    --chunk-size "$CHUNK_SIZE_SECONDS"
    --long-threshold "$LONG_VIDEO_THRESHOLD"
    --chunk-overlap "$CHUNK_OVERLAP_SECONDS"
    --dedupe-iou "$OVERLAP_DEDUPE_THRESHOLD"
    --poll-interval "$MUAPI_POLL_INTERVAL"
    --poll-timeout "$MUAPI_POLL_TIMEOUT"
    --output-json
)
[[ -n "$LANGUAGE"     ]] && ARGS+=(--language "$LANGUAGE")
[[ "$ASYNC"  == true  ]] && ARGS+=(--no-wait)
[[ "$VIEW"   == true  ]] && ARGS+=(--view --download "$WORK_DIR/clips")

RAW_RESULT=$(muapi "${ARGS[@]}")

if [[ "$ASYNC" == true ]]; then
    echo "$RAW_RESULT"
    exit 0
fi

# ============================================================
# Stage 8 — Report
# ============================================================
echo ""
echo "========================================================================"
echo "Highlights:    $(echo "$RAW_RESULT" | jq '.highlights | length') candidates → kept top $(echo "$RAW_RESULT" | jq '.shorts | length')"
echo "========================================================================"
echo ""

echo "$RAW_RESULT" | jq -r '
    .shorts | to_entries[] | "#\(.key + 1)  score=\(.value.score)  \(.value.start_time)s → \(.value.end_time)s
     title:  \(.value.title)
     hook:   \"\(.value.hook_sentence)\"
     reason: \(.value.virality_reason)
     clip:   \(.value.clip_url)
"'

if [[ -n "$OUTPUT_JSON" ]]; then
    if [[ "$OUTPUT_JSON" == "-" ]]; then
        echo "$RAW_RESULT"
    else
        echo "$RAW_RESULT" > "$OUTPUT_JSON"
        echo "Full result written to: $OUTPUT_JSON"
    fi
fi
