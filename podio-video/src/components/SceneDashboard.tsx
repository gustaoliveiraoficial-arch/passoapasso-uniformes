import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS } from '../constants';

export const SceneDashboard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });
  const imgScale = spring({ frame: frame - 20, fps, config: { damping: 18, stiffness: 80 }, from: 0.85, to: 1 });
  const imgOpacity = interpolate(frame, [20, 60], [0, 1], { extrapolateRight: 'clamp' });
  const tagOpacity = interpolate(frame, [90, 120], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: COLORS.bg }}>
      {/* Glow accent */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 900,
        height: 900,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${COLORS.accent}22 0%, transparent 70%)`,
      }} />

      {/* Label */}
      <div style={{
        position: 'absolute',
        top: 180,
        width: '100%',
        textAlign: 'center',
        opacity: titleOpacity,
      }}>
        <div style={{
          display: 'inline-block',
          background: `${COLORS.accent}33`,
          border: `1px solid ${COLORS.accent}66`,
          borderRadius: 50,
          padding: '16px 48px',
          fontSize: 34,
          fontWeight: 700,
          color: COLORS.accentLight,
          fontFamily: 'system-ui, sans-serif',
          letterSpacing: 2,
          textTransform: 'uppercase',
        }}>
          ✨ A Solução
        </div>
      </div>

      {/* Screenshot do dashboard */}
      <div style={{
        position: 'absolute',
        top: 300,
        left: 40,
        right: 40,
        height: 1100,
        borderRadius: 32,
        overflow: 'hidden',
        opacity: imgOpacity,
        transform: `scale(${imgScale})`,
        boxShadow: `0 40px 120px ${COLORS.accent}44, 0 0 0 1px ${COLORS.accent}33`,
      }}>
        <Img
          src={staticFile('screenshots/dashboard.png')}
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
        />
      </div>

      {/* Tag flutuante */}
      <div style={{
        position: 'absolute',
        bottom: 260,
        left: '50%',
        transform: 'translateX(-50%)',
        opacity: tagOpacity,
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(20px)',
        border: `1px solid ${COLORS.gold}66`,
        borderRadius: 20,
        padding: '24px 60px',
        textAlign: 'center',
        whiteSpace: 'nowrap',
      }}>
        <div style={{
          fontSize: 44,
          fontWeight: 900,
          color: COLORS.white,
          fontFamily: 'system-ui, sans-serif',
        }}>
          Painel em <span style={{ color: COLORS.gold }}>tempo real</span>
        </div>
        <div style={{
          fontSize: 28,
          color: COLORS.grayLight,
          fontFamily: 'system-ui, sans-serif',
          marginTop: 8,
        }}>
          Ranking, metas e métricas ao vivo
        </div>
      </div>
    </AbsoluteFill>
  );
};
