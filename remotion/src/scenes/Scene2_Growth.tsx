import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

// Cena 2: "But your growth?"
// Fundo preto, homem de terno com orb branco brilhante como cabeça
// Texto aparece dentro do orb
export const Scene2Growth: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cfg = { damping: 18, stiffness: 160, mass: 0.7 };

  const figureIn  = spring({ frame, fps, config: cfg });
  const text1In   = spring({ frame: frame - 15, fps, config: cfg });
  const text2In   = spring({ frame: frame - 28, fps, config: cfg });

  const scaleUp = interpolate(figureIn, [0, 1], [0.85, 1]);

  return (
    <div style={{
      width: '100%', height: '100%',
      background: '#0a0a0a',
      position: 'relative',
      fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {/* Figura do homem de terno + orb */}
      <div style={{
        opacity: figureIn,
        transform: `scale(${scaleUp})`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
      }}>
        {/* Orb branco (cabeça) */}
        <div style={{
          width: 380,
          height: 380,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 40% 40%, #ffffff, #e8e8e8)',
          boxShadow: '0 0 80px 30px rgba(255,255,255,0.35), 0 0 160px 60px rgba(255,255,255,0.15)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 2,
        }}>
          {/* Texto dentro do orb */}
          <div style={{
            opacity: text1In,
            transform: `translateY(${interpolate(text1In, [0, 1], [20, 0])}px)`,
            fontSize: 60,
            fontWeight: 400,
            color: '#1a1a1a',
            textAlign: 'center',
            lineHeight: 1.2,
          }}>
            But your
          </div>
          <div style={{
            opacity: text2In,
            transform: `translateY(${interpolate(text2In, [0, 1], [20, 0])}px)`,
            fontSize: 66,
            fontWeight: 800,
            color: '#cc1010',
            textAlign: 'center',
            lineHeight: 1.2,
          }}>
            growth?
          </div>
        </div>

        {/* Corpo do terno */}
        <div style={{
          width: 480,
          height: 640,
          background: 'radial-gradient(ellipse at 50% 20%, #333, #111)',
          borderRadius: '40px 40px 0 0',
          marginTop: -20,
          position: 'relative',
          zIndex: 1,
          overflow: 'hidden',
        }}>
          {/* Gravata */}
          <div style={{
            position: 'absolute',
            top: 30,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 60,
            height: 220,
            background: 'linear-gradient(180deg, #555 0%, #333 100%)',
            clipPath: 'polygon(30% 0%, 70% 0%, 80% 40%, 60% 100%, 40% 100%, 20% 40%)',
          }} />
          {/* Camisa */}
          <div style={{
            position: 'absolute',
            top: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 120,
            height: 180,
            background: '#f0f0f0',
            clipPath: 'polygon(30% 0%, 70% 0%, 75% 100%, 25% 100%)',
          }} />
          {/* Bolinhas no terno - textura */}
          {Array.from({ length: 80 }).map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              left: `${(i % 10) * 10 + 2}%`,
              top: `${Math.floor(i / 10) * 12 + 5}%`,
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.12)',
            }} />
          ))}
          {/* Braços cruzados */}
          <div style={{
            position: 'absolute',
            bottom: 120,
            left: 40,
            right: 40,
            height: 80,
            background: 'linear-gradient(90deg, #2a2a2a, #3a3a3a, #2a2a2a)',
            borderRadius: 40,
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          }} />
        </div>
      </div>
    </div>
  );
};
