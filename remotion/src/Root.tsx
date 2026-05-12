import { Composition } from 'remotion';
import { Scene1Ideas } from './scenes/Scene1_Ideas';
import { Scene2Growth } from './scenes/Scene2_Growth';
import { Scene3GlowText } from './scenes/Scene3_GlowText';
import { Scene4Noise } from './scenes/Scene4_Noise';
import { Scene5Briefcase } from './scenes/Scene5_Briefcase';
import { Scene6Value } from './scenes/Scene6_Value';
import { Scene7Instagram } from './scenes/Scene7_Instagram';
import { Scene8Profile } from './scenes/Scene8_Profile';
import { Scene9Smart } from './scenes/Scene9_Smart';

const W = 1080;
const H = 1920;
const FPS = 30;

export const RemotionRoot = () => {
  return (
    <>
      <Composition id="Scene1-Ideas"     component={Scene1Ideas}     durationInFrames={60} fps={FPS} width={W} height={H} />
      <Composition id="Scene2-Growth"    component={Scene2Growth}    durationInFrames={65} fps={FPS} width={W} height={H} />
      <Composition id="Scene3-GlowText"  component={Scene3GlowText}  durationInFrames={80} fps={FPS} width={W} height={H} />
      <Composition id="Scene4-Noise"     component={Scene4Noise}     durationInFrames={60} fps={FPS} width={W} height={H} />
      <Composition id="Scene5-Briefcase" component={Scene5Briefcase} durationInFrames={65} fps={FPS} width={W} height={H} />
      <Composition id="Scene6-Value"     component={Scene6Value}     durationInFrames={80} fps={FPS} width={W} height={H} />
      <Composition id="Scene7-Instagram" component={Scene7Instagram} durationInFrames={65} fps={FPS} width={W} height={H} />
      <Composition id="Scene8-Profile"   component={Scene8Profile}   durationInFrames={65} fps={FPS} width={W} height={H} />
      <Composition id="Scene9-Smart"     component={Scene9Smart}     durationInFrames={65} fps={FPS} width={W} height={H} />
    </>
  );
};
