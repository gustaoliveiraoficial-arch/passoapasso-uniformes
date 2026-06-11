import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS } from '../constants';

export const SceneAbertura: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({ frame, fps, config: { damping: 12, stiffness: 120 }, from: 0, to: 1 });
  const titleOpacity = interpolate(frame, [20, 50], [0, 1], { extrapolateRight: 'clamp' });
  const titleY = interpolate(frame, [20, 50], [40, 0], { extrapolateRight: 'clamp' });
  const subtitleOpacity = interpolate(frame, [45, 75], [0, 1], { extrapolateRight: 'clamp' });
  const glowOpacity = interpolate(frame, [0, 60], [0, 0.6], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 40%, #1a1a2e 0%, ${COLORS.bg} 70%)` }}>
      {/* Glow de fundo */}
      <div style={{
        position: 'absolute',
        top: '30%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        height: 600,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${COLORS.accent}44 0%, transparent 70%)`,
        opacity: glowOpacity,
      }} />

      {/* Partículas decorativas */}
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 320 + Math.sin(frame * 0.05 + i) * 20;
        const x = Math.cos(angle) * radius + 540;
        const y = Math.sin(angle) * radius + 700;
        const particleOpacity = interpolate(frame, [10 + i * 5, 30 + i * 5], [0, 0.6], { extrapolateRight: 'clamp' });
        return (
          <div key={i} style={{
            position: 'absolute',
            left: x - 6,
            top: y - 6,
            width: 12,
            height: 12,
            borderRadius: '50%',
            background: i % 3 === 0 ? COLORS.gold : i % 3 === 1 ? COLORS.accent : COLORS.silver,
            opacity: particleOpacity,
            boxShadow: `0 0 20px ${i % 3 === 0 ? COLORS.gold : i % 3 === 1 ? COLORS.accent : COLORS.silver}`,
          }} />
        );
      })}

      {/* Logo / Troféu */}
      <div style={{
        position: 'absolute',
        top: 480,
        left: '50%',
        transform: `translateX(-50%) scale(${logoScale})`,
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 160, lineHeight: 1 }}>🏆</div>
      </div>

      {/* Título */}
      <div style={{
        position: 'absolute',
        top: 720,
        width: '100%',
        textAlign: 'center',
        opacity: titleOpacity,
        transform: `translateY(${titleY}px)`,
      }}>
        <div style={{
          fontSize: 80,
          fontWeight: 900,
          color: COLORS.white,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          letterSpacing: '-2px',
          lineHeight: 1.1,
        }}>
          PÓDIO DE
        </div>
        <div style={{
          fontSize: 80,
          fontWeight: 900,
          background: `linear-gradient(135deg, ${COLORS.gold} 0%, ${COLORS.goldLight} 50%, ${COLORS.gold} 100%)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          letterSpacing: '-2px',
          lineHeight: 1.1,
        }}>
          VENDAS
        </div>
      </div>

      {/* Subtítulo */}
      <div style={{
        position: 'absolute',
        top: 930,
        width: '100%',
        textAlign: 'center',
        opacity: subtitleOpacity,
      }}>
        <div style={{
          fontSize: 36,
          color: COLORS.grayLight,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          letterSpacing: 4,
          textTransform: 'uppercase',
        }}>
          Gamifique seu time de vendas
        </div>
      </div>
    </AbsoluteFill>
  );
};
