/** Summary card used on top of the dashboard (4x). */
export default function StatCard({ title, value, icon, tone = 'primary', trend, trendLabel = 'vs. last month' }) {
  const hasTrend = typeof trend === 'number';
  const up = trend >= 0;

  return (
    <div className="stat-card h-100">
      <div className="d-flex align-items-start justify-content-between gap-3">
        <div>
          <p className="stat-title mb-1">{title}</p>
          <h3 className="stat-value mb-0">{value}</h3>
        </div>
        <span className={`stat-icon stat-icon-${tone}`}>
          <i className={`bi ${icon}`} />
        </span>
      </div>

      {hasTrend && (
        <p className="stat-trend mb-0 mt-3">
          <span className={`trend-chip ${up ? 'trend-up' : 'trend-down'}`}>
            <i className={`bi ${up ? 'bi-arrow-up-right' : 'bi-arrow-down-right'}`} />
            {Math.abs(trend)}%
          </span>
          <span className="trend-label">{trendLabel}</span>
        </p>
      )}
    </div>
  );
}
