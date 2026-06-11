import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';

export const FadeTransition: React.FC<{ children: React.ReactNode; durationIn?: number; durationOut?: number; totalFrames: number }> = ({
  children,
  durationIn = 15,
  durationOut = 15,
  totalFrames,
}) => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, durationIn], [0, 1], { extrapolateRight: 'clamp' });
  const fadeOut = interpolate(frame, [totalFrames - durationOut, totalFrames], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const opacity = Math.min(fadeIn, fadeOut);

  return (
    <AbsoluteFill style={{ opacity }}>
      {children}
    </AbsoluteFill>
  );
};
