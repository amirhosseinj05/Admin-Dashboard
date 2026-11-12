/** Bootstrap-soft badge styles used for order/user statuses and roles. */
const STATUS_CLASSES = {
  Active: 'text-bg-success',
  Completed: 'text-bg-success',
  Pending: 'text-bg-warning',
  Inactive: 'text-bg-secondary',
  Cancelled: 'text-bg-danger',
};

const ROLE_CLASSES = {
  Admin: 'role-badge-admin',
  Manager: 'role-badge-manager',
  Editor: 'role-badge-editor',
  Viewer: 'role-badge-viewer',
};

export default function StatusBadge({ value, kind = 'status' }) {
  if (kind === 'role') {
    return <span className={`role-badge ${ROLE_CLASSES[value] || 'role-badge-viewer'}`}>{value}</span>;
  }

  const cssClass = STATUS_CLASSES[value] || 'text-bg-secondary';
  return <span className={`badge rounded-pill ${cssClass}`}>{value}</span>;
}
