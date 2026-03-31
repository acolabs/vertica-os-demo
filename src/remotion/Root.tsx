import { Composition } from 'remotion';
import { FPS, WIDTH, HEIGHT, DURATIONS } from './lib/constants';

import HeroLoop from './compositions/HeroLoop';
import EntropyToSystem from './compositions/EntropyToSystem';
import OSExplodedView from './compositions/OSExplodedView';
import WorkflowMiniRun from './compositions/WorkflowMiniRun';
import PolicyGate from './compositions/PolicyGate';
import AttributionThread from './compositions/AttributionThread';
import DemoDoor from './compositions/DemoDoor';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="HeroLoop"
        component={HeroLoop}
        durationInFrames={DURATIONS.HERO_LOOP}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="EntropyToSystem"
        component={EntropyToSystem}
        durationInFrames={DURATIONS.ENTROPY_TO_SYSTEM}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="OSExplodedView"
        component={OSExplodedView}
        durationInFrames={DURATIONS.OS_EXPLODED_VIEW}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="WorkflowMiniRun"
        component={WorkflowMiniRun}
        durationInFrames={DURATIONS.WORKFLOW_MINI_RUN}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{ variant: 'churn' as const }}
      />
      <Composition
        id="WorkflowMiniRun-Support"
        component={WorkflowMiniRun}
        durationInFrames={DURATIONS.WORKFLOW_MINI_RUN}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{ variant: 'support' as const }}
      />
      <Composition
        id="WorkflowMiniRun-Expansion"
        component={WorkflowMiniRun}
        durationInFrames={DURATIONS.WORKFLOW_MINI_RUN}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{ variant: 'expansion' as const }}
      />
      <Composition
        id="WorkflowMiniRun-Compliance"
        component={WorkflowMiniRun}
        durationInFrames={DURATIONS.WORKFLOW_MINI_RUN}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{ variant: 'compliance' as const }}
      />
      <Composition
        id="PolicyGate"
        component={PolicyGate}
        durationInFrames={DURATIONS.POLICY_GATE}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="AttributionThread"
        component={AttributionThread}
        durationInFrames={DURATIONS.ATTRIBUTION_THREAD}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="DemoDoor"
        component={DemoDoor}
        durationInFrames={DURATIONS.DEMO_DOOR}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    </>
  );
};
