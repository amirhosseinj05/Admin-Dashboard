import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { DEMO_CREDENTIALS, useAuth } from '../context/AuthContext.jsx';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Public login page (split layout: brand panel + form). */
export default function Login() {
  const { login, rememberedEmail } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Where the user wanted to go before being redirected to /login.
  const redirectTo = location.state?.from?.pathname || '/';

  const [form, setForm] = useState({
    email: rememberedEmail || '',
    password: '',
    remember: Boolean(rememberedEmail),
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear the field error as soon as the user starts typing again.
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setApiError('');
  };

  /** Basic client-side validation (name of the rules live next to the inputs). */
  const validate = () => {
    const next = {};
    if (!form.email.trim()) next.email = 'Email is required.';
    else if (!EMAIL_RE.test(form.email.trim())) next.email = 'Enter a valid email address.';

    if (!form.password) next.password = 'Password is required.';
    else if (form.password.length < 6) next.password = 'Password must be at least 6 characters.';

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    const result = await login(form); // <- AuthContext (swap for a real API later)
    setSubmitting(false);

    if (result.ok) navigate(redirectTo, { replace: true });
    else setApiError(result.error);
  };

  return (
    <div className="login-page">
      {/* Left: brand / marketing panel (hidden on small screens) */}
      <aside className="login-brand d-none d-lg-flex">
        <div className="login-brand-inner">
          <div className="login-logo">
            <span className="brand-logo brand-logo-light">A</span>
            <strong>Ariya Admin</strong>
          </div>

          <h2 className="login-headline">
            Manage your business with a clean, modern dashboard.
          </h2>
          <p className="login-subtext">
            Data tables, charts, forms and authentication — everything a modern admin panel needs,
            built with React and Bootstrap.
          </p>

          <ul className="login-features">
            <li>
              <i className="bi bi-check-circle-fill" /> Responsive on desktop, tablet and mobile
            </li>
            <li>
              <i className="bi bi-check-circle-fill" /> Dark mode, charts and live filtering
            </li>
            <li>
              <i className="bi bi-check-circle-fill" /> Clean component structure with Context API
            </li>
          </ul>
        </div>
        <div className="login-brand-glow login-brand-glow-1" />
        <div className="login-brand-glow login-brand-glow-2" />
      </aside>

      {/* Right: form */}
      <main className="login-form-side">
        <div className="login-form-card">
          <div className="mobile-login-logo d-lg-none">
            <span className="brand-logo">A</span>
            <strong>Ariya Admin</strong>
          </div>

          <h4 className="login-title">Welcome back</h4>
          <p className="login-subtitle">Sign in to your account to continue.</p>

          {apiError && (
            <div className="alert alert-danger d-flex align-items-start gap-2 py-2" role="alert">
              <i className="bi bi-exclamation-circle-fill mt-1" />
              <span>{apiError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <div className="input-icon-group">
                <i className="bi bi-envelope" />
                <input
                  id="email"
                  type="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  placeholder="you@company.com"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  autoComplete="email"
                  autoFocus
                />
              </div>
              {errors.email && <div className="invalid-feedback d-block">{errors.email}</div>}
            </div>

            {/* Password */}
            <div className="mb-3">
              <div className="d-flex justify-content-between align-items-center">
                <label htmlFor="password" className="form-label mb-0">
                  Password
                </label>
                <Link to="/login" className="login-link small" onClick={(e) => e.preventDefault()}>
                  Forgot password?
                </Link>
              </div>
              <div className="input-icon-group has-trailing">
                <i className="bi bi-lock" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => update('password', e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="input-trailing-btn"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`} />
                </button>
              </div>
              {errors.password && <div className="invalid-feedback d-block">{errors.password}</div>}
            </div>

            {/* Remember me */}
            <div className="d-flex align-items-center justify-content-between mb-4">
              <div className="form-check">
                <input
                  id="remember"
                  type="checkbox"
                  className="form-check-input"
                  checked={form.remember}
                  onChange={(e) => update('remember', e.target.checked)}
                />
                <label htmlFor="remember" className="form-check-label small">
                  Remember me
                </label>
              </div>
              <span className="text-muted small">
                {form.remember ? 'Saved on this device' : 'Session only'}
              </span>
            </div>

            <button type="submit" className="btn btn-primary w-100 btn-lg" disabled={submitting}>
              {submitting && <span className="spinner-border spinner-border-sm me-2" />}
              Sign in
            </button>
          </form>

          {/* Demo credentials hint for reviewers / clients */}
          <div className="demo-hint">
            <div className="d-flex align-items-center gap-2 mb-1">
              <i className="bi bi-key" />
              <strong>Demo account</strong>
            </div>
            <p className="mb-0 small">
              {DEMO_CREDENTIALS.email} / {DEMO_CREDENTIALS.password}
            </p>
            <button
              type="button"
              className="btn btn-link btn-sm p-0 mt-1 login-link"
              onClick={() =>
                setForm({ email: DEMO_CREDENTIALS.email, password: DEMO_CREDENTIALS.password, remember: true })
              }
            >
              Fill credentials automatically
            </button>
          </div>

          <p className="login-footer-text text-center text-muted small mb-0">
            © {new Date().getFullYear()} Ariya Admin. All rights reserved.
          </p>
        </div>
      </main>
    </div>
  );
}
