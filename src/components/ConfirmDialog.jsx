import Modal from './Modal.jsx';

/**
 * Confirmation dialog used before destructive actions (delete user, ...).
 */
export default function ConfirmDialog({
  show,
  title = 'Are you sure?',
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  danger = false,
  loading = false,
  onConfirm,
  onCancel,
}) {
  return (
    <Modal
      show={show}
      title={title}
      onClose={onCancel}
      size="sm"
      footer={
        <>
          <button type="button" className="btn btn-light btn-sm px-3" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`btn btn-sm px-3 ${danger ? 'btn-danger' : 'btn-primary'}`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading && <span className="spinner-border spinner-border-sm me-2" />}
            {confirmLabel}
          </button>
        </>
      }
    >
      <p className="mb-0 text-muted">{message}</p>
    </Modal>
  );
}
