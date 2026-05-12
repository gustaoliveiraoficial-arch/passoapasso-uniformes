import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { CurvedStripe } from '../components/CurvedStripe';

// Cena 4: "is just noise"
// Fundo creme + faixa curva cinza, emoji palhaço 🤡, texto com slide
export const Scene4Noise: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cfg = { damping: 12, stiffness: 200, mass: 0.5 };

  const clownIn   = spring({ frame, fps, config: cfg });
  const textIn    = spring({ frame: frame - 12, fps, config: cfg });

  // Palhaço balança levemente
  const wobble = Math.sin(frame * 0.2) * 8;

  return (
    <div style={{
      width: '100%', height: '100%',
      background: '#ede8e0',
      position: 'relative',
      fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
      overflow: 'hidden',
    }}>
      <CurvedStripe />

      {/* Emoji palhaço */}
      <div style={{
        position: 'absolute',
        top: '38%',
        left: '50%',
        transform: `translate(-50%, -50%) scale(${interpolate(clownIn, [0, 1], [0.4, 1])}) rotate(${wobble}deg)`,
        opacity: clownIn,
        fontSize: 420,
        lineHeight: 1,
        userSelect: 'none',
        zIndex: 1,
        filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.2))',
      }}>
        🤡
      </div>

      {/* Texto "is just noise" */}
      <div style={{
        position: 'absolute',
        top: '68%',
        left: 80,
        right: 80,
        opacity: textIn,
        transform: `translateY(${interpolate(textIn, [0, 1], [50, 0])}px)`,
        zIndex: 2,
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 20,
          flexWrap: 'wrap',
        }}>
          <span style={{ fontSize: 96, fontWeight: 400, color: '#2a2a2a' }}>
            is just
          </span>
          <span style={{ fontSize: 108, fontWeight: 800, color: '#cc1010' }}>
            noise
          </span>
        </div>
      </div>
    </div>
  );
};
