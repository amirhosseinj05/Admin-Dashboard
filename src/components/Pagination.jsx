/**
 * Reusable table pagination.
 * @param {{totalItems:number, page:number, perPage:number, onPageChange:(p:number)=>void}} props
 */
export default function Pagination({ totalItems, page, perPage, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(totalItems / perPage));
  if (totalItems === 0) return null;

  const from = (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, totalItems);

  // Show a small window of page numbers with "..." when there are many pages.
  const pages = [];
  const push = (n) => pages.push(n);
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i += 1) push(i);
  } else if (page <= 3) {
    [1, 2, 3, 4].forEach(push);
    push('…');
    push(totalPages);
  } else if (page >= totalPages - 2) {
    push(1);
    push('…');
    [totalPages - 3, totalPages - 2, totalPages - 1, totalPages].forEach(push);
  } else {
    push(1);
    push('…');
    [page - 1, page, page + 1].forEach(push);
    push('…');
    push(totalPages);
  }

  const go = (next) => {
    if (next < 1 || next > totalPages || next === page) return;
    onPageChange(next);
  };

  return (
    <div className="table-pagination">
      <span className="pagination-info">
        Showing <strong>{from}</strong>–<strong>{to}</strong> of <strong>{totalItems}</strong>{' '}
        results
      </span>

      <ul className="pagination pagination-sm mb-0">
        <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => go(page - 1)} aria-label="Previous page">
            <i className="bi bi-chevron-left" />
          </button>
        </li>

        {pages.map((item, index) =>
          item === '…' ? (
            <li key={`gap-${index}`} className="page-item disabled">
              <span className="page-link">…</span>
            </li>
          ) : (
            <li key={item} className={`page-item ${item === page ? 'active' : ''}`}>
              <button className="page-link" onClick={() => go(item)}>
                {item}
              </button>
            </li>
          )
        )}

        <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => go(page + 1)} aria-label="Next page">
            <i className="bi bi-chevron-right" />
          </button>
        </li>
      </ul>
    </div>
  );
}
