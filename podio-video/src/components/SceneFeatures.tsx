import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS } from '../constants';

const features = [
  {
    icon: '🎯',
    title: 'Metas Individuais',
    desc: 'Barra de progresso por vendedor com % atingida',
    screenshot: 'screenshots/metas.png',
    color: COLORS.green,
    frame: 0,
  },
  {
    icon: '🎡',
    title: 'Roleta de Prêmios',
    desc: 'Sorteio ao vivo para motivar o time',
    screenshot: 'screenshots/roleta.png',
    color: COLORS.accent,
    frame: 70,
  },
  {
    icon: '📺',
    title: 'Modo TV',
    desc: 'Link público para o telão da empresa',
    screenshot: 'screenshots/tv.png',
    color: COLORS.gold,
    frame: 140,
  },
];

export const SceneFeatures: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: COLORS.bg }}>
      {/* Título */}
      <div style={{
        position: 'absolute',
        top: 130,
        width: '100%',
        textAlign: 'center',
        opacity: titleOpacity,
      }}>
        <div style={{
          fontSize: 52,
          fontWeight: 900,
          color: COLORS.white,
          fontFamily: 'system-ui, sans-serif',
        }}>
          Tudo que seu time precisa
        </div>
      </div>

      {/* Feature cards */}
      {features.map((f, i) => {
        const delay = f.frame + 15;
        const cardOpacity = interpolate(frame, [delay, delay + 20], [0, 1], { extrapolateRight: 'clamp' });
        const cardX = interpolate(frame, [delay, delay + 20], [60, 0], { extrapolateRight: 'clamp' });
        const imgScale = spring({ frame: frame - delay - 5, fps, config: { damping: 18, stiffness: 100 }, from: 0.9, to: 1 });

        return (
          <div key={i} style={{
            position: 'absolute',
            top: 290 + i * 510,
            left: 50,
            right: 50,
            opacity: cardOpacity,
            transform: `translateX(${cardX}px)`,
          }}>
            <div style={{
              background: COLORS.bgCard,
              border: `1px solid ${f.color}44`,
              borderLeft: `5px solid ${f.color}`,
              borderRadius: 28,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}>
              {/* Screenshot */}
              <div style={{
                height: 320,
                overflow: 'hidden',
                transform: `scale(${imgScale})`,
                transformOrigin: 'top',
              }}>
                <Img
                  src={staticFile(f.screenshot)}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'top',
                  }}
                />
              </div>

              {/* Info */}
              <div style={{
                padding: '30px 40px',
                display: 'flex',
                alignItems: 'center',
                gap: 28,
              }}>
                <div style={{ fontSize: 60, flexShrink: 0 }}>{f.icon}</div>
                <div>
                  <div style={{
                    fontSize: 38,
                    fontWeight: 800,
                    color: COLORS.white,
                    fontFamily: 'system-ui, sans-serif',
                  }}>{f.title}</div>
                  <div style={{
                    fontSize: 28,
                    color: COLORS.grayLight,
                    fontFamily: 'system-ui, sans-serif',
                    marginTop: 6,
                  }}>{f.desc}</div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
