import { useEffect, useMemo, useState } from 'react';

import ConfirmDialog from '../components/ConfirmDialog.jsx';
import EmptyState from '../components/EmptyState.jsx';
import LoadingState from '../components/LoadingState.jsx';
import Modal from '../components/Modal.jsx';
import PageHeader from '../components/PageHeader.jsx';
import Pagination from '../components/Pagination.jsx';
import { useData } from '../context/DataContext.jsx';
import { ORDER_STATUSES } from '../data/mockData.js';
import { updateOrderStatus } from '../services/api.js';
import { formatCurrency, formatDate } from '../utils/format.js';
import exportCsv from '../utils/exportCsv.js';

const PER_PAGE = 8;

const STATUS_BADGE = {
  Completed: 'text-bg-success',
  Pending: 'text-bg-warning',
  Cancelled: 'text-bg-danger',
};

/** Orders management: search, filter, inline status change and details modal. */
export default function Orders() {
  const { orders, loading, error, reload, changeOrderStatus } = useData();

  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');
  const [page, setPage] = useState(1);

  const [selectedId, setSelectedId] = useState(null); // order opened in the modal
  const [savingId, setSavingId] = useState(null); // order whose status is being saved
  const [confirmCancel, setConfirmCancel] = useState(null); // order targeted for cancellation
  const [notice, setNotice] = useState(null);

  const selectedOrder = orders.find((order) => order.id === selectedId) || null;
  const hasFilters = query.trim() !== '' || status !== 'All';

  /* ------------------------------ filtering ------------------------------ */
  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesQuery =
        !term ||
        order.id.toLowerCase().includes(term) ||
        order.customer.toLowerCase().includes(term) ||
        order.product.toLowerCase().includes(term);
      const matchesStatus = status === 'All' || order.status === status;
      return matchesQuery && matchesStatus;
    });
  }, [orders, query, status]);

  useEffect(() => {
    setPage(1);
  }, [query, status]);

  useEffect(() => {
    if (!notice) return undefined;
    const timer = setTimeout(() => setNotice(null), 4000);
    return () => clearTimeout(timer);
  }, [notice]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const pageItems = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  /* ------------------------------- actions ------------------------------- */
  const applyStatus = async (order, nextStatus) => {
    setSavingId(order.id);
    try {
      await updateOrderStatus(order.id, nextStatus); // ! replace with PATCH /orders/:id
      changeOrderStatus(order.id, nextStatus); // sync Context state
      setNotice({
        type: 'success',
        text: `${order.id} is now "${nextStatus}".`,
      });
    } catch {
      setNotice({ type: 'danger', text: 'Could not update the order status.' });
    } finally {
      setSavingId(null);
    }
  };

  // Cancel is destructive -> ask for confirmation first.
  const handleStatusSelect = (order, value) => {
    if (value === 'Cancelled' && order.status !== 'Cancelled') setConfirmCancel(order);
    else applyStatus(order, value);
  };

  const clearFilters = () => {
    setQuery('');
    setStatus('All');
  };

  const handleExport = () =>
    exportCsv(
      'orders',
      ['Order ID', 'Customer', 'Product', 'Amount', 'Date', 'Status', 'Payment'],
      filtered.map((o) => [o.id, o.customer, o.product, o.amount, o.date, o.status, o.payment])
    );

  /* -------------------------------- render ------------------------------- */
  return (
    <>
      <PageHeader title="Orders" subtitle="Track every order and update its status in real time.">
        <button type="button" className="btn btn-outline-secondary btn-sm" onClick={handleExport}>
          <i className="bi bi-download me-1" /> Export CSV
        </button>
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
              placeholder="Search by order id, customer or product..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search orders"
            />
          </div>

          <div className="toolbar-filters">
            <select
              className="form-select form-select-sm"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              aria-label="Filter by status"
            >
              <option value="All">All statuses</option>
              {ORDER_STATUSES.map((item) => (
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
          <LoadingState rows={6} label="Loading orders..." />
        ) : error ? (
          <EmptyState
            icon="bi-cloud-slash"
            title="Unable to load orders"
            text={error}
            action={
              <button type="button" className="btn btn-primary btn-sm" onClick={reload}>
                Retry
              </button>
            }
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon="bi-cart-x"
            title="No orders found"
            text="Try another search term or clear the filters."
            action={
              hasFilters && (
                <button type="button" className="btn btn-outline-secondary btn-sm" onClick={clearFilters}>
                  Clear filters
                </button>
              )
            }
          />
        ) : (
          <>
            <div className="table-responsive">
              <table className="table app-table align-middle mb-0">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Customer</th>
                    <th className="d-none d-lg-table-cell">Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map((order) => (
                    <tr key={order.id}>
                      <td>
                        <span className="order-id">{order.id}</span>
                        <div className="text-muted small d-none d-md-block">{order.product}</div>
                      </td>
                      <td className="fw-semibold">{order.customer}</td>
                      <td className="d-none d-lg-table-cell text-muted small">{formatDate(order.date)}</td>
                      <td className="fw-semibold">{formatCurrency(order.amount)}</td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <span className={`badge rounded-pill ${STATUS_BADGE[order.status]}`}>
                            {order.status}
                          </span>
                        </div>
                        {/* Inline status changer (dummy action, ready for a real API) */}
                        <select
                          className="form-select form-select-sm status-select mt-1"
                          value={order.status}
                          onChange={(e) => handleStatusSelect(order, e.target.value)}
                          disabled={savingId === order.id}
                          aria-label={`Change status of ${order.id}`}
                        >
                          {ORDER_STATUSES.map((item) => (
                            <option key={item} value={item}>
                              {item}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <div className="action-btns">
                          <button
                            type="button"
                            className="icon-btn icon-btn-sm"
                            title="View details"
                            onClick={() => setSelectedId(order.id)}
                          >
                            <i className="bi bi-eye" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination totalItems={filtered.length} page={page} perPage={PER_PAGE} onPageChange={setPage} />
          </>
        )}
      </div>

      {/* ------------------------- order details modal ------------------------- */}
      <Modal
        show={Boolean(selectedOrder)}
        title={selectedOrder ? `Order ${selectedOrder.id}` : 'Order details'}
        onClose={() => setSelectedId(null)}
        size="lg"
        footer={
          <>
            <button type="button" className="btn btn-light btn-sm px-3" onClick={() => setSelectedId(null)}>
              Close
            </button>
            {selectedOrder && selectedOrder.status !== 'Completed' && (
              <button
                type="button"
                className="btn btn-primary btn-sm px-3"
                disabled={savingId === selectedOrder.id}
                onClick={async () => {
                  await applyStatus(selectedOrder, 'Completed');
                }}
              >
                Mark as completed
              </button>
            )}
          </>
        }
      >
        {selectedOrder && (
          <div className="order-details">
            <div className="order-details-head">
              <div>
                <span className={`badge rounded-pill ${STATUS_BADGE[selectedOrder.status]}`}>
                  {selectedOrder.status}
                </span>
                <h5 className="mt-2 mb-0">{selectedOrder.product}</h5>
                <small className="text-muted">Placed on {formatDate(selectedOrder.date)}</small>
              </div>
              <div className="text-end">
                <small className="text-muted d-block">Total amount</small>
                <strong className="fs-5">{formatCurrency(selectedOrder.amount)}</strong>
              </div>
            </div>

            <div className="row g-3 mb-3">
              <div className="col-sm-6">
                <div className="detail-box">
                  <span className="detail-label">Customer</span>
                  <strong>{selectedOrder.customer}</strong>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="detail-box">
                  <span className="detail-label">Payment method</span>
                  <strong>{selectedOrder.payment}</strong>
                </div>
              </div>
            </div>

            <div className="detail-box">
              <span className="detail-label">Items</span>
              <div className="table-responsive">
                <table className="table table-sm align-middle mb-0 detail-items">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th className="text-center">Qty</th>
                      <th className="text-end">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((item) => (
                      <tr key={item.name}>
                        <td>{item.name}</td>
                        <td className="text-center">{item.qty}</td>
                        <td className="text-end">{formatCurrency(item.price)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={2} className="text-muted">
                        Subtotal
                      </td>
                      <td className="text-end fw-semibold">{formatCurrency(selectedOrder.amount)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Cancelling an order needs confirmation */}
      <ConfirmDialog
        show={Boolean(confirmCancel)}
        title="Cancel order"
        message={`Do you really want to cancel ${confirmCancel?.id}? The customer will be notified.`}
        confirmLabel="Cancel order"
        danger
        loading={Boolean(confirmCancel) && savingId === confirmCancel.id}
        onConfirm={async () => {
          await applyStatus(confirmCancel, 'Cancelled');
          setConfirmCancel(null);
        }}
        onCancel={() => setConfirmCancel(null)}
      />
    </>
  );
}
