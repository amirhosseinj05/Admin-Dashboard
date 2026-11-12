import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Avatar from '../components/Avatar.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import EmptyState from '../components/EmptyState.jsx';
import LoadingState from '../components/LoadingState.jsx';
import PageHeader from '../components/PageHeader.jsx';
import Pagination from '../components/Pagination.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { useData } from '../context/DataContext.jsx';
import { ROLES, USER_STATUSES } from '../data/mockData.js';
import { deleteUser } from '../services/api.js';
import { formatDate } from '../utils/format.js';
import exportCsv from '../utils/exportCsv.js';

const PER_PAGE = 8;

/** Users management: search + filters + pagination + edit/delete actions. */
export default function Users() {
  const navigate = useNavigate();
  const { users, loading, error, reload, removeUser } = useData();

  const [query, setQuery] = useState('');
  const [role, setRole] = useState('All');
  const [status, setStatus] = useState('All');
  const [page, setPage] = useState(1);

  const [target, setTarget] = useState(null); // user selected for deletion
  const [deleting, setDeleting] = useState(false);
  const [notice, setNotice] = useState(null); // { type, text }

  const hasFilters = query.trim() !== '' || role !== 'All' || status !== 'All';

  /* ------------------------------ filtering ------------------------------ */
  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return users.filter((user) => {
      const matchesQuery =
        !term ||
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.phone?.toLowerCase().includes(term);
      const matchesRole = role === 'All' || user.role === role;
      const matchesStatus = status === 'All' || user.status === status;
      return matchesQuery && matchesRole && matchesStatus;
    });
  }, [users, query, role, status]);

  // Jump back to page 1 whenever the filters change.
  useEffect(() => {
    setPage(1);
  }, [query, role, status]);

  // Auto-hide the success/error banner.
  useEffect(() => {
    if (!notice) return undefined;
    const timer = setTimeout(() => setNotice(null), 4000);
    return () => clearTimeout(timer);
  }, [notice]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const pageItems = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  /* ------------------------------- actions ------------------------------- */
  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await deleteUser(target.id); // ! replace with DELETE /users/:id
      removeUser(target.id); // sync the local Context state
      setNotice({ type: 'success', text: `"${target.name}" was deleted successfully.` });
      setTarget(null);
      // If we removed the last item on the page, step back one page.
      if (page > totalPages - 1) setPage((p) => Math.max(1, p - 1));
    } catch {
      setNotice({ type: 'danger', text: 'Could not delete the user. Please try again.' });
    } finally {
      setDeleting(false);
    }
  };

  const handleExport = () =>
    exportCsv(
      'users',
      ['Name', 'Email', 'Role', 'Status', 'Phone', 'Joined'],
      filtered.map((u) => [u.name, u.email, u.role, u.status, u.phone, u.joinedAt])
    );

  const clearFilters = () => {
    setQuery('');
    setRole('All');
    setStatus('All');
  };

  /* -------------------------------- render ------------------------------- */
  return (
    <>
      <PageHeader title="Users Management" subtitle="Search, filter and manage every account in one place.">
        <button type="button" className="btn btn-outline-secondary btn-sm me-2" onClick={handleExport}>
          <i className="bi bi-download me-1" /> Export CSV
        </button>
        <Link to="/users/new" className="btn btn-primary btn-sm">
          <i className="bi bi-person-plus me-1" /> Add user
        </Link>
      </PageHeader>

      {notice && (
        <div className={`alert alert-${notice.type} alert-dismissible fade show py-2`} role="alert">
          <i className={`bi ${notice.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-circle-fill'} me-2`} />
          {notice.text}
          <button type="button" className="btn-close" onClick={() => setNotice(null)} aria-label="Close" />
        </div>
      )}

      <div className="content-card">
        {/* ----------------------------- toolbar ----------------------------- */}
        <div className="table-toolbar">
          <div className="toolbar-search">
            <i className="bi bi-search" />
            <input
              type="search"
              className="form-control"
              placeholder="Search by name, email or phone..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search users"
            />
          </div>

          <div className="toolbar-filters">
            <select
              className="form-select form-select-sm"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              aria-label="Filter by role"
            >
              <option value="All">All roles</option>
              {ROLES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <select
              className="form-select form-select-sm"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              aria-label="Filter by status"
            >
              <option value="All">All statuses</option>
              {USER_STATUSES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            {hasFilters && (
              <button type="button" className="btn btn-outline-secondary btn-sm" onClick={clearFilters}>
                <i className="bi bi-x-circle me-1" /> Clear
              </button>
            )}
          </div>
        </div>

        {/* ------------------------------ table ------------------------------ */}
        {loading ? (
          <LoadingState rows={6} label="Loading users..." />
        ) : error ? (
          <EmptyState
            icon="bi-cloud-slash"
            title="Unable to load users"
            text={error}
            action={
              <button type="button" className="btn btn-primary btn-sm" onClick={reload}>
                Retry
              </button>
            }
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon="bi-search"
            title="No users found"
            text="Try a different search term or clear the filters."
            action={
              hasFilters ? (
                <button type="button" className="btn btn-outline-secondary btn-sm" onClick={clearFilters}>
                  Clear filters
                </button>
              ) : (
                <Link to="/users/new" className="btn btn-primary btn-sm">
                  Add your first user
                </Link>
              )
            }
          />
        ) : (
          <>
            <div className="table-responsive">
              <table className="table app-table align-middle mb-0">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th className="d-none d-lg-table-cell">Phone</th>
                    <th className="d-none d-xl-table-cell">Joined</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <Avatar name={user.name} id={user.id} />
                          <div className="user-cell">
                            <strong className="d-block">{user.name}</strong>
                            <small className="text-muted">{user.email}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <StatusBadge value={user.role} kind="role" />
                      </td>
                      <td>
                        <StatusBadge value={user.status} />
                      </td>
                      <td className="d-none d-lg-table-cell text-muted small">{user.phone}</td>
                      <td className="d-none d-xl-table-cell text-muted small">{formatDate(user.joinedAt)}</td>
                      <td>
                        <div className="action-btns">
                          <button
                            type="button"
                            className="icon-btn icon-btn-sm"
                            title="Edit user"
                            onClick={() => navigate(`/users/${user.id}/edit`)}
                          >
                            <i className="bi bi-pencil-square" />
                          </button>
                          <button
                            type="button"
                            className="icon-btn icon-btn-sm icon-btn-danger"
                            title="Delete user"
                            onClick={() => setTarget(user)}
                          >
                            <i className="bi bi-trash3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              totalItems={filtered.length}
              page={page}
              perPage={PER_PAGE}
              onPageChange={setPage}
            />
          </>
        )}
      </div>

      {/* Delete confirmation */}
      <ConfirmDialog
        show={Boolean(target)}
        title="Delete user"
        message={`Are you sure you want to delete "${target?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        danger
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setTarget(null)}
      />
    </>
  );
}
