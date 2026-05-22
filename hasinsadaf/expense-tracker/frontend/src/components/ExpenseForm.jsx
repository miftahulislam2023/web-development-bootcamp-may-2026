"use client";

import { useState } from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import {
  Cross2Icon,
  CheckIcon,
  TrashIcon,
} from "@radix-ui/react-icons";

export default function ExpenseForm({
  isOpen,
  expense,
  categories,
  onClose,
  onSave,
  onDelete,
}) {
  const [amount, setAmount] = useState(expense?.amount || "");
  const [description, setDescription] = useState(expense?.description || "");
  const [category_id, setCategory_id] = useState(expense?.category_id || "");
  const [date, setDate] = useState(expense?.date || "");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  const handleConfirmSave = () => {
    const categoryId =
      category_id === "" || category_id === null || category_id === undefined
        ? null
        : Number(category_id);
    onSave({
      amount: parseFloat(amount),
      description,
      category_id: Number.isFinite(categoryId) ? categoryId : null,
      date,
    });
    setShowConfirm(false);
  };

  const handleDeleteConfirm = () => {
    if (expense?.id) {
      onDelete(expense.id);
      setShowDeleteConfirm(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <AlertDialog.Root open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="modal-overlay" style={{ zIndex: 1002 }} />
          <AlertDialog.Content className="modal-card dialog-card">
            <AlertDialog.Title className="section-title">
              {expense ? "Confirm update" : "Confirm expense"}
            </AlertDialog.Title>
            <AlertDialog.Description className="section-subtitle" style={{ marginBottom: "24px" }}>
              {expense
                ? `Update this expense to BDT ${amount} for ${description || "this item"} on ${date}?`
                : `Add an expense of BDT ${amount} for ${description || "this item"} on ${date}?`}
            </AlertDialog.Description>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
              <AlertDialog.Cancel asChild>
                <button type="button" className="btn btn-ghost">
                  Cancel
                </button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <button type="button" className="btn btn-primary" onClick={handleConfirmSave}>
                  Confirm
                </button>
              </AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>

      <div className="modal-overlay" onClick={onClose} />
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "18px", marginBottom: "24px" }}>
          <div>
            <h2 className="section-title">{expense ? "Edit expense" : "Add expense"}</h2>
            <p className="section-subtitle">Keep your spending records clean and categorized.</p>
          </div>
          <button onClick={onClose} className="btn btn-ghost icon-btn" aria-label="Close">
            <Cross2Icon width={16} height={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="form-stack" style={{ marginTop: 0 }}>
          <div>
            <label className="label">Amount</label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="input"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="label">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="input"
              placeholder="Lunch, ride share, groceries"
            />
          </div>

          <div>
            <label className="label">Category</label>
            <select
              value={category_id}
              onChange={(e) => setCategory_id(e.target.value)}
              required
              className="input"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="input"
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", alignItems: "center", flexWrap: "wrap", paddingTop: "8px" }}>
            {expense && (
              <AlertDialog.Root open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                <AlertDialog.Trigger asChild>
                  <button type="button" className="btn btn-danger" style={{ marginRight: "auto" }}>
                    <TrashIcon width={16} height={16} />
                    Delete
                  </button>
                </AlertDialog.Trigger>
                <AlertDialog.Portal>
                  <AlertDialog.Overlay className="modal-overlay" style={{ zIndex: 1002 }} />
                  <AlertDialog.Content className="modal-card dialog-card">
                    <AlertDialog.Title className="section-title">Delete expense</AlertDialog.Title>
                    <AlertDialog.Description className="section-subtitle" style={{ marginBottom: "24px" }}>
                      This action cannot be undone.
                    </AlertDialog.Description>
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                      <AlertDialog.Cancel asChild>
                        <button type="button" className="btn btn-ghost">
                          Cancel
                        </button>
                      </AlertDialog.Cancel>
                      <AlertDialog.Action asChild>
                        <button type="button" className="btn btn-danger" onClick={handleDeleteConfirm}>
                          Yes, delete
                        </button>
                      </AlertDialog.Action>
                    </div>
                  </AlertDialog.Content>
                </AlertDialog.Portal>
              </AlertDialog.Root>
            )}

            <button type="button" onClick={onClose} className="btn btn-ghost">
              <Cross2Icon width={16} height={16} />
              Cancel
            </button>

            <button type="submit" className="btn btn-primary">
              <CheckIcon width={16} height={16} />
              Save
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
