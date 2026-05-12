import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

// Cena 8: Perfil Instagram dark mode - imran__visuals
// Fundo escuro, card de perfil desliza de baixo para cima
export const Scene8Profile: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cfg = { damping: 18, stiffness: 140, mass: 0.9 };

  const cardIn = spring({ frame, fps, config: cfg });
  const slideY = interpolate(cardIn, [0, 1], [200, 0]);

  return (
    <div style={{
      width: '100%', height: '100%',
      background: '#000000',
      position: 'relative',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {/* Card do perfil */}
      <div style={{
        opacity: cardIn,
        transform: `translateY(${slideY}px)`,
        width: 900,
        background: '#1c1c1e',
        borderRadius: 24,
        overflow: 'hidden',
        boxShadow: '0 30px 80px rgba(0,0,0,0.8)',
      }}>
        {/* Header do perfil */}
        <div style={{
          padding: '36px 40px 28px',
          borderBottom: '1px solid #2c2c2e',
        }}>
          {/* Username + ícones */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 28,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 40, fontWeight: 700, color: '#fff' }}>
                imran__visuals
              </span>
              <span style={{ fontSize: 28, color: '#fff' }}>✓</span>
              <span style={{ fontSize: 28 }}>🔴</span>
            </div>
            <div style={{ display: 'flex', gap: 20, color: '#fff', fontSize: 36 }}>
              <span>⊕</span>
              <span>☰</span>
            </div>
          </div>

          {/* Foto + stats */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 40, marginBottom: 24 }}>
            {/* Avatar */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div style={{
                width: 140,
                height: 140,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                padding: 3,
              }}>
                <div style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  background: '#2c2c2e',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 56,
                }}>
                  🎬
                </div>
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: 60, flex: 1, justifyContent: 'center' }}>
              {[
                { num: '19', label: 'posts' },
                { num: '504', label: 'followers' },
                { num: '68', label: 'following' },
              ].map(({ num, label }) => (
                <div key={label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 44, fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>
                    {num}
                  </div>
                  <div style={{ fontSize: 30, color: '#8e8e93' }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Nome e bio */}
          <div style={{ color: '#fff' }}>
            <div style={{ fontSize: 34, fontWeight: 600, marginBottom: 8 }}>
              Imran | Video Editor 🎬
            </div>
            <div style={{ fontSize: 30, color: '#8e8e93', marginBottom: 4 }}>
              Editor
            </div>
            <div style={{ fontSize: 30, color: '#e8e8e8', lineHeight: 1.5 }}>
              Helping Creators & Brands Grow with<br />
              High-Quality Video Editing<br />
              Specializing in Short Form 🎬<br />
              ✏️ DM "Grow" to get started
            </div>
          </div>
        </div>

        {/* Botão Share a note */}
        <div style={{
          padding: '20px 40px',
          display: 'flex',
          alignItems: 'center',
          gap: 20,
        }}>
          <div style={{
            background: '#2c2c2e',
            borderRadius: 20,
            padding: '12px 28px',
            fontSize: 28,
            color: '#ffffff',
            fontWeight: 500,
          }}>
            Share a note
          </div>
        </div>
      </div>
    </div>
  );
};
