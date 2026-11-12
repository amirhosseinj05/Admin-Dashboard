/** Friendly empty / no-results state shown inside data tables. */
export default function EmptyState({ icon = 'bi-inbox', title = 'Nothing here yet', text, action }) {
  return (
    <div className="empty-state text-center py-5">
      <span className="empty-state-icon">
        <i className={`bi ${icon}`} />
      </span>
      <h6 className="mt-3 mb-1">{title}</h6>
      {text && <p className="text-muted mb-0 small">{text}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}
