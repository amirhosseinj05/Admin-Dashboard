import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import LoadingState from '../components/LoadingState.jsx';
import PageHeader from '../components/PageHeader.jsx';
import { useData } from '../context/DataContext.jsx';
import { ROLES, USER_STATUSES } from '../data/mockData.js';
import { createUser, updateUser } from '../services/api.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[\d\s()-]{7,15}$/;

const EMPTY_FORM = {
  name: '',
  email: '',
  phone: '',
  role: '',
  status: 'Active',
  department: '',
  notes: '',
};

/* --------------------------- tiny field helpers --------------------------- */
function TextField({ label, error, hint, required, ...props }) {
  return (
    <div className="mb-3">
      <label className="form-label" htmlFor={props.id}>
        {label} {required && <span className="text-danger">*</span>}
      </label>
      <input className={`form-control ${error ? 'is-invalid' : ''}`} {...props} />
      {error ? (
        <div className="invalid-feedback d-block">{error}</div>
      ) : hint ? (
        <div className="form-text">{hint}</div>
      ) : null}
    </div>
  );
}

function SelectField({ label, error, options, placeholder, required, ...props }) {
  return (
    <div className="mb-3">
      <label className="form-label" htmlFor={props.id}>
        {label} {required && <span className="text-danger">*</span>}
      </label>
      <select className={`form-select ${error ? 'is-invalid' : ''}`} {...props}>
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error && <div className="invalid-feedback d-block">{error}</div>}
    </div>
  );
}
/* -------------------------------------------------------------------------- */

/**
 * Add / Edit user form.
 * Route:  /users/new          -> create
 *         /users/:id/edit     -> update
 */
