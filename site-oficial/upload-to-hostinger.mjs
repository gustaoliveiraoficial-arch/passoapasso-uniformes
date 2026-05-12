import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';

const BASE_URL = 'https://srv1938-files.hstgr.io/e16da36b9889a600';
const JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJsb2NhbGUiOiJlbl9HQiIsInZpZXdNb2RlIjoibGlzdCIsInNpbmdsZUNsaWNrIjpmYWxzZSwicmVkaXJlY3RBZnRlckNvcHlNb3ZlIjpmYWxzZSwicGVybSI6eyJhZG1pbiI6ZmFsc2UsImV4ZWN1dGUiOmZhbHNlLCJjcmVhdGUiOnRydWUsInJlbmFtZSI6dHJ1ZSwibW9kaWZ5Ijp0cnVlLCJkZWxldGUiOnRydWUsInNoYXJlIjpmYWxzZSwiZG93bmxvYWQiOnRydWV9LCJjb21tYW5kcyI6W10sImxvY2tQYXNzd29yZCI6dHJ1ZSwiaGlkZURvdGZpbGVzIjpmYWxzZSwiZGF0ZUZvcm1hdCI6ZmFsc2UsInVzZXJuYW1lIjoidTcyMzE5OTA2MyIsImFjZUVkaXRvclRoZW1lIjoiIn0sImlzcyI6IkZpbGUgQnJvd3NlciIsImV4cCI6MTc3NTM2NzUwNywiaWF0IjoxNzc1MzQ1OTA3fQ.mTboGHRzoFUBWRPRTGyZ4UWaAfhzwZ9-wRp6iQs-Iwg';
const OUT_DIR = './out';
const DEST_PREFIX = 'public_html';

function getAllFiles(dir, base = dir) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      results.push(...getAllFiles(full, base));
    } else {
      results.push(full);
    }
  }
  return results;
}

async function uploadFile(localPath) {
  const rel = relative(OUT_DIR, localPath).replace(/\\/g, '/');
  const remotePath = `${DEST_PREFIX}/${rel}`;
  const content = readFileSync(localPath);

  const url = `${BASE_URL}/api/resources/${remotePath}?override=true`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'X-Auth': JWT, 'Content-Type': 'application/octet-stream' },
    body: content,
  });

  const ok = res.status === 200 || res.status === 201 || res.status === 204;
  console.log(`${ok ? '✓' : '✗'} [${res.status}] ${rel}`);
  return ok;
}

const files = getAllFiles(OUT_DIR);
console.log(`Uploading ${files.length} files...`);

let ok = 0, fail = 0;
for (const f of files) {
  const success = await uploadFile(f);
  success ? ok++ : fail++;
}

console.log(`\nDone: ${ok} ok, ${fail} failed`);
