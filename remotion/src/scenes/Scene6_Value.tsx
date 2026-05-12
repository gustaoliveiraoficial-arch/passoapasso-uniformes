import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { CurvedStripe } from '../components/CurvedStripe';

// Cena 6: Card "Value / No eyeballs / No impact"
// Fundo creme + faixa curva, card cinza com pin vermelho, itens aparecem em sequência
export const Scene6Value: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cfgCard  = { damping: 14, stiffness: 160, mass: 0.8 };
  const cfgItems = { damping: 20, stiffness: 200, mass: 0.5 };

  const cardIn  = spring({ frame, fps, config: cfgCard });
  const item1In = spring({ frame: frame - 20, fps, config: cfgItems });
  const item2In = spring({ frame: frame - 35, fps, config: cfgItems });

  const cardY = interpolate(cardIn, [0, 1], [-200, 0]);

  return (
    <div style={{
      width: '100%', height: '100%',
      background: '#ede8e0',
      position: 'relative',
      fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <CurvedStripe />

      {/* Card com pin */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        opacity: cardIn,
        transform: `translateY(${cardY}px)`,
      }}>
        {/* Pin vermelho */}
        <div style={{
          position: 'absolute',
          top: -36,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 3,
        }}>
          {/* Cabeça do pin */}
          <div style={{
            width: 52,
            height: 52,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 35%, #ff4444, #aa0000)',
            boxShadow: '0 4px 16px rgba(180,0,0,0.5)',
            margin: '0 auto',
          }} />
          {/* Haste do pin */}
          <div style={{
            width: 10,
            height: 30,
            background: '#cc2222',
            margin: '0 auto',
            borderRadius: '0 0 4px 4px',
          }} />
        </div>

        {/* Corpo do card */}
        <div style={{
          width: 700,
          minHeight: 460,
          background: 'linear-gradient(160deg, #7a7a7a, #606060)',
          borderRadius: 20,
          padding: '60px 60px 50px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.2)',
        }}>
          {/* Título "Value" */}
          <div style={{
            fontSize: 110,
            fontWeight: 800,
            color: '#ffffff',
            lineHeight: 1.1,
            marginBottom: 40,
            textShadow: '0 2px 8px rgba(0,0,0,0.3)',
          }}>
            Value
          </div>

          {/* Item 1: No eyeballs */}
          <div style={{
            opacity: item1In,
            transform: `translateX(${interpolate(item1In, [0, 1], [-30, 0])}px)`,
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            marginBottom: 24,
          }}>
            <div style={{
              width: 44, height: 44,
              borderRadius: '50%',
              background: 'rgba(0,0,0,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 26,
              flexShrink: 0,
            }}>
              🚫
            </div>
            <span style={{ fontSize: 64, fontWeight: 500, color: '#e8e8e8' }}>
              No eyeballs
            </span>
          </div>

          {/* Item 2: No impact */}
          <div style={{
            opacity: item2In,
            transform: `translateX(${interpolate(item2In, [0, 1], [-30, 0])}px)`,
            display: 'flex',
            alignItems: 'center',
            gap: 20,
          }}>
            <div style={{
              width: 44, height: 44,
              borderRadius: '50%',
              background: 'rgba(0,0,0,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 26,
              flexShrink: 0,
            }}>
              🚫
            </div>
            <span style={{ fontSize: 64, fontWeight: 500, color: '#e8e8e8' }}>
              No impact
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
