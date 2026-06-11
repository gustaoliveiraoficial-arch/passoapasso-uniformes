export const WIDTH = 1080;
export const HEIGHT = 1920;
export const FPS = 30;

// Cores do tema Pódio de Vendas
export const COLORS = {
  bg: '#0a0a0f',
  bgCard: '#111118',
  gold: '#f59e0b',
  goldLight: '#fde68a',
  silver: '#94a3b8',
  silverLight: '#e2e8f0',
  bronze: '#b45309',
  bronzeLight: '#fbbf24',
  accent: '#6366f1',
  accentLight: '#a5b4fc',
  white: '#ffffff',
  gray: '#4b5563',
  grayLight: '#9ca3af',
  green: '#10b981',
  text: '#f9fafb',
  textMuted: '#6b7280',
};

// Duração das cenas em frames (30fps)
export const SCENES = {
  abertura:  { start: 0,   duration: 90  }, // 3s
  problema:  { start: 90,  duration: 150 }, // 5s
  dashboard: { start: 240, duration: 210 }, // 7s
  podio:     { start: 450, duration: 240 }, // 8s
  features:  { start: 690, duration: 300 }, // 10s
  planos:    { start: 990, duration: 270 }, // 9s
  cta:       { start: 1260,duration: 210 }, // 7s
};

export const TOTAL_FRAMES = 1470; // 49s
