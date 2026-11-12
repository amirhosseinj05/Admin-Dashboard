/** Small formatting helpers shared by the pages (keep display logic in one place). */

export const formatCurrency = (value, digits = 0) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: digits,
  }).format(Number(value) || 0);

export const formatDate = (iso) => {
  if (!iso) return '—';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
};

export const formatNumber = (value) => new Intl.NumberFormat('en-US').format(Number(value) || 0);
