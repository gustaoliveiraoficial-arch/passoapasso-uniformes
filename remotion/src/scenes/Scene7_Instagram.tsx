import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

// Cena 7: "Instagram doesn't reward effort"
// Fundo rosa suave, texto "Instagram" com gradiente da marca, texto misto
export const Scene7Instagram: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cfg = { damping: 16, stiffness: 160, mass: 0.7 };

  const igIn   = spring({ frame, fps, config: cfg });
  const textIn = spring({ frame: frame - 18, fps, config: cfg });

  const scaleIn = interpolate(igIn, [0, 1], [0.6, 1]);

  return (
    <div style={{
      width: '100%', height: '100%',
      background: '#fdf2f2',
      position: 'relative',
      fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 30,
    }}>
      {/* Texto "Instagram" com gradiente da marca */}
      <div style={{
        opacity: igIn,
        transform: `scale(${scaleIn})`,
        fontSize: 148,
        fontWeight: 800,
        fontStyle: 'italic',
        background: 'linear-gradient(45deg, #833ab4, #fd1d1d, #fcb045)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        lineHeight: 1.1,
        textAlign: 'center',
        letterSpacing: -4,
        filter: 'drop-shadow(0 4px 20px rgba(131,58,180,0.25))',
      }}>
        Instagram
      </div>

      {/* Subtexto: "doesn't reward effort" */}
      <div style={{
        opacity: textIn,
        transform: `translateY(${interpolate(textIn, [0, 1], [40, 0])}px)`,
        display: 'flex',
        alignItems: 'baseline',
        gap: 16,
        flexWrap: 'wrap',
        justifyContent: 'center',
        paddingHorizontal: 60,
      }}>
        <span style={{ fontSize: 76, fontWeight: 400, color: '#1a1a1a' }}>
          doesn't
        </span>
        <span style={{ fontSize: 86, fontWeight: 800, color: '#cc1010' }}>
          reward
        </span>
        <span style={{ fontSize: 76, fontWeight: 400, color: '#1a1a1a' }}>
          effort
        </span>
      </div>
    </div>
  );
};
