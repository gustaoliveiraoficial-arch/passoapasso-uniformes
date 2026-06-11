import { Composition } from 'remotion';
import { PodioAd } from './PodioAd';
import { WIDTH, HEIGHT, FPS, TOTAL_FRAMES } from './constants';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="PodioAd"
        component={PodioAd}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    </>
  );
};
