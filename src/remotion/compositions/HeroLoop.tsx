import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { colors, fonts } from '../lib/design-tokens';

/* ---------- Screen mockup sub-components ---------- */

const KpiCard: React.FC<{ label: string; value: string; x: number; y: number }> = ({
  label,
  value,
  x,
  y,
}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: 180,
      height: 90,
      background: colors.surfaceElevated,
      border: `1px solid ${colors.border}`,
      borderRadius: 10,
      padding: 14,
      fontFamily: fonts.sans,
    }}
  >
    <div style={{ fontSize: 11, color: colors.textMuted, marginBottom: 6 }}>{label}</div>
    <div style={{ fontSize: 26, fontWeight: 700, color: colors.textPrimary }}>{value}</div>
  </div>
);

const ChartArea: React.FC = () => {
  const barHeights = [55, 80, 45, 90, 65, 75, 50, 85, 60, 70];
  return (
    <div
      style={{
        position: 'absolute',
        left: 60,
        top: 180,
        width: 760,
        height: 200,
        display: 'flex',
        alignItems: 'flex-end',
        gap: 12,
        padding: '0 20px',
      }}
    >
      {barHeights.map((h, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: h * 1.8,
            background: `linear-gradient(180deg, ${colors.primary} 0%, ${colors.primary10} 100%)`,
            borderRadius: '4px 4px 0 0',
          }}
        />
      ))}
    </div>
  );
};

/* Screen 1: Command Center */
const CommandCenter: React.FC = () => (
  <div style={{ width: '100%', height: '100%', position: 'relative' }}>
    <div
      style={{
        fontFamily: fonts.sans,
        fontSize: 18,
        fontWeight: 600,
        color: colors.textPrimary,
        position: 'absolute',
        left: 60,
        top: 30,
      }}
    >
      Command Center
    </div>
    <KpiCard label="Revenue Protected" value="$4.2M" x={60} y={70} />
    <KpiCard label="Active Agents" value="12" x={260} y={70} />
    <KpiCard label="Decisions/hr" value="847" x={460} y={70} />
    <KpiCard label="SLA Compliance" value="99.7%" x={660} y={70} />
    <ChartArea />
  </div>
);

/* Screen 2: Decision Inbox */
const DecisionRow: React.FC<{
  label: string;
  severity: 'high' | 'medium' | 'low';
  y: number;
}> = ({ label, severity, y }) => {
  const severityColors = {
    high: colors.danger,
    medium: colors.warning,
    low: colors.primary,
  };
  return (
    <div
      style={{
        position: 'absolute',
        left: 60,
        top: y,
        width: 760,
        height: 52,
        background: colors.surfaceElevated,
        border: `1px solid ${colors.border}`,
        borderRadius: 8,
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        fontFamily: fonts.sans,
        gap: 14,
      }}
    >
      <div
        style={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          background: severityColors[severity],
        }}
      />
      <div style={{ flex: 1, fontSize: 14, color: colors.textPrimary }}>{label}</div>
      <div
        style={{
          fontSize: 11,
          color: severityColors[severity],
          background: `${severityColors[severity]}22`,
          padding: '3px 10px',
          borderRadius: 4,
          textTransform: 'uppercase',
          fontWeight: 600,
        }}
      >
        {severity}
      </div>
    </div>
  );
};

const DecisionInbox: React.FC = () => (
  <div style={{ width: '100%', height: '100%', position: 'relative' }}>
    <div
      style={{
        fontFamily: fonts.sans,
        fontSize: 18,
        fontWeight: 600,
        color: colors.textPrimary,
        position: 'absolute',
        left: 60,
        top: 30,
      }}
    >
      Decision Inbox
    </div>
    <DecisionRow label="Enterprise churn risk — Acme Corp renewal in 14 days" severity="high" y={75} />
    <DecisionRow label="Compliance policy update requires re-certification" severity="high" y={140} />
    <DecisionRow label="Support ticket escalation — P1 SLA breach in 2 hrs" severity="medium" y={205} />
    <DecisionRow label="Expansion signal — usage spike at TechStart Inc" severity="low" y={270} />
    <DecisionRow label="Agent runtime anomaly — latency spike detected" severity="medium" y={335} />
  </div>
);

/* Screen 3: Agent Fleet */
const AgentCard: React.FC<{
  name: string;
  status: 'active' | 'idle' | 'paused';
  x: number;
  y: number;
}> = ({ name, status, x, y }) => {
  const statusColors = {
    active: colors.primary,
    idle: colors.textMuted,
    paused: colors.warning,
  };
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 170,
        height: 100,
        background: colors.surfaceElevated,
        border: `1px solid ${colors.border}`,
        borderRadius: 10,
        padding: 14,
        fontFamily: fonts.sans,
      }}
    >
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: '50%',
          background: `${statusColors[status]}33`,
          border: `2px solid ${statusColors[status]}`,
          marginBottom: 10,
        }}
      />
      <div style={{ fontSize: 13, fontWeight: 600, color: colors.textPrimary }}>{name}</div>
      <div style={{ fontSize: 11, color: statusColors[status], marginTop: 4 }}>{status.toUpperCase()}</div>
    </div>
  );
};

const AgentFleet: React.FC = () => (
  <div style={{ width: '100%', height: '100%', position: 'relative' }}>
    <div
      style={{
        fontFamily: fonts.sans,
        fontSize: 18,
        fontWeight: 600,
        color: colors.textPrimary,
        position: 'absolute',
        left: 60,
        top: 30,
      }}
    >
      Agent Fleet
    </div>
    <AgentCard name="Churn Agent" status="active" x={60} y={80} />
    <AgentCard name="Support Agent" status="active" x={250} y={80} />
    <AgentCard name="Growth Agent" status="idle" x={440} y={80} />
    <AgentCard name="Compliance Agent" status="active" x={630} y={80} />
    <AgentCard name="Onboarding Agent" status="paused" x={60} y={200} />
    <AgentCard name="Renewal Agent" status="active" x={250} y={200} />
    <AgentCard name="QBR Agent" status="idle" x={440} y={200} />
    <AgentCard name="Escalation Agent" status="active" x={630} y={200} />
  </div>
);

