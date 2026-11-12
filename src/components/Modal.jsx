import { useEffect } from 'react';

/**
 * Lightweight custom modal (no Bootstrap JS / jQuery needed).
 * Handles: overlay click, Escape key, scroll lock and fade animation.
 */
export default function Modal({ show, title, onClose, children, footer, size = 'md' }) {
  useEffect(() => {
    if (!show) return undefined;

    const onKey = (event) => event.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="app-modal-overlay" onMouseDown={onClose}>
      <div
        className={`app-modal app-modal-${size}`}
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === 'string' ? title : 'Dialog'}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="app-modal-header">
          <h6 className="mb-0">{title}</h6>
          <button type="button" className="icon-btn icon-btn-sm" onClick={onClose} aria-label="Close">
            <i className="bi bi-x-lg" />
          </button>
        </div>

        <div className="app-modal-body">{children}</div>

        {footer && <div className="app-modal-footer">{footer}</div>}
      </div>
    </div>
  );
}
