import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { colors, fonts } from '../lib/design-tokens';

const DemoDoor: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const centerX = width / 2;
  const centerY = height / 2;

  /* --- Phase 1: Console window zooms in from center (0-30) --- */
  const consoleScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 150 },
  });

  /* --- Phase 2: Green flash pulse (30-60) --- */
  const flashOpacity = interpolate(frame, [28, 38, 50, 60], [0, 0.7, 0.3, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const flashScale = interpolate(frame, [28, 55], [0.3, 2.5], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  /* --- Phase 3: Fade to black (60-90) --- */
  const blackOpacity = interpolate(frame, [60, 85], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  /* Console content pulse */
  const contentPulse = interpolate(frame, [15, 25], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      {/* Console window */}
      <div
        style={{
          position: 'absolute',
          left: centerX - 240,
          top: centerY - 160,
          width: 480,
          height: 320,
          background: colors.surface,
          border: `1px solid ${colors.border}`,
          borderRadius: 14,
          overflow: 'hidden',
          transform: `scale(${consoleScale * interpolate(frame, [55, 75], [1, 1.15], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })})`,
          opacity: interpolate(frame, [60, 82], [1, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
          boxShadow: `0 0 80px ${colors.primary}33`,
        }}
      >
        {/* Title bar */}
        <div
          style={{
            height: 34,
            background: colors.surfaceElevated,
            borderBottom: `1px solid ${colors.border}`,
            display: 'flex',
            alignItems: 'center',
            padding: '0 14px',
            gap: 7,
          }}
        >
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: colors.danger }} />
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: colors.warning }} />
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: colors.primary }} />
          <div
            style={{
              marginLeft: 12,
              fontFamily: fonts.mono,
              fontSize: 11,
              color: colors.textMuted,
            }}
          >
            vertica-os://demo
          </div>
        </div>

        {/* Console content */}
        <div style={{ padding: 24, opacity: contentPulse }}>
          {/* Fake dashboard content */}
          <div
            style={{
              display: 'flex',
              gap: 10,
              marginBottom: 16,
            }}
          >
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                style={{
                  flex: 1,
                  height: 50,
                  background: colors.surfaceElevated,
                  border: `1px solid ${colors.border}`,
                  borderRadius: 8,
                }}
              />
            ))}
          </div>
          <div
            style={{
              width: '100%',
              height: 100,
              background: colors.surfaceElevated,
              border: `1px solid ${colors.border}`,
              borderRadius: 8,
              marginBottom: 14,
            }}
          />
          <div style={{ display: 'flex', gap: 10 }}>
            <div
              style={{
                flex: 2,
                height: 60,
                background: colors.surfaceElevated,
                border: `1px solid ${colors.border}`,
                borderRadius: 8,
              }}
            />
            <div
              style={{
                flex: 1,
                height: 60,
                background: colors.surfaceElevated,
                border: `1px solid ${colors.border}`,
                borderRadius: 8,
              }}
            />
          </div>
        </div>
      </div>

      {/* Green flash pulse */}
      <div
        style={{
          position: 'absolute',
          left: centerX - 200,
          top: centerY - 200,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${colors.primary}88 0%, ${colors.primary}00 70%)`,
          opacity: flashOpacity,
          transform: `scale(${flashScale})`,
          pointerEvents: 'none',
        }}
      />

      {/* "Entering Demo" text */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: centerY + 190,
          width: '100%',
          textAlign: 'center',
          fontFamily: fonts.mono,
          fontSize: 13,
          fontWeight: 600,
          color: colors.primary,
          letterSpacing: 4,
          opacity: interpolate(frame, [10, 22, 60, 75], [0, 1, 1, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      >
        ENTERING DEMO
      </div>

      {/* Fade to black overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: '#000000',
          opacity: blackOpacity,
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};

export default DemoDoor;
