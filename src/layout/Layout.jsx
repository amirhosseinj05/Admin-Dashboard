import { useCallback, useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import Sidebar from './Sidebar.jsx';
import Topbar from './Topbar.jsx';

const MOBILE_QUERY = '(max-width: 991.98px)';

/**
 * App shell: sidebar + topbar + routed page content.
 * - On desktop the sidebar can be collapsed to icons.
 * - On mobile it becomes an off-canvas drawer with a backdrop.
 */
export default function Layout() {
  const [open, setOpen] = useState(false); // mobile drawer
  const [collapsed, setCollapsed] = useState(false); // desktop rail mode
  const location = useLocation();

  // One button in the topbar handles both behaviours.
  const toggleSidebar = useCallback(() => {
    const isMobile = window.matchMedia(MOBILE_QUERY).matches;
    if (isMobile) setOpen((value) => !value);
    else setCollapsed((value) => !value);
  }, []);

  // Reset the mobile drawer when the user navigates (after picking a link).
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Scroll back to the top on every page change.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  // If the viewport grows to desktop, keep the layout consistent.
  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    const onChange = (event) => {
      if (!event.matches) setOpen(false);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return (
    <div className={`app-shell ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar
        open={open}
        collapsed={collapsed}
        onClose={() => setOpen(false)}
        onCollapse={() => setCollapsed((value) => !value)}
      />

      <div className="app-content">
        <Topbar onToggleSidebar={toggleSidebar} />

        <main className="app-main">
          <div className="page-wrapper">
            <Outlet />
          </div>

          <footer className="app-footer">
            © {new Date().getFullYear()} Ariya Admin — Built with React &amp; Bootstrap.
          </footer>
        </main>
      </div>
    </div>
  );
}
