import { useState } from 'react';
import { Link } from 'react-router-dom';

import EmptyState from '../components/EmptyState.jsx';
import LoadingState from '../components/LoadingState.jsx';
import PageHeader from '../components/PageHeader.jsx';
import StatCard from '../components/StatCard.jsx';
import OrderStatusChart from '../components/charts/OrderStatusChart.jsx';
import SalesChart from '../components/charts/SalesChart.jsx';
import { useData } from '../context/DataContext.jsx';
import { dailyGrowth, monthlyGrowth, pendingTasks, recentActivities, statComparisons } from '../data/mockData.js';
import { formatCurrency, formatDate, formatNumber } from '../utils/format.js';

/** Date ranges offered by the dashboard switcher (keys of `dailyGrowth`). */
const RANGES = ['7 days', '30 days', '12 months'];

/** Dashboard overview: summary cards, charts, latest orders and activity feed. */
export default function Dashboard() {
  const { users, orders, loading, error, reload } = useData();
  const [range, setRange] = useState('12 months');

  // Real comparison of the last two points of the sales/users series.
  const growthOf = (series) => {
    const last = series[series.length - 1];
    const prev = series[series.length - 2];
    return Number((((last - prev) / prev) * 100).toFixed(1));
  };

  // Current-month revenue (same source as the chart => consistent numbers).
  const currentMonthRevenue = monthlyGrowth.sales[monthlyGrowth.sales.length - 1];
  const revenueGrowth = growthOf(monthlyGrowth.sales);
  const usersGrowth = growthOf(monthlyGrowth.newUsers);

  const statusCounts = orders.reduce(
    (acc, order) => ({ ...acc, [order.status]: (acc[order.status] || 0) + 1 }),
    { Completed: 0, Pending: 0, Cancelled: 0 }
  );

  const latestOrders = orders.slice(0, 5);

  if (error) {
    return (
      <>
        <PageHeader title="Dashboard" />
        <div className="content-card">
          <EmptyState
            icon="bi-cloud-slash"
            title="Could not load the dashboard"
            text={error}
            action={
              <button type="button" className="btn btn-primary btn-sm" onClick={reload}>
                <i className="bi bi-arrow-clockwise me-1" /> Try again
              </button>
            }
          />
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Welcome back — here is your business at a glance.">
        <div className="btn-group btn-group-sm" role="group" aria-label="Date range">
          {RANGES.map((item) => (
            <button
              key={item}
              type="button"
              className={`btn btn-outline-secondary ${range === item ? 'active' : ''}`}
              aria-pressed={range === item}
              onClick={() => setRange(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </PageHeader>

      {loading ? (
        <div className="content-card">
          <LoadingState rows={6} label="Loading dashboard..." />
        </div>
      ) : (
        <>
          {/* ---------------------------- SUMMARY CARDS --------------------------- */}
          <div className="row g-3 g-xl-4 mb-3 mb-xl-4">
            <div className="col-12 col-md-6 col-xxl-3">
              <StatCard
                title="Total Users"
                value={formatNumber(users.length)}
                icon="bi-people-fill"
                tone="primary"
                trend={usersGrowth}
              />
            </div>
            <div className="col-12 col-md-6 col-xxl-3">
              <StatCard
                title="Total Orders"
                value={formatNumber(orders.length)}
                icon="bi-bag-check-fill"
                tone="success"
                trend={statComparisons.orders.growth}
              />
            </div>
            <div className="col-12 col-md-6 col-xxl-3">
              <StatCard
                title="Revenue"
                value={formatCurrency(currentMonthRevenue)}
                icon="bi-cash-stack"
                tone="info"
                trend={revenueGrowth}
              />
            </div>
            <div className="col-12 col-md-6 col-xxl-3">
              <StatCard
                title="Pending Tasks"
                value={formatNumber(pendingTasks.length)}
                icon="bi-list-check"
                tone="warning"
                trend={statComparisons.tasks.growth}
              />
            </div>
          </div>

          {/* -------------------------------- CHARTS ------------------------------ */}
          <div className="row g-3 g-xl-4 mb-3 mb-xl-4">
            <div className="col-12 col-xl-8">
              <div className="content-card h-100">
                <div className="card-head">
                  <div>
                    <h6 className="card-title mb-1">Growth overview</h6>
                    <p className="card-subtitle mb-0">Monthly sales and newly registered users</p>
                  </div>
                  <span className="soft-chip">Last {range}</span>
                </div>
                <SalesChart height={300} series={dailyGrowth[range]} />
              </div>
            </div>

            <div className="col-12 col-xl-4">
              <div className="content-card h-100">
                <div className="card-head">
                  <div>
                    <h6 className="card-title mb-1">Orders by status</h6>
                    <p className="card-subtitle mb-0">{orders.length} orders in total</p>
                  </div>
                </div>
                <OrderStatusChart counts={statusCounts} height={264} />
              </div>
            </div>
          </div>

          {/* ------------------------ LATEST ORDERS + ACTIVITY -------------------- */}
          <div className="row g-3 g-xl-4">
            <div className="col-12 col-xl-8">
              <div className="content-card h-100">
                <div className="card-head">
                  <div>
                    <h6 className="card-title mb-1">Latest orders</h6>
                    <p className="card-subtitle mb-0">The most recent orders of your store</p>
                  </div>
                  <Link to="/orders" className="card-link">
                    View all <i className="bi bi-arrow-right" />
                  </Link>
                </div>

                <div className="table-responsive">
                  <table className="table app-table align-middle mb-0">
                    <thead>
                      <tr>
                        <th>Order</th>
                        <th>Customer</th>
                        <th className="d-none d-md-table-cell">Date</th>
                        <th>Amount</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {latestOrders.map((order) => (
                        <tr key={order.id}>
                          <td>
                            <span className="order-id">{order.id}</span>
                          </td>
                          <td>
                            <span className="fw-semibold">{order.customer}</span>
                            <div className="text-muted small d-none d-lg-block">{order.product}</div>
                          </td>
                          <td className="d-none d-md-table-cell text-muted">{formatDate(order.date)}</td>
                          <td className="fw-semibold">{formatCurrency(order.amount)}</td>
                          <td>
                            <span
                              className={`badge rounded-pill ${
                                order.status === 'Completed'
                                  ? 'text-bg-success'
                                  : order.status === 'Pending'
                                    ? 'text-bg-warning'
                                    : 'text-bg-danger'
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="col-12 col-xl-4">
              <div className="content-card h-100">
                <div className="card-head">
                  <div>
                    <h6 className="card-title mb-1">Recent activity</h6>
                    <p className="card-subtitle mb-0">Latest actions across the platform</p>
                  </div>
                </div>

                <ul className="activity-list mb-0">
                  {recentActivities.map((item) => (
                    <li className="activity-item" key={item.id}>
                      <span className={`activity-icon activity-icon-${item.color}`}>
                        <i className={`bi ${item.icon}`} />
                      </span>
                      <div className="activity-body">
                        <div className="d-flex justify-content-between gap-2">
                          <strong className="small">{item.title}</strong>
                          <small className="text-muted text-nowrap">{item.time}</small>
                        </div>
                        <p className="text-muted small mb-0">{item.text}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
