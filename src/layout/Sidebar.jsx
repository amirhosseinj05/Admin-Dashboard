import { NavLink } from 'react-router-dom';

import Avatar from '../components/Avatar.jsx';
import { useAuth } from '../context/AuthContext.jsx';

/** Navigation definition - add new pages here and they appear automatically. */
const NAV_SECTIONS = [
  {
    label: 'Overview',
    items: [{ to: '/', label: 'Dashboard', icon: 'bi-grid-fill', end: true }],
  },
  {
    label: 'Management',
    items: [
      { to: '/users', label: 'Users', icon: 'bi-people-fill' },
      { to: '/orders', label: 'Orders', icon: 'bi-cart3' },
    ],
  },
];

/**
 * Sidebar: fixed on desktop (collapsible), off-canvas drawer on mobile.
 * Controlled by the Layout shell through props.
 */
export default function Sidebar({ open, collapsed, onClose, onCollapse }) {
  const { user } = useAuth();

  return (
    <>
      {/* Dark overlay behind the drawer (mobile only) */}
      <div className={`sidebar-overlay ${open ? 'show' : ''}`} onClick={onClose} aria-hidden="true" />

      <aside className={`app-sidebar ${open ? 'is-open' : ''} ${collapsed ? 'is-collapsed' : ''}`}>
        {/* Brand */}
        <div className="sidebar-brand">
          <span className="brand-logo">A</span>
          <span className="brand-text">
            <strong>Amir</strong>
            <small>Admin Panel</small>
          </span>
          <button type="button" className="icon-btn icon-btn-sm sidebar-close-btn" onClick={onClose}>
            <i className="bi bi-x-lg" />
            <span className="visually-hidden">Close menu</span>
          </button>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {NAV_SECTIONS.map((section) => (
            <div className="nav-section" key={section.label}>
              <p className="nav-section-title">{section.label}</p>
              {section.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
                  onClick={onClose}
                  title={item.label}
                >
                  <span className="nav-link-icon">
                    <i className={`bi ${item.icon}`} />
                  </span>
                  <span className="nav-link-label">{item.label}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* Footer: desktop collapse control + mini profile */}
        <div className="sidebar-footer">
          <button type="button" className="sidebar-collapse-btn" onClick={onCollapse} title="Collapse sidebar">
            <i className="bi bi-layout-sidebar-inset" />
            <span className="nav-link-label">Collapse</span>
          </button>

          <div className="sidebar-user">
            <Avatar name={user?.name || 'User'} id={1} size="sm" />
            <div className="sidebar-user-info">
              <strong>{user?.name}</strong>
              <small>{user?.role}</small>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
