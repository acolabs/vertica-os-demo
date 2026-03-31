import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { colors, fonts } from '../lib/design-tokens';

const LAYERS = [
  { label: 'Data Connectors', tint: colors.info, sublabel: 'CRM, ERP, Support, Billing' },
  { label: 'Agent Runtime', tint: colors.primary, sublabel: 'Autonomous execution engine' },
  { label: 'Policy Engine', tint: colors.purple, sublabel: 'Governance & guardrails' },
  { label: 'Decision Layer', tint: colors.warning, sublabel: 'Prioritization & routing' },
  { label: 'Human Interface', tint: colors.textPrimary, sublabel: 'Dashboards & approvals' },
];

const LAYER_HEIGHT = 54;
const LAYER_WIDTH = 600;
const GAP_COLLAPSED = 6;
const GAP_EXPLODED = 80;

const OSExplodedView: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  /* Phase timing:
     0–60: collapsed (assembled)
     60–150: exploding apart
     150–210: hold exploded
     210–300: reassemble
  */
  const explodeProgress = interpolate(
    frame,
    [60, 150, 210, 300],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  /* Total stack height */
  const totalCollapsed = LAYERS.length * LAYER_HEIGHT + (LAYERS.length - 1) * GAP_COLLAPSED;
  const totalExploded = LAYERS.length * LAYER_HEIGHT + (LAYERS.length - 1) * GAP_EXPLODED;
  const currentTotalH = totalCollapsed + (totalExploded - totalCollapsed) * explodeProgress;
  const stackTop = (height - currentTotalH) / 2;

  /* Label opacity — show during exploded phase */
  const labelOpacity = interpolate(frame, [100, 130, 220, 250], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  /* Title */
  const titleOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      {/* Title */}
      <div
        style={{
          position: 'absolute',
          top: 40,
          left: 0,
          width: '100%',
          textAlign: 'center',
          fontFamily: fonts.sans,
          fontSize: 22,
          fontWeight: 700,
          color: colors.textPrimary,
          opacity: titleOpacity,
          letterSpacing: 1,
        }}
      >
        Agent OS Architecture
      </div>

      {/* Layers (bottom-up: index 0 = bottom) */}
      {LAYERS.map((layer, i) => {
        const currentGap = GAP_COLLAPSED + (GAP_EXPLODED - GAP_COLLAPSED) * explodeProgress;
        const y = stackTop + i * (LAYER_HEIGHT + currentGap);
        const layerX = (width - LAYER_WIDTH) / 2;

        /* Slight perspective: layers further from center are slightly wider when exploded */
        const centerIdx = (LAYERS.length - 1) / 2;
        const distFromCenter = Math.abs(i - centerIdx);
        const widthDelta = distFromCenter * 20 * explodeProgress;

        /* Entrance stagger */
        const entranceOffset = interpolate(frame, [i * 8, i * 8 + 20], [40, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const entranceOpacity = interpolate(frame, [i * 8, i * 8 + 20], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: layerX - widthDelta / 2,
              top: y + entranceOffset,
              width: LAYER_WIDTH + widthDelta,
              height: LAYER_HEIGHT,
              background: `${layer.tint}18`,
              border: `1px solid ${layer.tint}55`,
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: fonts.sans,
              opacity: entranceOpacity,
              boxShadow: `0 0 20px ${layer.tint}15`,
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: layer.tint,
                  letterSpacing: 0.5,
                }}
              >
                {layer.label}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: colors.textMuted,
                  marginTop: 2,
                  opacity: labelOpacity,
                }}
              >
                {layer.sublabel}
              </div>
            </div>
          </div>
        );
      })}

      {/* Side connector lines when exploded */}
      <svg
        width={width}
        height={height}
        style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
      >
        {LAYERS.slice(0, -1).map((_, i) => {
          const currentGap = GAP_COLLAPSED + (GAP_EXPLODED - GAP_COLLAPSED) * explodeProgress;
          const y1 = stackTop + i * (LAYER_HEIGHT + currentGap) + LAYER_HEIGHT;
          const y2 = stackTop + (i + 1) * (LAYER_HEIGHT + currentGap);
          const cx = width / 2;
          const lineOpacity = interpolate(frame, [80, 120, 220, 260], [0, 0.5, 0.5, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          return (
            <line
              key={i}
              x1={cx}
              y1={y1}
              x2={cx}
              y2={y2}
              stroke={colors.primary}
              strokeWidth={1.5}
              strokeDasharray="4 4"
              opacity={lineOpacity}
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

export default OSExplodedView;
