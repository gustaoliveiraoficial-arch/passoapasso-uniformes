import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

// Cena 1: "You've got the ideas and content"
// Fundo creme, lâmpada grande à esquerda, barcode top-right, borboleta
// Palavras surgem com slide-up em sequência
export const Scene1Ideas: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cfg = { damping: 14, stiffness: 180, mass: 0.6 };

  const p1 = spring({ frame, fps, config: cfg });
  const p2 = spring({ frame: frame - 10, fps, config: cfg });
  const p3 = spring({ frame: frame - 20, fps, config: cfg });

  const slideY = (p: number) => interpolate(p, [0, 1], [60, 0]);

  return (
    <div style={{
      width: '100%', height: '100%',
      background: '#ede8e0',
      position: 'relative',
      fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
      overflow: 'hidden',
    }}>
      {/* Lâmpada grande à esquerda */}
      <div style={{
        position: 'absolute',
        left: -60,
        top: 80,
        fontSize: 820,
        lineHeight: 1,
        opacity: 0.55,
        filter: 'grayscale(20%) brightness(0.9)',
        userSelect: 'none',
      }}>
        💡
      </div>

      {/* Barcode top-right */}
      <div style={{
        position: 'absolute',
        top: 60,
        right: 60,
        display: 'flex',
        alignItems: 'stretch',
        height: 80,
        gap: 4,
      }}>
        {[3,1,2,3,1,2,1,3,2,1,2,3,1,2,1,3,2,1].map((w, i) => (
          <div key={i} style={{
            width: w * 5,
            height: '100%',
            background: '#222',
            borderRadius: 1,
          }} />
        ))}
      </div>

      {/* Texto principal - posicionado no centro-direito */}
      <div style={{
        position: 'absolute',
        top: '42%',
        left: 80,
        right: 70,
        transform: 'translateY(-50%)',
      }}>
        {/* Linha 1 */}
        <div style={{
          opacity: p1,
          transform: `translateY(${slideY(p1)}px)`,
          fontSize: 84,
          fontWeight: 400,
          color: '#1a1a1a',
          lineHeight: 1.2,
          marginBottom: 8,
        }}>
          You've got the
        </div>

        {/* Linha 2 */}
        <div style={{
          opacity: p2,
          transform: `translateY(${slideY(p2)}px)`,
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
          marginBottom: 8,
        }}>
          <span style={{ fontSize: 96, fontWeight: 800, color: '#cc1010', lineHeight: 1.2 }}>
            ideas
          </span>
          <span style={{ fontSize: 84, fontWeight: 400, color: '#1a1a1a', lineHeight: 1.2 }}>
            and
          </span>
          <span style={{ fontSize: 80, lineHeight: 1 }}>🦋</span>
        </div>

        {/* Linha 3 */}
        <div style={{
          opacity: p3,
          transform: `translateY(${slideY(p3)}px)`,
          fontSize: 96,
          fontWeight: 800,
          color: '#cc1010',
          lineHeight: 1.2,
        }}>
          content
        </div>
      </div>
    </div>
  );
};
