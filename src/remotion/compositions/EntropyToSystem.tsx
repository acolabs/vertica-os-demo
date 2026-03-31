import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { colors, fonts } from '../lib/design-tokens';
import { FPS } from '../lib/constants';

/* Pre-computed "chaotic" positions for 12 icons — deterministic */
const ICONS = [
  { label: 'Slack', chaosX: 120, chaosY: 80, chaosRot: -18 },
  { label: 'Salesforce', chaosX: 820, chaosY: 150, chaosRot: 12 },
  { label: 'Google Sheets', chaosX: 340, chaosY: 520, chaosRot: -8 },
  { label: 'Jira', chaosX: 950, chaosY: 420, chaosRot: 22 },
  { label: 'HubSpot', chaosX: 60, chaosY: 380, chaosRot: -25 },
  { label: 'Zendesk', chaosX: 700, chaosY: 560, chaosRot: 15 },
  { label: 'Notion', chaosX: 500, chaosY: 60, chaosRot: -12 },
  { label: 'Intercom', chaosX: 200, chaosY: 280, chaosRot: 30 },
  { label: 'Stripe', chaosX: 1050, chaosY: 280, chaosRot: -20 },
  { label: 'Snowflake', chaosX: 450, chaosY: 350, chaosRot: 8 },
  { label: 'Datadog', chaosX: 780, chaosY: 60, chaosRot: -15 },
  { label: 'PagerDuty', chaosX: 150, chaosY: 560, chaosRot: 18 },
];

/* Grid target positions (4 cols x 3 rows inside the console) */
const GRID_COLS = 4;
const GRID_START_X = 340;
const GRID_START_Y = 240;
const CELL_W = 155;
const CELL_H = 80;

const getGridPos = (i: number) => ({
  x: GRID_START_X + (i % GRID_COLS) * CELL_W,
  y: GRID_START_Y + Math.floor(i / GRID_COLS) * CELL_H,
});

/* Pre-computed floating offsets per icon for chaos phase */
const FLOAT_OFFSETS = [
  { dx: 15, dy: 10, period: 2.1 },
  { dx: -12, dy: 18, period: 2.8 },
  { dx: 20, dy: -14, period: 1.9 },
  { dx: -18, dy: -10, period: 3.1 },
  { dx: 10, dy: 22, period: 2.4 },
  { dx: -22, dy: 12, period: 2.7 },
  { dx: 14, dy: -20, period: 2.0 },
  { dx: -16, dy: 15, period: 3.3 },
  { dx: 18, dy: -8, period: 2.6 },
  { dx: -10, dy: -18, period: 1.8 },
  { dx: 22, dy: 10, period: 2.9 },
  { dx: -14, dy: -15, period: 2.2 },
];

const EntropyToSystem: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const midPoint = 90; // frame 90 = 3s

  /* Convergence spring — starts at midPoint */
  const converge = spring({
    frame: frame - midPoint,
    fps,
    config: { damping: 14, stiffness: 80, mass: 0.8 },
  });

  /* Console frame opacity */
  const consoleOpacity = interpolate(frame, [midPoint - 10, midPoint + 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  /* Label opacity */
  const labelOpacity = interpolate(frame, [midPoint + 30, midPoint + 50], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      {/* "AGENT OS" console frame */}
      <div
        style={{
          position: 'absolute',
          left: 290,
          top: 180,
          width: 700,
          height: 360,
          border: `1px solid ${colors.border}`,
          borderRadius: 14,
          background: colors.surface,
          opacity: consoleOpacity,
          boxShadow: `0 0 60px ${colors.primary10}`,
        }}
      >
        {/* Title bar */}
        <div
          style={{
            height: 34,
            background: colors.surfaceElevated,
            borderBottom: `1px solid ${colors.border}`,
            borderRadius: '14px 14px 0 0',
            display: 'flex',
            alignItems: 'center',
            padding: '0 14px',
            gap: 7,
          }}
        >
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: colors.danger }} />
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: colors.warning }} />
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: colors.primary }} />
        </div>
      </div>

      {/* AGENT OS label */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 145,
          width: 1280,
          textAlign: 'center',
          fontFamily: fonts.mono,
          fontSize: 13,
          fontWeight: 700,
          color: colors.primary,
          letterSpacing: 4,
          opacity: labelOpacity,
        }}
      >
        AGENT OS
      </div>

      {/* Icons */}
      {ICONS.map((icon, i) => {
        const grid = getGridPos(i);
        const flt = FLOAT_OFFSETS[i];
        const time = frame / FPS;

        /* Chaos-phase floating offset */
        const floatX = flt.dx * Math.sin(time * (2 * Math.PI) / flt.period);
        const floatY = flt.dy * Math.cos(time * (2 * Math.PI) / flt.period);

        const chaosX = icon.chaosX + floatX * (1 - converge);
        const chaosY = icon.chaosY + floatY * (1 - converge);
        const chaosRot = icon.chaosRot * (1 - converge);

        /* Interpolate between chaos and grid */
        const x = chaosX + (grid.x - chaosX) * converge;
        const y = chaosY + (grid.y - chaosY) * converge;

        /* Opacity — fade in slightly at start */
        const opacity = interpolate(frame, [i * 3, i * 3 + 12], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: 120,
              height: 48,
              background: colors.surfaceElevated,
              border: `1px solid ${colors.border}`,
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: fonts.sans,
              fontSize: 12,
              fontWeight: 600,
              color: colors.textSecondary,
              transform: `rotate(${chaosRot}deg)`,
              opacity,
              boxShadow: converge > 0.9 ? `0 0 12px ${colors.primary10}` : 'none',
            }}
          >
            {icon.label}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

export default EntropyToSystem;
