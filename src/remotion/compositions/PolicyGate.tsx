import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { colors, fonts } from '../lib/design-tokens';

const PolicyGate: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const centerX = width / 2;
  const centerY = height / 2;

  /* --- Phase 1: Agent Action card slides in from left (0-60) --- */
  const cardSlide = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 100 },
  });
  const cardX = interpolate(cardSlide, [0, 1], [-300, 160]);

  /* --- Phase 2: Policy Gate barrier appears (60-120) --- */
  const gateAppear = spring({
    frame: frame - 60,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  /* Scanning animation — a line sweeps down the gate */
  const scanY = interpolate(frame, [70, 110], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  /* --- Phase 3: Approved stamp (120-180) --- */
  const approvedScale = spring({
    frame: frame - 125,
    fps,
    config: { damping: 10, stiffness: 200 },
  });
  const checkOpacity = interpolate(frame, [120, 135], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  /* --- Phase 4: Audit Log entry (180-240) --- */
  const auditSlide = spring({
    frame: frame - 180,
    fps,
    config: { damping: 16, stiffness: 90 },
  });
  const auditOpacity = interpolate(frame, [180, 200], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  /* Connecting line from card through gate to audit */
  const lineProgress = interpolate(frame, [40, 80, 140, 200], [0, 0.4, 0.7, 1], {
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
          fontSize: 14,
          fontWeight: 600,
          color: colors.textMuted,
          letterSpacing: 3,
          textTransform: 'uppercase',
        }}
      >
        GOVERNANCE FLOW
      </div>

      {/* Flow line SVG */}
      <svg
        width={width}
        height={height}
        style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
      >
        <line
          x1={310}
          y1={centerY}
          x2={310 + (970 - 310) * lineProgress}
          y2={centerY}
          stroke={colors.primary}
          strokeWidth={1.5}
          strokeDasharray="6 4"
          opacity={0.4}
        />
      </svg>

      {/* Phase 1: Agent Action Card */}
      <div
        style={{
          position: 'absolute',
          left: cardX,
          top: centerY - 80,
          width: 200,
          height: 160,
          background: colors.surfaceElevated,
          border: `1px solid ${colors.border}`,
          borderRadius: 12,
          padding: 18,
          fontFamily: fonts.sans,
          boxShadow: `0 0 30px ${colors.primary10}`,
        }}
      >
        <div
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: colors.textMuted,
            letterSpacing: 2,
            marginBottom: 12,
          }}
        >
          AGENT ACTION
        </div>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: `${colors.info}22`,
            border: `2px solid ${colors.info}`,
            marginBottom: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 16,
            color: colors.info,
          }}
        >
          A
        </div>
        <div style={{ fontSize: 13, fontWeight: 600, color: colors.textPrimary }}>
          Send discount offer
        </div>
        <div style={{ fontSize: 11, color: colors.textMuted, marginTop: 4 }}>
          22% off — $48K value
        </div>
      </div>

      {/* Phase 2: Policy Gate */}
      <div
        style={{
          position: 'absolute',
          left: centerX - 80,
          top: centerY - 110,
          width: 160,
          height: 220,
          background: `${colors.purple}10`,
          border: `2px solid ${colors.purple}66`,
          borderRadius: 14,
          transform: `scaleY(${gateAppear})`,
          transformOrigin: 'center',
          overflow: 'hidden',
        }}
      >
        {/* Gate label */}
        <div
          style={{
            textAlign: 'center',
            paddingTop: 18,
            fontFamily: fonts.mono,
            fontSize: 11,
            fontWeight: 700,
            color: colors.purple,
            letterSpacing: 2,
          }}
        >
          POLICY GATE
        </div>

        {/* Scanning line */}
        <div
          style={{
            position: 'absolute',
            left: 10,
            top: 50 + scanY * 150,
            width: 140,
            height: 2,
            background: `linear-gradient(90deg, transparent, ${colors.purple}, transparent)`,
            opacity: frame >= 70 && frame <= 115 ? 0.8 : 0,
          }}
        />

        {/* Gate rules */}
        {['Max 20% discount', 'VP approval req', 'SOC 2 compliant'].map((rule, i) => (
          <div
            key={i}
            style={{
              margin: '0 12px',
              marginTop: i === 0 ? 30 : 8,
              padding: '6px 10px',
              background: colors.surface,
              borderRadius: 6,
              fontFamily: fonts.mono,
              fontSize: 10,
              color: colors.textSecondary,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              opacity: gateAppear,
            }}
          >
            <span
              style={{
                color: frame > 120 ? colors.primary : colors.textMuted,
                fontWeight: 700,
              }}
            >
              {frame > 120 ? '\u2713' : '\u2022'}
            </span>
            {rule}
          </div>
        ))}
      </div>

      {/* Phase 3: Approved stamp */}
      {frame >= 120 && (
        <div
          style={{
            position: 'absolute',
            left: centerX - 55,
            top: centerY + 130,
            transform: `scale(${approvedScale})`,
            opacity: checkOpacity,
          }}
        >
          <div
            style={{
              fontFamily: fonts.mono,
              fontSize: 18,
              fontWeight: 800,
              color: colors.primary,
              letterSpacing: 4,
              border: `3px solid ${colors.primary}`,
              borderRadius: 8,
              padding: '6px 18px',
              transform: 'rotate(-6deg)',
              boxShadow: `0 0 20px ${colors.primary}44`,
            }}
          >
            APPROVED
          </div>
        </div>
      )}

      {/* Phase 4: Audit Log */}
      <div
        style={{
          position: 'absolute',
          left: 810,
          top: centerY - 90,
          width: 240,
          height: 180,
          background: colors.surfaceElevated,
          border: `1px solid ${colors.border}`,
          borderRadius: 12,
          padding: 18,
          fontFamily: fonts.mono,
          opacity: auditOpacity,
          transform: `translateX(${(1 - auditSlide) * 60}px)`,
          boxShadow: `0 0 30px ${colors.primary10}`,
        }}
      >
        <div
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: colors.textMuted,
            letterSpacing: 2,
            marginBottom: 14,
            fontFamily: fonts.sans,
          }}
        >
          AUDIT LOG
        </div>

        {/* Hash chain entries */}
        {[
          { hash: '0x7a3f...e2d1', event: 'Action submitted' },
          { hash: '0x8b4c...f3a2', event: 'Policy evaluated' },
          { hash: '0x9c5d...a4b3', event: 'Approved + logged' },
        ].map((entry, i) => {
          const entryOpacity = interpolate(
            frame,
            [195 + i * 12, 205 + i * 12],
            [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
          );
          return (
            <div
              key={i}
              style={{
                marginBottom: 10,
                opacity: entryOpacity,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              {/* Chain link */}
              {i > 0 && (
                <div
                  style={{
                    position: 'absolute',
                    left: 30,
                    marginTop: -20,
                    width: 1,
                    height: 10,
                    background: colors.primary,
                    opacity: 0.3,
                  }}
                />
              )}
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: colors.primary,
                  flexShrink: 0,
                }}
              />
              <div>
                <div style={{ fontSize: 9, color: colors.primary }}>{entry.hash}</div>
                <div style={{ fontSize: 10, color: colors.textSecondary }}>{entry.event}</div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export default PolicyGate;