/* Screen 4: Policy Engine */
const PolicyRule: React.FC<{
  rule: string;
  passed: boolean;
  y: number;
}> = ({ rule, passed, y }) => (
  <div
    style={{
      position: 'absolute',
      left: 60,
      top: y,
      width: 760,
      height: 48,
      background: colors.surfaceElevated,
      border: `1px solid ${colors.border}`,
      borderRadius: 8,
      display: 'flex',
      alignItems: 'center',
      padding: '0 20px',
      fontFamily: fonts.sans,
      gap: 14,
    }}
  >
    <div
      style={{
        width: 22,
        height: 22,
        borderRadius: 4,
        background: passed ? `${colors.primary}22` : `${colors.danger}22`,
        color: passed ? colors.primary : colors.danger,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 14,
        fontWeight: 700,
      }}
    >
      {passed ? '\u2713' : '\u2717'}
    </div>
    <div style={{ flex: 1, fontSize: 13, color: colors.textPrimary }}>{rule}</div>
    <div
      style={{
        fontSize: 11,
        color: passed ? colors.primary : colors.danger,
        fontWeight: 600,
      }}
    >
      {passed ? 'PASS' : 'FAIL'}
    </div>
  </div>
);

const PolicyEngine: React.FC = () => (
  <div style={{ width: '100%', height: '100%', position: 'relative' }}>
    <div
      style={{
        fontFamily: fonts.sans,
        fontSize: 18,
        fontWeight: 600,
        color: colors.textPrimary,
        position: 'absolute',
        left: 60,
        top: 30,
      }}
    >
      Policy Engine
    </div>
    <PolicyRule rule="Max discount threshold: 20% without VP approval" passed={true} y={75} />
    <PolicyRule rule="SOC 2 compliance check on all data exports" passed={true} y={135} />
    <PolicyRule rule="Customer PII redaction in agent logs" passed={true} y={195} />
    <PolicyRule rule="SLA response time < 4 hours for P1 tickets" passed={false} y={255} />
    <PolicyRule rule="Budget approval required for actions > $10K" passed={true} y={315} />
  </div>
);

/* Screen 5: Value Attribution */
const ValueAttribution: React.FC = () => {
  const nodes = [
    { label: 'Signal', x: 80, y: 160 },
    { label: 'Agent', x: 260, y: 100 },
    { label: 'Action', x: 440, y: 160 },
    { label: 'Outcome', x: 620, y: 100 },
    { label: '$1.2M', x: 760, y: 160 },
  ];
  const lineConnections = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
  ];
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div
        style={{
          fontFamily: fonts.sans,
          fontSize: 18,
          fontWeight: 600,
          color: colors.textPrimary,
          position: 'absolute',
          left: 60,
          top: 30,
        }}
      >
        Value Attribution
      </div>
      <svg
        width="880"
        height="400"
        style={{ position: 'absolute', left: 0, top: 40 }}
      >
        {lineConnections.map(([from, to], i) => (
          <line
            key={i}
            x1={nodes[from].x + 35}
            y1={nodes[from].y + 35}
            x2={nodes[to].x + 35}
            y2={nodes[to].y + 35}
            stroke={colors.primary}
            strokeWidth={2}
            strokeOpacity={0.5}
          />
        ))}
      </svg>
      {nodes.map((node, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: node.x,
            top: node.y + 40,
            width: 70,
            height: 70,
            borderRadius: '50%',
            background: i === nodes.length - 1 ? `${colors.primary}33` : colors.surfaceElevated,
            border: `2px solid ${i === nodes.length - 1 ? colors.primary : colors.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: fonts.sans,
            fontSize: i === nodes.length - 1 ? 15 : 12,
            fontWeight: 600,
            color: i === nodes.length - 1 ? colors.primary : colors.textPrimary,
          }}
        >
          {node.label}
        </div>
      ))}
    </div>
  );
};

/* ---------- Screens array ---------- */
const screens = [CommandCenter, DecisionInbox, AgentFleet, PolicyEngine, ValueAttribution];
const FRAMES_PER_SCREEN = 72;

/* ---------- Main composition ---------- */
const HeroLoop: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      {/* Console chrome */}
      <div
        style={{
          position: 'absolute',
          left: (width - 900) / 2,
          top: (height - 440) / 2,
          width: 900,
          height: 440,
          background: colors.surface,
          border: `1px solid ${colors.border}`,
          borderRadius: 14,
          overflow: 'hidden',
          boxShadow: `0 0 80px ${colors.primary10}`,
        }}
      >
        {/* Title bar */}
        <div
          style={{
            height: 36,
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
            vertica-os://dashboard
          </div>
        </div>

        {/* Content area with crossfade */}
        <div style={{ position: 'relative', width: 900, height: 404 }}>
          {screens.map((Screen, index) => {
            const screenStart = index * FRAMES_PER_SCREEN;
            const screenEnd = screenStart + FRAMES_PER_SCREEN;

            const opacity = interpolate(
              frame,
              [
                screenStart - 15,
                screenStart,
                screenEnd - 15,
                screenEnd,
              ],
              [0, 1, 1, 0],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            );

            return (
              <div
                key={index}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  opacity,
                }}
              >
                <Screen />
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export default HeroLoop;
