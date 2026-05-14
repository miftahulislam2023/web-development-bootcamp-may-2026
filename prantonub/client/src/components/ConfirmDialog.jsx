import Modal from "./Modal";
export default function ConfirmDialog({ title, message, onConfirm, onCancel, danger = true }) {
  return (
    <Modal title={title} onClose={onCancel} size="sm">
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">{message}</p>
      <div className="flex gap-3">
        <button onClick={onCancel} className="btn-secondary flex-1">Cancel</button>
        <button onClick={onConfirm} className={`flex-1 btn ${danger ? "btn-danger" : "btn-primary"}`}>Confirm</button>
      </div>
    </Modal>
  );
}
