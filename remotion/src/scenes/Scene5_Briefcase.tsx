import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

// Cena 5: "And the audience is the"
// Fundo escuro, maleta aberta com dinheiro, texto em camadas
export const Scene5Briefcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cfg = { damping: 16, stiffness: 150, mass: 0.7 };

  const briefcaseIn = spring({ frame, fps, config: cfg });
  const text1In     = spring({ frame: frame - 15, fps, config: cfg });
  const text2In     = spring({ frame: frame - 28, fps, config: cfg });

  const scaleIn = interpolate(briefcaseIn, [0, 1], [0.7, 1]);
  const slideY  = (p: number) => interpolate(p, [0, 1], [40, 0]);

  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'radial-gradient(ellipse at 50% 40%, #1e1e1e 0%, #090909 100%)',
      position: 'relative',
      fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {/* Grid sutil de fundo */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }} />

      {/* Maleta com dinheiro */}
      <div style={{
        opacity: briefcaseIn,
        transform: `scale(${scaleIn})`,
        position: 'relative',
        zIndex: 1,
        marginBottom: 60,
      }}>
        {/* Corpo da maleta */}
        <div style={{
          width: 600,
          height: 380,
          background: 'linear-gradient(160deg, #a8a8a8, #787878)',
          borderRadius: '20px 20px 16px 16px',
          position: 'relative',
          boxShadow: '0 30px 80px rgba(0,0,0,0.8), inset 0 2px 4px rgba(255,255,255,0.3)',
          overflow: 'hidden',
        }}>
          {/* Interior da maleta (aberta) */}
          <div style={{
            position: 'absolute',
            top: 30, left: 30, right: 30, bottom: 20,
            background: 'linear-gradient(160deg, #4a3a20, #2e2410)',
            borderRadius: 10,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8,
            padding: 20,
            alignContent: 'center',
            justifyContent: 'center',
          }}>
            {/* Maços de dinheiro */}
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} style={{
                width: 110,
                height: 52,
                background: `linear-gradient(135deg, #6aaa64 0%, #4a8a44 100%)`,
                borderRadius: 4,
                border: '1px solid rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 24,
                color: 'rgba(255,255,255,0.5)',
                fontWeight: 800,
                transform: `rotate(${(i % 3 - 1) * 4}deg)`,
                boxShadow: '2px 2px 8px rgba(0,0,0,0.4)',
              }}>
                $
              </div>
            ))}
          </div>
          {/* Fechos */}
          <div style={{
            position: 'absolute',
            top: 14, left: '50%',
            transform: 'translateX(-50%)',
            width: 120, height: 20,
            background: '#c8c0b0',
            borderRadius: 10,
            boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
          }} />
        </div>
        {/* Alça */}
        <div style={{
          position: 'absolute',
          top: -50,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 200,
          height: 60,
          border: '14px solid #8a8a8a',
          borderBottom: 'none',
          borderRadius: '40px 40px 0 0',
        }} />
      </div>

      {/* Texto */}
      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
        <div style={{
          opacity: text1In,
          transform: `translateY(${slideY(text1In)}px)`,
          display: 'flex',
          alignItems: 'baseline',
          gap: 20,
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}>
          <span style={{ fontSize: 80, fontWeight: 400, color: '#ffffff' }}>And the</span>
          <span style={{
            fontSize: 96, fontWeight: 800, color: '#dd1111',
            textShadow: '0 0 30px rgba(220,30,30,0.4)',
          }}>audience</span>
        </div>
        <div style={{
          opacity: text2In,
          transform: `translateY(${slideY(text2In)}px)`,
          fontSize: 80,
          fontWeight: 400,
          color: '#ffffff',
          marginTop: 10,
        }}>
          is the
        </div>
      </div>
    </div>
  );
};
