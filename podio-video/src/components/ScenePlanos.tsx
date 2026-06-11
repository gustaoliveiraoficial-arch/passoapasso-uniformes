import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS } from '../constants';

const plans = [
  {
    name: 'Trial',
    price: 'Grátis',
    period: '7 dias',
    features: ['Todas as funções', 'Sem cartão', 'Acesso total'],
    color: COLORS.green,
    highlight: false,
    delay: 20,
  },
  {
    name: 'Starter',
    price: 'R$ 97',
    period: '/mês',
    features: ['10 vendedores', 'Modo TV', 'Suporte'],
    color: COLORS.gold,
    highlight: true,
    delay: 50,
  },
  {
    name: 'Pro',
    price: 'R$ 197',
    period: '/mês',
    features: ['Ilimitado', 'Multi-workspace', 'Prioridade'],
    color: COLORS.accent,
    highlight: false,
    delay: 80,
  },
];

export const ScenePlanos: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, #0d0d1a 0%, ${COLORS.bg} 100%)` }}>
      {/* Título */}
      <div style={{
        position: 'absolute',
        top: 130,
        width: '100%',
        textAlign: 'center',
        opacity: titleOpacity,
      }}>
        <div style={{
          fontSize: 56,
          fontWeight: 900,
          color: COLORS.white,
          fontFamily: 'system-ui, sans-serif',
          lineHeight: 1.2,
        }}>
          Comece agora,<br/>
          <span style={{ color: COLORS.gold }}>7 dias grátis</span>
        </div>
        <div style={{
          fontSize: 32,
          color: COLORS.grayLight,
          fontFamily: 'system-ui, sans-serif',
          marginTop: 16,
        }}>
          Sem cartão de crédito
        </div>
      </div>

      {/* Cards de planos */}
      {plans.map((plan, i) => {
        const scale = spring({ frame: frame - plan.delay, fps, config: { damping: 14, stiffness: 110 }, from: 0, to: 1 });
        const opacity = interpolate(frame, [plan.delay, plan.delay + 20], [0, 1], { extrapolateRight: 'clamp' });

        return (
          <div key={i} style={{
            position: 'absolute',
            top: 440 + i * 420,
            left: 60,
            right: 60,
            opacity,
            transform: `scale(${scale})`,
          }}>
            <div style={{
              background: plan.highlight ? `linear-gradient(135deg, ${plan.color}22, ${plan.color}11)` : COLORS.bgCard,
              border: `${plan.highlight ? 2 : 1}px solid ${plan.color}${plan.highlight ? 'cc' : '44'}`,
              borderRadius: 28,
              padding: '44px 50px',
              display: 'flex',
              alignItems: 'center',
              gap: 40,
              position: 'relative',
            }}>
              {plan.highlight && (
                <div style={{
                  position: 'absolute',
                  top: -20,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: plan.color,
                  borderRadius: 50,
                  padding: '8px 32px',
                  fontSize: 22,
                  fontWeight: 800,
                  color: '#000',
                  fontFamily: 'system-ui, sans-serif',
                  whiteSpace: 'nowrap',
                }}>
                  MAIS POPULAR
                </div>
              )}

              {/* Preço */}
              <div style={{ flexShrink: 0, textAlign: 'center', minWidth: 200 }}>
                <div style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: plan.color,
                  fontFamily: 'system-ui, sans-serif',
                  textTransform: 'uppercase',
                  letterSpacing: 2,
                }}>
                  {plan.name}
                </div>
                <div style={{
                  fontSize: 62,
                  fontWeight: 900,
                  color: COLORS.white,
                  fontFamily: 'system-ui, sans-serif',
                  lineHeight: 1,
                  marginTop: 8,
                }}>
                  {plan.price}
                </div>
                <div style={{
                  fontSize: 26,
                  color: COLORS.grayLight,
                  fontFamily: 'system-ui, sans-serif',
                }}>
                  {plan.period}
                </div>
              </div>

              {/* Divider */}
              <div style={{ width: 2, height: 120, background: `${plan.color}44`, borderRadius: 2 }} />

              {/* Features */}
              <div style={{ flex: 1 }}>
                {plan.features.map((f, fi) => (
                  <div key={fi} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 18,
                    marginBottom: fi < plan.features.length - 1 ? 20 : 0,
                  }}>
                    <div style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: plan.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 16,
                      flexShrink: 0,
                    }}>✓</div>
                    <div style={{
                      fontSize: 30,
                      color: COLORS.text,
                      fontFamily: 'system-ui, sans-serif',
                    }}>{f}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