export default function UserForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { users, loading, addUser, editUser } = useData();

  const isEdit = Boolean(id);

  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [banner, setBanner] = useState(null); // { type: 'success' | 'danger', text }
  const [submitting, setSubmitting] = useState(false);
  const redirectTimer = useRef(null);

  useEffect(() => () => clearTimeout(redirectTimer.current), []);

  // Prefill the form when editing (users arrive asynchronously from the API layer).
  useEffect(() => {
    if (!isEdit || loading) return;
    const existing = users.find((user) => user.id === Number(id));
    if (existing) {
      setForm({
        name: existing.name || '',
        email: existing.email || '',
        phone: existing.phone || '',
        role: existing.role || '',
        status: existing.status || 'Active',
        department: existing.department || '',
        notes: existing.notes || '',
      });
    } else {
      setBanner({ type: 'danger', text: 'This user does not exist (or was already deleted).' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, id, loading]);

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear the inline error while the user is fixing the field.
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  /** Client-side validation rules. */
  const validate = () => {
    const next = {};

    if (!form.name.trim()) next.name = 'Full name is required.';
    else if (form.name.trim().length < 3) next.name = 'Name must be at least 3 characters.';

    if (!form.email.trim()) next.email = 'Email is required.';
    else if (!EMAIL_RE.test(form.email.trim())) next.email = 'Enter a valid email address.';

    if (!form.phone.trim()) next.phone = 'Phone number is required.';
    else if (!PHONE_RE.test(form.phone.trim())) next.phone = 'Enter a valid phone number (e.g. +98 912 123 4567).';

    if (!form.role) next.role = 'Please select a role.';
    if (!form.status) next.status = 'Please select a status.';
    if (form.notes.length > 200) next.notes = 'Notes must be 200 characters or fewer.';

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      setBanner({ type: 'danger', text: 'Please fix the highlighted fields and try again.' });
      return;
    }

    setSubmitting(true);
    const payload = {
      ...form,
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      notes: form.notes.trim(),
    };

    try {
      if (isEdit) {
        await updateUser(id, payload); // ! replace with PUT /users/:id
        editUser(id, payload);
        setBanner({ type: 'success', text: 'User updated successfully. Redirecting...' });
      } else {
        const created = await createUser(payload); // ! replace with POST /users
        addUser(created);
        setBanner({ type: 'success', text: 'User created successfully. Redirecting...' });
      }
      redirectTimer.current = setTimeout(() => navigate('/users'), 1200);
    } catch {
      setBanner({ type: 'danger', text: 'Something went wrong while saving. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  /* ------------------------------ render ------------------------------ */
  if (isEdit && loading) {
    return (
      <>
        <PageHeader title="Edit User" />
        <div className="content-card">
          <LoadingState rows={5} label="Loading user..." />
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title={isEdit ? 'Edit User' : 'Add New User'}
        subtitle={isEdit ? 'Update the account details below.' : 'Create a new account and assign its permissions.'}
      >
        <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => navigate('/users')}>
          <i className="bi bi-arrow-left me-1" /> Back to list
        </button>
      </PageHeader>

      {banner && (
        <div
          className={`alert alert-${banner.type} alert-dismissible fade show py-2`}
          role="alert"
          style={{ animation: 'none' }}
        >
          <i
            className={`bi ${banner.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-circle-fill'} me-2`}
          />
          {banner.text}
          <button type="button" className="btn-close" onClick={() => setBanner(null)} aria-label="Close" />
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="content-card mb-3">
          <div className="card-head">
            <div>
              <h6 className="card-title mb-1">Basic information</h6>
              <p className="card-subtitle mb-0">Fields marked with * are required.</p>
            </div>
          </div>

          <div className="row g-3">
            <div className="col-md-6">
              <TextField
                id="name"
                label="Full name"
                required
                placeholder="e.g. Sara Mohammadi"
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                error={errors.name}
              />
            </div>
            <div className="col-md-6">
              <TextField
                id="email"
                type="email"
                label="Email address"
                required
                placeholder="user@company.com"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                error={errors.email}
              />
            </div>
            <div className="col-md-6">
              <TextField
                id="phone"
                type="tel"
                label="Phone number"
                required
                placeholder="+98 912 123 4567"
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
                error={errors.phone}
              />
            </div>
            <div className="col-md-6">
              <TextField
                id="department"
                label="Department"
                placeholder="e.g. Engineering"
                value={form.department}
                onChange={(e) => update('department', e.target.value)}
                error={errors.department}
                hint="Optional"
              />
            </div>
          </div>
        </div>

        <div className="content-card mb-3">
          <div className="card-head">
            <div>
              <h6 className="card-title mb-1">Permissions</h6>
              <p className="card-subtitle mb-0">Control what this user can access.</p>
            </div>
          </div>

          <div className="row g-3">
            <div className="col-md-6">
              <SelectField
                id="role"
                label="Role"
                required
                placeholder="Select a role..."
                options={ROLES}
                value={form.role}
                onChange={(e) => update('role', e.target.value)}
                error={errors.role}
              />
            </div>
            <div className="col-md-6">
              <SelectField
                id="status"
                label="Status"
                required
                placeholder="Select a status..."
                options={USER_STATUSES}
                value={form.status}
                onChange={(e) => update('status', e.target.value)}
                error={errors.status}
              />
            </div>

            <div className="col-12">
              <label className="form-label" htmlFor="notes">
                Notes
              </label>
              <textarea
                id="notes"
                className={`form-control ${errors.notes ? 'is-invalid' : ''}`}
                rows={3}
                placeholder="Anything the team should know about this account..."
                value={form.notes}
                onChange={(e) => update('notes', e.target.value)}
              />
              {errors.notes ? (
                <div className="invalid-feedback d-block">{errors.notes}</div>
              ) : (
                <div className="form-text text-end">{form.notes.length}/200</div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="form-actions">
          <button
            type="button"
            className="btn btn-outline-secondary px-4"
            onClick={() => navigate('/users')}
            disabled={submitting}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary px-4" disabled={submitting}>
            {submitting && <span className="spinner-border spinner-border-sm me-2" />}
            {isEdit ? 'Save changes' : 'Create user'}
          </button>
        </div>
      </form>
    </>
  );
}
