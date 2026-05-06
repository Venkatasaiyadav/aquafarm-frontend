// src/components/dashboard/TodayFeed.jsx

export default function TodayFeed({ ponds }) {
  const totalFeed = ponds.reduce(
    (sum, p) => sum + (p.todayFeedKg || 0), 0
  );

  return (
    <div className="feed-summary-card">
      {/* Header */}
      <div className="feed-summary-header">
        <div style={{
          width: '36px', height: '36px', borderRadius: '0.625rem',
          background: 'rgba(34, 197, 94, 0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <span style={{ fontSize: '1.1rem' }}>📋</span>
        </div>
        <h2 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'white' }}>
          Today's Feed Summary
        </h2>
      </div>

      {/* Table */}
      <div className="feed-summary-table-wrap">
        <table className="feed-summary-table">
          <thead>
            <tr>
              <th style={{ textAlign: 'left', paddingRight: '0.75rem' }}>Pond</th>
              <th>Size</th>
              <th>Day</th>
              <th>Weight</th>
              <th style={{ textAlign: 'right', color: '#4ADE80' }}>Feed (kg)</th>
            </tr>
          </thead>
          <tbody>
            {/* Separator */}
            <tr>
              <td colSpan={5} style={{ padding: 0 }}>
                <div style={{
                  height: '1px',
                  background: 'linear-gradient(90deg, #334155, rgba(14,165,233,0.3), #334155)'
                }} />
              </td>
            </tr>

            {ponds.map((pond, idx) => (
              <tr key={pond.id} className={idx % 2 === 0 ? 'feed-row-even' : ''}>
                <td style={{ textAlign: 'left', paddingRight: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                      width: '6px', height: '6px', borderRadius: '50%',
                      background: '#4ADE80', flexShrink: 0
                    }} />
                    <span style={{ color: 'white', fontWeight: 500, whiteSpace: 'nowrap' }}>
                      {pond.pondName}
                    </span>
                  </div>
                </td>
                <td>{pond.sizeAcre} ac</td>
                <td style={{ fontFamily: 'monospace' }}>{pond.cultureDay}</td>
                <td>{pond.latestWeight ? `${pond.latestWeight}g` : '—'}</td>
                <td style={{ textAlign: 'right' }}>
                  <span className="feed-kg-badge">
                    {pond.todayFeedKg || 0}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={5} style={{ padding: 0 }}>
                <div style={{
                  height: '1px',
                  background: 'linear-gradient(90deg, rgba(14,165,233,0.4), rgba(34,197,94,0.4), rgba(14,165,233,0.4))'
                }} />
              </td>
            </tr>
            <tr className="feed-total-row">
              <td colSpan={4} style={{ textAlign: 'left', fontWeight: 600, color: 'white' }}>
                Total Feed Today
              </td>
              <td style={{ textAlign: 'right' }}>
                <span className="feed-total-badge">
                  {totalFeed} kg
                </span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}