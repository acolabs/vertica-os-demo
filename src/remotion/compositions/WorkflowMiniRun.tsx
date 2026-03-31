import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { colors, fonts } from '../lib/design-tokens';

type Variant = 'churn' | 'support' | 'expansion' | 'compliance';

interface VariantConfig {
  trigger: string;
  process: string;
  outcome: string;
  color: string;
}

const VARIANTS: Record<Variant, VariantConfig> = {
  churn: {
    trigger: 'Churn Signal',
    process: 'Churn Agent',
    outcome: 'Save Plan Sent',
    color: colors.danger,
  },
  support: {
    trigger: 'Ticket Filed',
    process: 'Support Agent',
    outcome: 'Auto-Resolved',
    color: colors.info,
  },
  expansion: {
    trigger: 'Usage Spike',
    process: 'Growth Agent',
    outcome: 'Upsell Proposal',
    color: colors.primary,
  },
  compliance: {
    trigger: 'Policy Change',
    process: 'Compliance Agent',
    outcome: 'Audit Updated',
    color: colors.purple,
  },
};

/* Stage positions */
const STAGE_Y = 320;
const STAGE_XS = [240, 580, 920];
const NODE_RADIUS = 52;

const WorkflowMiniRun: React.FC<{ variant?: Variant }> = ({ variant = 'churn' }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const config = VARIANTS[variant];

  /* Stage appearances */
  const stage1 = spring({ frame, fps, config: { damping: 14, stiffness: 100 } });
  const stage2 = spring({ frame: frame - 30, fps, config: { damping: 14, stiffness: 100 } });
  const stage3 = spring({ frame: frame - 60, fps, config: { damping: 14, stiffness: 100 } });

  /* Connecting line draw progress */
  const line1Progress = interpolate(frame, [20, 50], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const line2Progress = interpolate(frame, [50, 80], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  /* Gear rotation for processing node */
  const gearAngle = interpolate(frame, [30, 120], [0, 720], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  /* Outcome pulse */
  const outcomePulse = interpolate(frame, [75, 85, 95, 105], [1, 1.12, 1, 1.06], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const lineLength = Math.sqrt(
    Math.pow(STAGE_XS[1] - STAGE_XS[0] - NODE_RADIUS * 2, 2)
  );

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      {/* Title */}
      <div
        style={{
          position: 'absolute',
          top: 50,
          left: 0,
          width: '100%',
          textAlign: 'center',
          fontFamily: fonts.sans,
          fontSize: 14,
          fontWeight: 600,
          color: config.color,
          letterSpacing: 3,
          textTransform: 'uppercase',
          opacity: interpolate(frame, [0, 15], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      >
        {variant.toUpperCase()} WORKFLOW
      </div>

      {/* SVG connecting lines */}
      <svg
        width={width}
        height={720}
        style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
      >
        {/* Line 1: Trigger -> Process */}
        <line
          x1={STAGE_XS[0] + NODE_RADIUS}
          y1={STAGE_Y}
          x2={STAGE_XS[0] + NODE_RADIUS + (STAGE_XS[1] - STAGE_XS[0] - NODE_RADIUS * 2) * line1Progress}
          y2={STAGE_Y}
          stroke={config.color}
          strokeWidth={2}
          strokeLinecap="round"
        />
        {/* Arrow head 1 */}
        {line1Progress > 0.9 && (
          <polygon
            points={`${STAGE_XS[1] - NODE_RADIUS - 2},${STAGE_Y - 6} ${STAGE_XS[1] - NODE_RADIUS + 6},${STAGE_Y} ${STAGE_XS[1] - NODE_RADIUS - 2},${STAGE_Y + 6}`}
            fill={config.color}
            opacity={interpolate(line1Progress, [0.9, 1], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            })}
          />
        )}

        {/* Line 2: Process -> Outcome */}
        <line
          x1={STAGE_XS[1] + NODE_RADIUS}
          y1={STAGE_Y}
          x2={STAGE_XS[1] + NODE_RADIUS + (STAGE_XS[2] - STAGE_XS[1] - NODE_RADIUS * 2) * line2Progress}
          y2={STAGE_Y}
          stroke={config.color}
          strokeWidth={2}
          strokeLinecap="round"
        />
        {/* Arrow head 2 */}
        {line2Progress > 0.9 && (
          <polygon
            points={`${STAGE_XS[2] - NODE_RADIUS - 2},${STAGE_Y - 6} ${STAGE_XS[2] - NODE_RADIUS + 6},${STAGE_Y} ${STAGE_XS[2] - NODE_RADIUS - 2},${STAGE_Y + 6}`}
            fill={config.color}
            opacity={interpolate(line2Progress, [0.9, 1], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            })}
          />
        )}
      </svg>

      {/* Stage 1: Trigger */}
      <div
        style={{
          position: 'absolute',
          left: STAGE_XS[0] - NODE_RADIUS,
          top: STAGE_Y - NODE_RADIUS,
          width: NODE_RADIUS * 2,
          height: NODE_RADIUS * 2,
          borderRadius: '50%',
          background: `${config.color}15`,
          border: `2px solid ${config.color}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: fonts.sans,
          fontSize: 11,
          fontWeight: 600,
          color: config.color,
          textAlign: 'center',
          transform: `scale(${stage1})`,
          opacity: stage1,
          lineHeight: '1.3',
          padding: 8,
        }}
      >
        {config.trigger}
      </div>
      <div
        style={{
          position: 'absolute',
          left: STAGE_XS[0] - 60,
          top: STAGE_Y + NODE_RADIUS + 14,
          width: 120,
          textAlign: 'center',
          fontFamily: fonts.sans,
          fontSize: 11,
          color: colors.textMuted,
          opacity: stage1,
        }}
      >
        TRIGGER
      </div>

      {/* Stage 2: Processing */}
      <div
        style={{
          position: 'absolute',
          left: STAGE_XS[1] - NODE_RADIUS,
          top: STAGE_Y - NODE_RADIUS,
          width: NODE_RADIUS * 2,
          height: NODE_RADIUS * 2,
          borderRadius: '50%',
          background: `${config.color}15`,
          border: `2px solid ${config.color}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: fonts.sans,
          fontSize: 11,
          fontWeight: 600,
          color: config.color,
          textAlign: 'center',
          transform: `scale(${stage2}) rotate(${gearAngle * 0.1}deg)`,
          opacity: stage2,
          lineHeight: '1.3',
          padding: 8,
        }}
      >
        {config.process}
      </div>
      <div
        style={{
          position: 'absolute',
          left: STAGE_XS[1] - 60,
          top: STAGE_Y + NODE_RADIUS + 14,
          width: 120,
          textAlign: 'center',
          fontFamily: fonts.sans,
          fontSize: 11,
          color: colors.textMuted,
          opacity: stage2,
        }}
      >
        PROCESSING
      </div>

      {/* Gear ring indicator around processing */}
      <svg
        width={NODE_RADIUS * 2 + 20}
        height={NODE_RADIUS * 2 + 20}
        style={{
          position: 'absolute',
          left: STAGE_XS[1] - NODE_RADIUS - 10,
          top: STAGE_Y - NODE_RADIUS - 10,
          opacity: stage2 * interpolate(frame, [30, 60, 70, 90], [0, 0.6, 0.6, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      >
        <circle
          cx={NODE_RADIUS + 10}
          cy={NODE_RADIUS + 10}
          r={NODE_RADIUS + 6}
          fill="none"
          stroke={config.color}
          strokeWidth={2}
          strokeDasharray="8 6"
          strokeDashoffset={-gearAngle * 0.5}
        />
      </svg>

      {/* Stage 3: Outcome */}
      <div
        style={{
          position: 'absolute',
          left: STAGE_XS[2] - NODE_RADIUS,
          top: STAGE_Y - NODE_RADIUS,
          width: NODE_RADIUS * 2,
          height: NODE_RADIUS * 2,
          borderRadius: '50%',
          background: `${colors.primary}25`,
          border: `2px solid ${colors.primary}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: fonts.sans,
          fontSize: 11,
          fontWeight: 700,
          color: colors.primary,
          textAlign: 'center',
          transform: `scale(${stage3 * outcomePulse})`,
          opacity: stage3,
          lineHeight: '1.3',
          padding: 8,
          boxShadow: stage3 > 0.8 ? `0 0 24px ${colors.primary}44` : 'none',
        }}
      >
        {config.outcome}
      </div>
      <div
        style={{
          position: 'absolute',
          left: STAGE_XS[2] - 60,
          top: STAGE_Y + NODE_RADIUS + 14,
          width: 120,
          textAlign: 'center',
          fontFamily: fonts.sans,
          fontSize: 11,
          color: colors.textMuted,
          opacity: stage3,
        }}
      >
        OUTCOME
      </div>
    </AbsoluteFill>
  );
};

export default WorkflowMiniRun;
