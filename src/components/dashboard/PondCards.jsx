// src/components/dashboard/PondCards.jsx

import { useNavigate } from "react-router-dom";

const stageColors = {
  NURSERY: { bg: '#083344', color: '#67E8F9', border: '#164E63' },
  JUVENILE: { bg: '#422006', color: '#FCD34D', border: '#713F12' },
  GROW_OUT: { bg: '#052E16', color: '#86EFAC', border: '#14532D' },
  HARVEST_READY: { bg: '#4C0519', color: '#FDA4AF', border: '#881337' },
};

const gradientColors = [
  { from: '#0EA5E9', to: '#06B6D4' },
  { from: '#22C55E', to: '#14B8A6' },
  { from: '#8B5CF6', to: '#EC4899' },
  { from: '#F59E0B', to: '#EF4444' },
];

export default function PondCards({ ponds }) {
  const navigate = useNavigate();

  if (!ponds.length) return null;

  return (
    <div className="dash-pond-grid">
      {ponds.map((pond, index) => {
        const stage = stageColors[pond.growthStage] || stageColors.NURSERY;
        const gradient = gradientColors[index % gradientColors.length];
        const progressPercent = Math.min(Math.round((pond.cultureDay / 120) * 100), 100);

        return (
          <div
            key={pond.id}
            onClick={() => navigate(`/ponds/${pond.id}`)}
            className="dash-pond-card"
          >
            {/* Top accent */}
            <div style={{
              height: '3px', borderRadius: '3px 3px 0 0',
              background: `linear-gradient(90deg, ${gradient.from}, ${gradient.to})`
            }} />

            <div style={{ padding: '1rem' }}>
              {/* Header: Name + Stage Badge */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: '1rem'
              }}>
                <h3 style={{ color: 'white', fontWeight: 600, fontSize: '1rem' }}>
                  {pond.pondName}
                </h3>
                <span style={{
                  fontSize: '0.65rem', padding: '0.2rem 0.5rem',
                  borderRadius: '999px', fontWeight: 600,
                  background: stage.bg, color: stage.color,
                  border: `1px solid ${stage.border}`,
                  textTransform: 'uppercase', letterSpacing: '0.03em'
                }}>
                  {pond.growthStage?.replace("_", " ")}
                </span>
              </div>

              {/* Stats 2x2 Grid */}
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr',
                gap: '0.5rem', marginBottom: '1rem'
              }}>
                <div className="dash-pond-stat">
                  <span className="dash-pond-stat-label">Size</span>
                  <span className="dash-pond-stat-value">{pond.sizeAcre} ac</span>
                </div>
                <div className="dash-pond-stat">
                  <span className="dash-pond-stat-label">Day</span>
                  <span className="dash-pond-stat-value" style={{ fontFamily: 'monospace' }}>
                    {pond.cultureDay}<span style={{ color: '#64748B', fontWeight: 400, fontSize: '0.7rem' }}>/120</span>
                  </span>
                </div>
                <div className="dash-pond-stat">
                  <span className="dash-pond-stat-label">Weight</span>
                  <span className="dash-pond-stat-value">
                    {pond.latestWeight ? `${pond.latestWeight}g` : '—'}
                  </span>
                </div>
                <div className="dash-pond-stat">
                  <span className="dash-pond-stat-label">Feed Today</span>
                  <span className="dash-pond-stat-value" style={{ color: '#4ADE80' }}>
                    {pond.todayFeedKg || 0} kg
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div>
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  fontSize: '0.65rem', color: '#64748B', marginBottom: '0.35rem'
                }}>
                  <span>Culture Progress</span>
                  <span style={{ fontFamily: 'monospace', color: gradient.from }}>{progressPercent}%</span>
                </div>
                <div style={{
                  height: '6px', background: 'rgba(51,65,85,0.6)',
                  borderRadius: '999px', overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%', borderRadius: '999px',
                    background: `linear-gradient(90deg, ${gradient.from}, ${gradient.to})`,
                    width: `${progressPercent}%`,
                    transition: 'width 0.7s ease'
                  }} />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
