import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

import Avatar from '../components/Avatar.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import useClickOutside from '../hooks/useClickOutside.js';

/** Page titles shown in the topbar for each route. */
const TITLES = {
  '/': 'Dashboard',
  '/users': 'Users Management',
  '/users/new': 'Add New User',
  '/orders': 'Orders',
};

const NOTIFICATIONS = [
  { id: 1, icon: 'bi-person-plus', tone: 'primary', title: '3 new users registered', time: '5 min ago' },
  { id: 2, icon: 'bi-bag-check', tone: 'success', title: 'Order ORD-1058 completed', time: '45 min ago' },
  { id: 3, icon: 'bi-exclamation-circle', tone: 'warning', title: 'Payment pending for ORD-1057', time: '2 hours ago' },
];

function usePageTitle() {
  const { pathname } = useLocation();
  if (TITLES[pathname]) return TITLES[pathname];
  if (pathname.startsWith('/users/')) return 'User Form';
  return 'Dashboard';
}

/**
 * Topbar: mobile menu trigger, page title, global search, dark-mode toggle,
 * notifications and the user menu (logout).
 */
export default function Topbar({ onToggleSidebar }) {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const title = usePageTitle();

  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useClickOutside(notifRef, () => setNotifOpen(false), notifOpen);
  useClickOutside(profileRef, () => setProfileOpen(false), profileOpen);

  // Close both menus whenever the route changes.
  const { pathname } = useLocation();
  useEffect(() => {
    setNotifOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  return (
    <header className="app-topbar">
      {/* Left: menu button + title */}
      <div className="topbar-left">
        <button type="button" className="icon-btn topbar-menu-btn" onClick={onToggleSidebar} aria-label="Toggle sidebar">
          <i className="bi bi-list" />
        </button>
        <div className="topbar-titles">
          <h6 className="topbar-title mb-0">{title}</h6>
          <span className="topbar-breadcrumb">Home / {title}</span>
        </div>
      </div>

      {/* Right: search + actions */}
      <div className="topbar-right">
        <div className="topbar-search d-none d-lg-flex">
          <i className="bi bi-search" />
          <input type="search" placeholder="Search users, orders..." aria-label="Search" />
        </div>

        <button type="button" className="icon-btn" onClick={toggleTheme} title="Toggle dark mode">
          <i className={`bi ${isDark ? 'bi-sun-fill' : 'bi-moon-stars'}`} />
        </button>

        {/* Notifications dropdown */}
        <div className="dropdown-wrapper" ref={notifRef}>
          <button
            type="button"
            className="icon-btn"
            onClick={() => {
              setNotifOpen((v) => !v);
              setProfileOpen(false);
            }}
            aria-label="Notifications"
          >
            <i className="bi bi-bell" />
            <span className="dot-badge" />
          </button>

          {notifOpen && (
            <div className="dropdown-panel dropdown-panel-right">
              <div className="dropdown-panel-header">
                <strong>Notifications</strong>
                <span className="badge text-bg-primary rounded-pill">3 new</span>
              </div>
              {NOTIFICATIONS.map((item) => (
                <div className="notification-item" key={item.id}>
                  <span className={`notification-icon notification-icon-${item.tone}`}>
                    <i className={`bi ${item.icon}`} />
                  </span>
                  <div>
                    <p className="mb-0 small fw-semibold">{item.title}</p>
                    <small className="text-muted">{item.time}</small>
                  </div>
                </div>
              ))}
              <div className="dropdown-panel-footer text-center">
                <span className="text-primary small fw-semibold">View all notifications</span>
              </div>
            </div>
          )}
        </div>

        {/* Profile dropdown */}
        <div className="dropdown-wrapper" ref={profileRef}>
          <button
            type="button"
            className="profile-btn"
            onClick={() => {
              setProfileOpen((v) => !v);
              setNotifOpen(false);
            }}
          >
            <Avatar name={user?.name || 'User'} id={1} size="sm" />
            <span className="profile-meta d-none d-md-block text-start">
              <strong>{user?.name}</strong>
              <small>{user?.role}</small>
            </span>
            <i className="bi bi-chevron-down d-none d-md-block" />
          </button>

          {profileOpen && (
            <div className="dropdown-panel dropdown-panel-right">
              <div className="dropdown-panel-header profile-header">
                <Avatar name={user?.name || 'User'} id={1} size="lg" />
                <div className="ms-2">
                  <strong className="d-block">{user?.name}</strong>
                  <small className="text-muted">{user?.email}</small>
                </div>
              </div>
              <button type="button" className="dropdown-item-btn" onClick={() => setProfileOpen(false)}>
                <i className="bi bi-person" /> My profile
              </button>
              <button type="button" className="dropdown-item-btn" onClick={() => setProfileOpen(false)}>
                <i className="bi bi-gear" /> Account settings
              </button>
              <div className="dropdown-divider" />
              <button type="button" className="dropdown-item-btn text-danger" onClick={logout}>
                <i className="bi bi-box-arrow-right" /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
