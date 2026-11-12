import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { DataProvider } from './context/DataContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';

import Layout from './layout/Layout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Login from './pages/Login.jsx';
import Orders from './pages/Orders.jsx';
import UserForm from './pages/UserForm.jsx';
import Users from './pages/Users.jsx';

/**
 * Route guard: unauthenticated visitors are redirected to the login page.
 * The intended destination is kept in `location.state` so we can send the
 * user back to it after a successful login.
 */
function ProtectedRoute({ children }) {
  const { user, ready } = useAuth();

  // `ready` avoids a flash-redirect while we read the stored session.
  if (!ready) return null;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

/** Once logged in, the login page itself becomes unreachable. */
function GuestRoute({ children }) {
  const { user, ready } = useAuth();

  if (!ready) return null;
  if (user) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <BrowserRouter>
            <Routes>
              <Route
                path="/login"
                element={
                  <GuestRoute>
                    <Login />
                  </GuestRoute>
                }
              />

              {/* Authenticated app shell (sidebar + topbar + page content) */}
              <Route
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route path="/" element={<Dashboard />} />
                <Route path="/users" element={<Users />} />
                <Route path="/users/new" element={<UserForm />} />
                <Route path="/users/:id/edit" element={<UserForm />} />
                <Route path="/orders" element={<Orders />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
