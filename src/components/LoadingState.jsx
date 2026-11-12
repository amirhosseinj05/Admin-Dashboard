/** Skeleton-style loading state for tables and lists. */
export default function LoadingState({ rows = 5, label = 'Loading data...' }) {
  return (
    <div className="loading-state" role="status" aria-live="polite">
      <div className="d-flex align-items-center gap-2 mb-3 text-muted small">
        <span className="spinner-border spinner-border-sm" />
        {label}
      </div>
      {Array.from({ length: rows }).map((_, index) => (
        <div className="skeleton-line" key={index} />
      ))}
    </div>
  );
}
