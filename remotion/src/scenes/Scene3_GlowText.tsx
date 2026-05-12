import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

// Cena 3: "Because content / without an audience"
// Fundo preto puro, texto com efeito neon glow branco + vermelho
// Duas linhas aparecem em sequência com fade + glow pulsante
export const Scene3GlowText: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cfg = { damping: 20, stiffness: 140, mass: 0.8 };

  const line1In = spring({ frame, fps, config: cfg });
  const line2In = spring({ frame: frame - 30, fps, config: cfg });

  // Glow pulsante suave
  const pulse = Math.sin(frame * 0.15) * 0.15 + 0.85;

  const glowRed = `
    0 0 20px rgba(200,10,10,${0.9 * pulse}),
    0 0 50px rgba(200,10,10,${0.6 * pulse}),
    0 0 100px rgba(200,10,10,${0.3 * pulse})
  `;
  const glowWhite = `
    0 0 15px rgba(255,255,255,${0.7 * pulse}),
    0 0 40px rgba(255,255,255,${0.3 * pulse})
  `;

  const slideY = (p: number) => interpolate(p, [0, 1], [50, 0]);

  return (
    <div style={{
      width: '100%', height: '100%',
      background: '#000000',
      position: 'relative',
      fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 40,
    }}>
      {/* Linha 1: "Because content" */}
      <div style={{
        opacity: line1In,
        transform: `translateY(${slideY(line1In)}px)`,
        display: 'flex',
        alignItems: 'baseline',
        gap: 24,
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}>
        <span style={{
          fontSize: 90,
          fontWeight: 400,
          color: '#ffffff',
          textShadow: glowWhite,
          letterSpacing: -1,
        }}>
          Because
        </span>
        <span style={{
          fontSize: 104,
          fontWeight: 800,
          color: '#dd1111',
          textShadow: glowRed,
          letterSpacing: -1,
        }}>
          content
        </span>
      </div>

      {/* Linha 2: "without an audience" */}
      <div style={{
        opacity: line2In,
        transform: `translateY(${slideY(line2In)}px)`,
        display: 'flex',
        alignItems: 'baseline',
        gap: 20,
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}>
        <span style={{
          fontSize: 80,
          fontWeight: 400,
          color: '#ffffff',
          textShadow: glowWhite,
          letterSpacing: -1,
        }}>
          without an
        </span>
        <span style={{
          fontSize: 104,
          fontWeight: 800,
          color: '#dd1111',
          textShadow: glowRed,
          letterSpacing: -1,
        }}>
          audience
        </span>
      </div>
    </div>
  );
};
