import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { CurvedStripe } from '../components/CurvedStripe';

// Cena 9: "But not smart"
// Fundo creme + faixa curva, emoji 😎 central, emojis nos cantos voando
// "But not" preto + "smart" rosa/salmon
export const Scene9Smart: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cfg = { damping: 12, stiffness: 180, mass: 0.5 };

  const textIn   = spring({ frame, fps, config: cfg });
  const mainIn   = spring({ frame: frame - 8, fps, config: cfg });
  const corner1  = spring({ frame: frame - 0, fps, config: { damping: 10, stiffness: 160, mass: 0.6 } });
  const corner2  = spring({ frame: frame - 5, fps, config: { damping: 10, stiffness: 160, mass: 0.6 } });
  const corner3  = spring({ frame: frame - 10, fps, config: { damping: 10, stiffness: 160, mass: 0.6 } });
  const corner4  = spring({ frame: frame - 15, fps, config: { damping: 10, stiffness: 160, mass: 0.6 } });

  // Float suave dos emojis nos cantos
  const float1 = Math.sin(frame * 0.12) * 18;
  const float2 = Math.sin(frame * 0.14 + 1) * 15;
  const float3 = Math.sin(frame * 0.11 + 2) * 20;
  const float4 = Math.sin(frame * 0.13 + 0.5) * 16;

  // Wobble do emoji central
  const mainWobble = Math.sin(frame * 0.15) * 6;

  return (
    <div style={{
      width: '100%', height: '100%',
      background: '#ede8e0',
      position: 'relative',
      fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
      overflow: 'hidden',
    }}>
      <CurvedStripe />

      {/* Emoji canto superior-esquerdo */}
      <div style={{
        position: 'absolute', top: 80, left: 60,
        fontSize: 200,
        opacity: corner1,
        transform: `translateY(${interpolate(corner1, [0, 1], [-120, 0]) + float1}px) rotate(-15deg)`,
        filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.15))',
        zIndex: 1,
        userSelect: 'none',
      }}>🌟</div>

      {/* Emoji canto superior-direito */}
      <div style={{
        position: 'absolute', top: 60, right: 50,
        fontSize: 180,
        opacity: corner2,
        transform: `translateY(${interpolate(corner2, [0, 1], [-100, 0]) + float2}px) rotate(12deg)`,
        filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.15))',
        zIndex: 1,
        userSelect: 'none',
      }}>💡</div>

      {/* Emoji canto inferior-esquerdo */}
      <div style={{
        position: 'absolute', bottom: 100, left: 40,
        fontSize: 190,
        opacity: corner3,
        transform: `translateY(${interpolate(corner3, [0, 1], [120, 0]) + float3}px) rotate(-8deg)`,
        filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.15))',
        zIndex: 1,
        userSelect: 'none',
      }}>🏆</div>

      {/* Emoji canto inferior-direito */}
      <div style={{
        position: 'absolute', bottom: 80, right: 60,
        fontSize: 170,
        opacity: corner4,
        transform: `translateY(${interpolate(corner4, [0, 1], [100, 0]) + float4}px) rotate(10deg)`,
        filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.15))',
        zIndex: 1,
        userSelect: 'none',
      }}>🎯</div>

      {/* Emoji principal 😎 com dedo apontando */}
      <div style={{
        position: 'absolute',
        top: '38%',
        left: '50%',
        transform: `translate(-50%, -50%) scale(${interpolate(mainIn, [0, 1], [0.3, 1])}) rotate(${mainWobble}deg)`,
        opacity: mainIn,
        fontSize: 380,
        lineHeight: 1,
        zIndex: 2,
        userSelect: 'none',
        filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.2))',
      }}>
        😎
      </div>

      {/* Texto "But not smart" */}
      <div style={{
        position: 'absolute',
        top: '68%',
        left: 80,
        right: 80,
        opacity: textIn,
        transform: `translateY(${interpolate(textIn, [0, 1], [50, 0])}px)`,
        zIndex: 3,
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 20,
          flexWrap: 'wrap',
        }}>
          <span style={{ fontSize: 96, fontWeight: 400, color: '#2a2a2a' }}>
            But not
          </span>
          <span style={{ fontSize: 108, fontWeight: 800, color: '#e05a8a' }}>
            smart
          </span>
        </div>
      </div>
    </div>
  );
};
