import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { COLORS } from '../constants';

const problems = [
  { icon: '😤', text: 'Ninguém sabe quem\nestá ganhando' },
  { icon: '📉', text: 'Ranking no Excel\nnão engaja ninguém' },
  { icon: '🥱', text: 'Time desmotivado\nsem competição real' },
];

export const SceneProblema: React.FC = () => {
  const frame = useCurrentFrame();

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });
  const titleY = interpolate(frame, [0, 20], [30, 0], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, #0f0f1a 0%, ${COLORS.bg} 100%)` }}>
      {/* Linha vermelha de problema */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 6,
        background: 'linear-gradient(90deg, transparent, #ef4444, transparent)',
      }} />

      {/* Título */}
      <div style={{
        position: 'absolute',
        top: 280,
        width: '100%',
        textAlign: 'center',
        opacity: titleOpacity,
        transform: `translateY(${titleY}px)`,
        padding: '0 80px',
      }}>
        <div style={{
          fontSize: 48,
          fontWeight: 700,
          color: '#ef4444',
          fontFamily: 'system-ui, sans-serif',
          letterSpacing: 2,
          textTransform: 'uppercase',
          marginBottom: 16,
        }}>
          O PROBLEMA
        </div>
        <div style={{
          fontSize: 56,
          fontWeight: 900,
          color: COLORS.white,
          fontFamily: 'system-ui, sans-serif',
          lineHeight: 1.2,
        }}>
          Seu time vende mais<br/>quando tem motivo
          <span style={{ color: COLORS.gold }}> para ganhar.</span>
        </div>
      </div>

      {/* Cards de problema */}
      {problems.map((p, i) => {
        const delay = 30 + i * 25;
        const cardOpacity = interpolate(frame, [delay, delay + 20], [0, 1], { extrapolateRight: 'clamp' });
        const cardX = interpolate(frame, [delay, delay + 20], [-80, 0], { extrapolateRight: 'clamp' });

        return (
          <div key={i} style={{
            position: 'absolute',
            top: 700 + i * 220,
            left: 80,
            right: 80,
            background: '#1a1a2a',
            border: '1px solid #2a2a3a',
            borderLeft: '4px solid #ef4444',
            borderRadius: 24,
            padding: '40px 50px',
            display: 'flex',
            alignItems: 'center',
            gap: 40,
            opacity: cardOpacity,
            transform: `translateX(${cardX}px)`,
          }}>
            <div style={{ fontSize: 72, flexShrink: 0 }}>{p.icon}</div>
            <div style={{
              fontSize: 38,
              fontWeight: 600,
              color: COLORS.grayLight,
              fontFamily: 'system-ui, sans-serif',
              lineHeight: 1.3,
              whiteSpace: 'pre-line',
            }}>
              {p.text}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
