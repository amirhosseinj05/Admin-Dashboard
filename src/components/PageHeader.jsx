/** Page heading: title + optional subtitle on the left, actions on the right. */
export default function PageHeader({ title, subtitle, children }) {
  return (
    <div className="page-header">
      <div>
        <h4 className="page-title mb-1">{title}</h4>
        {subtitle && <p className="page-subtitle mb-0">{subtitle}</p>}
      </div>
      {children && <div className="page-header-actions">{children}</div>}
    </div>
  );
}
