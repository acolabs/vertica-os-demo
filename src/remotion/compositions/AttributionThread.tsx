import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { colors, fonts } from '../lib/design-tokens';

const NODES = [
  { label: 'Signal\nDetected', x: 120 },
  { label: 'Agent\nActivated', x: 350 },
  { label: 'Action\nTaken', x: 580 },
  { label: 'Outcome\nMeasured', x: 810 },
  { label: '$1.2M\nAttributed', x: 1040 },
];

const NODE_RADIUS = 40;
const NODE_Y = 320;
const LINE_Y = NODE_Y;

/* Stagger: each node appears 36 frames after the previous */
const STAGGER = 36;

const AttributionThread: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

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
          color: colors.textMuted,
          letterSpacing: 3,
          textTransform: 'uppercase',
          opacity: interpolate(frame, [0, 15], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      >
        VALUE ATTRIBUTION CHAIN
      </div>

      {/* SVG lines between nodes */}
      <svg
        width={width}
        height={height}
        style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
      >
        {NODES.slice(0, -1).map((node, i) => {
          const nextNode = NODES[i + 1];
          const lineStart = (i + 1) * STAGGER + 10;
          const lineEnd = lineStart + 30;
          const totalLength = nextNode.x - node.x - NODE_RADIUS * 2;

          const drawProgress = interpolate(frame, [lineStart, lineEnd], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });

          /* Use strokeDashoffset for draw animation */
          const dashTotal = totalLength;

          return (
            <g key={i}>
              <line
                x1={node.x + NODE_RADIUS}
                y1={LINE_Y}
                x2={nextNode.x - NODE_RADIUS}
                y2={LINE_Y}
                stroke={i === NODES.length - 2 ? colors.primary : colors.border}
                strokeWidth={2}
                strokeDasharray={dashTotal}
                strokeDashoffset={dashTotal * (1 - drawProgress)}
                strokeLinecap="round"
              />
              {/* Arrow head */}
              {drawProgress > 0.85 && (
                <polygon
                  points={`${nextNode.x - NODE_RADIUS - 2},${LINE_Y - 5} ${nextNode.x - NODE_RADIUS + 5},${LINE_Y} ${nextNode.x - NODE_RADIUS - 2},${LINE_Y + 5}`}
                  fill={i === NODES.length - 2 ? colors.primary : colors.textMuted}
                  opacity={interpolate(drawProgress, [0.85, 1], [0, 1], {
                    extrapolateLeft: 'clamp',
                    extrapolateRight: 'clamp',
                  })}
                />
              )}
            </g>
          );
        })}

        {/* Glow circle behind final node */}
        {frame > (NODES.length - 1) * STAGGER && (
          <circle
            cx={NODES[NODES.length - 1].x}
            cy={NODE_Y}
            r={NODE_RADIUS + 18}
            fill="none"
            stroke={colors.primary}
            strokeWidth={2}
            opacity={interpolate(
              frame,
              [(NODES.length - 1) * STAGGER, (NODES.length - 1) * STAGGER + 30],
              [0, 0.35],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            )}
            filter="url(#glow)"
          />
        )}
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* Nodes */}
      {NODES.map((node, i) => {
        const nodeAppear = spring({
          frame: frame - i * STAGGER,
          fps,
          config: { damping: 12, stiffness: 120 },
        });

        const isFinal = i === NODES.length - 1;

        /* Final node pulsing glow */
        const glowIntensity = isFinal
          ? interpolate(
              frame,
              [i * STAGGER + 20, i * STAGGER + 50],
              [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            )
          : 0;

        return (
          <div key={i}>
            {/* Node circle */}
            <div
              style={{
                position: 'absolute',
                left: node.x - NODE_RADIUS,
                top: NODE_Y - NODE_RADIUS,
                width: NODE_RADIUS * 2,
                height: NODE_RADIUS * 2,
                borderRadius: '50%',
                background: isFinal ? `${colors.primary}25` : colors.surfaceElevated,
                border: `2px solid ${isFinal ? colors.primary : colors.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: `scale(${nodeAppear})`,
                opacity: nodeAppear,
                boxShadow: isFinal && glowIntensity > 0
                  ? `0 0 ${30 * glowIntensity}px ${colors.primary}66`
                  : 'none',
              }}
            >
              {/* Step number */}
              <div
                style={{
                  fontFamily: fonts.mono,
                  fontSize: 18,
                  fontWeight: 700,
                  color: isFinal ? colors.primary : colors.textSecondary,
                }}
              >
                {i + 1}
              </div>
            </div>

            {/* Label below */}
            <div
              style={{
                position: 'absolute',
                left: node.x - 60,
                top: NODE_Y + NODE_RADIUS + 16,
                width: 120,
                textAlign: 'center',
                fontFamily: fonts.sans,
                fontSize: 12,
                fontWeight: 600,
                color: isFinal ? colors.primary : colors.textPrimary,
                lineHeight: '1.4',
                whiteSpace: 'pre-line',
                opacity: nodeAppear,
              }}
            >
              {node.label}
            </div>
          </div>
        );
      })}

      {/* Bottom summary line */}
      <div
        style={{
          position: 'absolute',
          bottom: 80,
          left: 0,
          width: '100%',
          textAlign: 'center',
          fontFamily: fonts.sans,
          fontSize: 13,
          color: colors.textMuted,
          opacity: interpolate(frame, [190, 220], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      >
        Every dollar traced back through the full decision chain
      </div>
    </AbsoluteFill>
  );
};

export default AttributionThread;
