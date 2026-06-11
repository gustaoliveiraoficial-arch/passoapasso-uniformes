import { AbsoluteFill, Series } from 'remotion';
import { FadeTransition } from './components/Transition';
import { SceneAbertura } from './components/SceneAbertura';
import { SceneProblema } from './components/SceneProblema';
import { SceneDashboard } from './components/SceneDashboard';
import { ScenePodio } from './components/ScenePodio';
import { SceneFeatures } from './components/SceneFeatures';
import { ScenePlanos } from './components/ScenePlanos';
import { SceneCTA } from './components/SceneCTA';

export const PodioAd: React.FC = () => {
  return (
    <AbsoluteFill>
      <Series>
        {/* Abertura: 3s */}
        <Series.Sequence durationInFrames={90}>
          <FadeTransition totalFrames={90} durationIn={10} durationOut={15}>
            <SceneAbertura />
          </FadeTransition>
        </Series.Sequence>

        {/* Problema: 5s */}
        <Series.Sequence durationInFrames={150}>
          <FadeTransition totalFrames={150} durationIn={12} durationOut={15}>
            <SceneProblema />
          </FadeTransition>
        </Series.Sequence>

        {/* Dashboard: 7s */}
        <Series.Sequence durationInFrames={210}>
          <FadeTransition totalFrames={210} durationIn={12} durationOut={15}>
            <SceneDashboard />
          </FadeTransition>
        </Series.Sequence>

        {/* Pódio: 8s */}
        <Series.Sequence durationInFrames={240}>
          <FadeTransition totalFrames={240} durationIn={12} durationOut={15}>
            <ScenePodio />
          </FadeTransition>
        </Series.Sequence>

        {/* Features: 10s */}
        <Series.Sequence durationInFrames={300}>
          <FadeTransition totalFrames={300} durationIn={12} durationOut={15}>
            <SceneFeatures />
          </FadeTransition>
        </Series.Sequence>

        {/* Planos: 9s */}
        <Series.Sequence durationInFrames={270}>
          <FadeTransition totalFrames={270} durationIn={12} durationOut={15}>
            <ScenePlanos />
          </FadeTransition>
        </Series.Sequence>

        {/* CTA: 7s */}
        <Series.Sequence durationInFrames={210}>
          <FadeTransition totalFrames={210} durationIn={12} durationOut={10}>
            <SceneCTA />
          </FadeTransition>
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
