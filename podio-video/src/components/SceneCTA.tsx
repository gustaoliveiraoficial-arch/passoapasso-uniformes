import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS } from '../constants';

const Confetti: React.FC<{ frame: number; seed: number }> = ({ frame, seed }) => {
  const x = ((seed * 137.5) % 100) * 10.8;
  const delay = (seed % 8) * 6;
  const y = interpolate(frame - delay, [0, 120], [-80, 2100], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const rotation = (seed * 47 + frame * 3) % 360;
  const colors = [COLORS.gold, COLORS.accent, COLORS.green, '#ff6b6b', '#4ecdc4', COLORS.silver];
  const color = colors[seed % colors.length];
  const size = 12 + (seed % 16);

  if (frame < delay) return null;

  return (
    <div style={{
      position: 'absolute',
      left: x,
      top: y,
      width: size,
      height: size * 0.6,
      background: color,
      borderRadius: 2,
      transform: `rotate(${rotation}deg)`,
      opacity: 0.85,
    }} />
  );
};

export const SceneCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const trophyScale = spring({ frame, fps, config: { damping: 10, stiffness: 100 }, from: 0, to: 1 });
  const titleOpacity = interpolate(frame, [20, 45], [0, 1], { extrapolateRight: 'clamp' });
  const titleY = interpolate(frame, [20, 45], [50, 0], { extrapolateRight: 'clamp' });
  const btnScale = spring({ frame: frame - 60, fps, config: { damping: 12, stiffness: 120 }, from: 0, to: 1 });
  const urlOpacity = interpolate(frame, [80, 110], [0, 1], { extrapolateRight: 'clamp' });
  const glowPulse = interpolate(Math.sin(frame * 0.1), [-1, 1], [0.4, 0.8]);

  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 50%, #1a1530 0%, ${COLORS.bg} 70%)` }}>
      {/* Confetti */}
      {[...Array(30)].map((_, i) => (
        <Confetti key={i} frame={frame} seed={i} />
      ))}

      {/* Glow central */}
      <div style={{
        position: 'absolute',
        top: '45%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 700,
        height: 700,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${COLORS.gold}${Math.floor(glowPulse * 100).toString(16)} 0%, transparent 70%)`,
      }} />

      {/* Troféu */}
      <div style={{
        position: 'absolute',
        top: 320,
        width: '100%',
        textAlign: 'center',
        transform: `scale(${trophyScale})`,
        fontSize: 180,
      }}>
        🏆
      </div>

      {/* Título principal */}
      <div style={{
        position: 'absolute',
        top: 620,
        width: '100%',
        textAlign: 'center',
        opacity: titleOpacity,
        transform: `translateY(${titleY}px)`,
        padding: '0 60px',
      }}>
        <div style={{
          fontSize: 72,
          fontWeight: 900,
          color: COLORS.white,
          fontFamily: 'system-ui, sans-serif',
          lineHeight: 1.15,
        }}>
          Seu time vai <span style={{
            background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldLight})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>vender mais</span> com um pódio real
        </div>
      </div>

      {/* Botão CTA */}
      <div style={{
        position: 'absolute',
        top: 980,
        left: '50%',
        transform: `translateX(-50%) scale(${btnScale})`,
      }}>
        <div style={{
          background: `linear-gradient(135deg, ${COLORS.gold} 0%, ${COLORS.goldLight} 50%, ${COLORS.gold} 100%)`,
          borderRadius: 24,
          padding: '44px 90px',
          textAlign: 'center',
          boxShadow: `0 20px 60px ${COLORS.gold}66`,
          whiteSpace: 'nowrap',
        }}>
          <div style={{
            fontSize: 48,
            fontWeight: 900,
            color: '#000',
            fontFamily: 'system-ui, sans-serif',
          }}>
            🚀 Testar 7 dias grátis
          </div>
        </div>
      </div>

      {/* URL */}
      <div style={{
        position: 'absolute',
        top: 1180,
        width: '100%',
        textAlign: 'center',
        opacity: urlOpacity,
      }}>
        <div style={{
          fontSize: 36,
          fontWeight: 600,
          color: COLORS.grayLight,
          fontFamily: 'system-ui, sans-serif',
          letterSpacing: 1,
        }}>
          podio-de-vendas.vercel.app
        </div>
      </div>

      {/* Badge sem cartão */}
      <div style={{
        position: 'absolute',
        top: 1310,
        width: '100%',
        textAlign: 'center',
        opacity: urlOpacity,
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 14,
          background: `${COLORS.green}22`,
          border: `1px solid ${COLORS.green}66`,
          borderRadius: 50,
          padding: '16px 44px',
          fontSize: 28,
          color: COLORS.green,
          fontFamily: 'system-ui, sans-serif',
          fontWeight: 600,
        }}>
          ✅ Sem cartão de crédito
        </div>
      </div>
    </AbsoluteFill>
  );
};
