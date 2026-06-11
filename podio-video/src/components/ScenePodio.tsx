import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS } from '../constants';

const sellers = [
  { name: 'Carlos Silva',   valor: 'R$ 48.200', pos: 1, emoji: '🥇', color: COLORS.gold,   colorLight: COLORS.goldLight,   height: 280 },
  { name: 'Ana Ferreira',  valor: 'R$ 35.100', pos: 2, emoji: '🥈', color: COLORS.silver, colorLight: COLORS.silverLight, height: 220 },
  { name: 'Pedro Costa',   valor: 'R$ 28.700', pos: 3, emoji: '🥉', color: COLORS.bronze, colorLight: COLORS.bronzeLight,  height: 170 },
];

const PodiumBar: React.FC<{ seller: typeof sellers[0]; frame: number; fps: number; index: number }> = ({ seller, frame, fps, index }) => {
  const delay = 20 + index * 30;
  const barScale = spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 100 }, from: 0, to: 1 });
  const textOpacity = interpolate(frame, [delay + 25, delay + 50], [0, 1], { extrapolateRight: 'clamp' });

  const order = [1, 0, 2]; // posição visual: prata, ouro, bronze
  const leftPositions = [60, 330, 600];

  return (
    <div style={{
      position: 'absolute',
      bottom: 0,
      left: leftPositions[order[index]],
      width: 320,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      transform: `scaleY(${barScale})`,
      transformOrigin: 'bottom',
    }}>
      {/* Barra */}
      <div style={{
        width: '100%',
        height: seller.height,
        background: `linear-gradient(180deg, ${seller.color}44 0%, ${seller.color}22 100%)`,
        border: `2px solid ${seller.color}88`,
        borderBottom: 'none',
        borderRadius: '16px 16px 0 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 20,
        gap: 8,
      }}>
        <div style={{
          fontSize: 60,
          opacity: textOpacity,
        }}>{seller.emoji}</div>
        <div style={{
          fontSize: 28,
          fontWeight: 700,
          color: seller.colorLight,
          fontFamily: 'system-ui, sans-serif',
          textAlign: 'center',
          padding: '0 10px',
          opacity: textOpacity,
        }}>{seller.name}</div>
        <div style={{
          fontSize: 26,
          fontWeight: 900,
          color: seller.color,
          fontFamily: 'system-ui, sans-serif',
          opacity: textOpacity,
        }}>{seller.valor}</div>
      </div>
    </div>
  );
};

export const ScenePodio: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: 'clamp' });
  const titleY = interpolate(frame, [0, 25], [40, 0], { extrapolateRight: 'clamp' });
  const imgOpacity = interpolate(frame, [10, 50], [0, 1], { extrapolateRight: 'clamp' });
  const screenshotScale = spring({ frame: frame - 10, fps, config: { damping: 18, stiffness: 70 }, from: 0.9, to: 1 });

  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 60%, #1a1520 0%, ${COLORS.bg} 60%)` }}>
      {/* Título */}
      <div style={{
        position: 'absolute',
        top: 140,
        width: '100%',
        textAlign: 'center',
        opacity: titleOpacity,
        transform: `translateY(${titleY}px)`,
      }}>
        <div style={{
          fontSize: 52,
          fontWeight: 900,
          color: COLORS.white,
          fontFamily: 'system-ui, sans-serif',
        }}>
          Cards FIFA de <span style={{
            background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldLight})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>campeão</span>
        </div>
        <div style={{
          fontSize: 32,
          color: COLORS.grayLight,
          fontFamily: 'system-ui, sans-serif',
          marginTop: 12,
        }}>
          Pódio com foto e ranking ao vivo
        </div>
      </div>

      {/* Screenshot do pódio */}
      <div style={{
        position: 'absolute',
        top: 300,
        left: 40,
        right: 40,
        height: 1100,
        borderRadius: 32,
        overflow: 'hidden',
        opacity: imgOpacity,
        transform: `scale(${screenshotScale})`,
        boxShadow: `0 30px 100px ${COLORS.gold}44, 0 0 0 2px ${COLORS.gold}33`,
      }}>
        <Img
          src={staticFile('screenshots/podio.png')}
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
        />
      </div>

      {/* Brilho dourado */}
      <div style={{
        position: 'absolute',
        top: 250,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 800,
        height: 800,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${COLORS.gold}11 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />
    </AbsoluteFill>
  );
};
