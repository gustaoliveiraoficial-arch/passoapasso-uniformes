import React from 'react';

// Faixa curva cinza que aparece no fundo das cenas 4, 6 e 9
export const CurvedStripe: React.FC = () => (
  <svg
    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}
    viewBox="0 0 1080 1920"
    preserveAspectRatio="none"
  >
    <path
      d="M -150 1700 Q 100 1400 300 1200 Q 600 900 780 600 Q 950 350 1250 50"
      stroke="#d0cac2"
      strokeWidth="280"
      fill="none"
      strokeLinecap="round"
    />
  </svg>
);
