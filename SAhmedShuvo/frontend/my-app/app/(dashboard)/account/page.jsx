"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Banknote,
  Building2,
  CreditCard,
  Smartphone,
  Plus,
  X,
  Loader2,
  Trash2,
  ArrowRightLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";
const ACCOUNT_TYPES = [
  {
    label: "Cash",
    value: "Cash",
    icon: Banknote,
    bg: "#ECFDF5",
    color: "#10B981",
    badgeBg: "#ECFDF5",
    badgeText: "#065F46",
  },
  {
    label: "Bank",
    value: "Bank",
    icon: Building2,
    bg: "#EEF2FF",
    color: "#6366F1",
    badgeBg: "#EEF2FF",
    badgeText: "#3730A3",
  },
  {
    label: "Card",
    value: "Card",
    icon: CreditCard,
    bg: "#FFF5F5",
    color: "#EF4444",
    badgeBg: "#FFF5F5",
    badgeText: "#991B1B",
  },
  {
    label: "Mobile Banking",
    value: "Mobile-Banking",
    icon: Smartphone,
    bg: "#FFF7ED",
    color: "#F59E0B",
    badgeBg: "#FFF7ED",
    badgeText: "#92400E",
  },
];

const fmt = (n = 0) => "৳" + Number(n).toLocaleString("en-BD");

export default function AccountPage() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);

  const [deleteModal, setDeleteModal] = useState({
    open: false,
    id: null,
  });

  const [transferData, setTransferData] = useState({
    from: "",
    to: "",
    amount: "",
  });
  const router = useRouter();

  const [transferLoading, setTransferLoading] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
    }
  }, []);
  useEffect(() => {
    fetchAccounts();
  }, []);

  async function fetchAccounts() {
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "https://personal-expense-tracker-r33t.onrender.com/api/account/show",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to fetch accounts");
        return;
      }

      setAccounts(data.data || []);
    } catch (err) {
      console.log(err);

      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `https://personal-expense-tracker-r33t.onrender.com/api/account/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to delete account");
        return;
      }

      toast.success("Account deleted");

      setAccounts((prev) => prev.filter((acc) => acc._id !== id));

      setDeleteModal({
        open: false,
        id: null,
      });
    } catch (error) {
      console.log(error);

      toast.error("Something went wrong");
    }
  }

  const handleTransferChange = (e) => {
    setTransferData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  async function handleTransfer(e) {
    e.preventDefault();

    if (!transferData.from || !transferData.to || !transferData.amount) {
      toast.error("All fields are required");

      return;
    }

    if (transferData.from === transferData.to) {
      toast.error("Cannot transfer to the same account");

      return;
    }

    try {
      setTransferLoading(true);

      const token = localStorage.getItem("token");

      const res = await fetch(
        "https://personal-expense-tracker-r33t.onrender.com/api/account/transfer",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            from: transferData.from,
            to: transferData.to,
            amount: Number(transferData.amount),
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Transfer failed");

        return;
      }

      toast.success("Balance transferred");

      setTransferData({
        from: "",
        to: "",
        amount: "",
      });

      fetchAccounts();
    } catch (error) {
      console.log(error);

      toast.error("Something went wrong");
    } finally {
      setTransferLoading(false);
    }
  }

  const totalBalance = accounts.reduce((s, a) => s + Number(a.balance), 0);

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">My accounts</h1>

          <p className="mt-0.5 text-sm text-slate-400">
            Manage all your financial accounts
          </p>
        </div>

        {!loading && (
          <span className="rounded-full bg-indigo-50 px-4 py-1.5 text-sm font-medium text-indigo-500">
            Total: {fmt(totalBalance)}
          </span>
        )}
      </div>

      {/* Balance Transfer */}
      <div className="sticky top-[70px] z-20 rounded-2xl border border-slate-200 bg-white p-6">
        <div className="mb-5 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
            <ArrowRightLeft size={18} className="text-indigo-500" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Balance Transfer
            </h2>

            <p className="text-sm text-slate-400">
              Transfer balance between accounts
            </p>
          </div>
        </div>

        <form
          onSubmit={handleTransfer}
          className="grid grid-cols-1 gap-4 md:grid-cols-4"
        >
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-500">From</label>

            <select
              name="from"
              value={transferData.from}
              onChange={handleTransferChange}
              className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition-all focus:border-indigo-400 focus:bg-white"
            >
              <option value="">Select account</option>

              {accounts.map((acc) => (
                <option key={acc._id} value={acc._id}>
                  {acc.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-500">To</label>

            <select
              name="to"
              value={transferData.to}
              onChange={handleTransferChange}
              className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition-all focus:border-indigo-400 focus:bg-white"
            >
              <option value="">Select account</option>

              {accounts.map((acc) => (
                <option key={acc._id} value={acc._id}>
                  {acc.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-500">Amount</label>

            <input
              type="number"
              name="amount"
              placeholder="0.00"
              value={transferData.amount}
              onChange={handleTransferChange}
              className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-300 focus:border-indigo-400 focus:bg-white"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={transferLoading}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 text-sm font-medium text-white transition-all hover:bg-indigo-600 active:scale-[0.98] disabled:opacity-70"
            >
              {transferLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                "Transfer"
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Accounts */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {!loading && (
          <button
            onClick={() => setShowModal(true)}
            className="group flex min-h-[148px] cursor-pointer flex-col items-center justify-center gap-2.5 rounded-2xl border-2 border-dashed border-slate-200 bg-white p-5 transition-all hover:border-indigo-300 hover:bg-indigo-50/30"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 transition-colors group-hover:bg-indigo-100">
              <Plus size={20} className="text-indigo-500" />
            </div>

            <span className="text-sm font-medium text-indigo-500">
              Add account
            </span>

            <span className="text-xs text-slate-300">
              Connect a new account
            </span>
          </button>
        )}
        {loading &&
          Array(3)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="h-[148px] animate-pulse rounded-2xl border border-slate-200 bg-white p-5"
              />
            ))}

        {!loading &&
          accounts.map((acc) => (
            <AccountCard
              key={acc._id || acc.id}
              account={acc}
              onDelete={setDeleteModal}
            />
          ))}
      </div>

      {/* Add Account Modal */}
      {showModal && (
        <AddAccountModal
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            fetchAccounts();
          }}
        />
      )}

      {/* Delete Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50">
                <Trash2 size={18} className="text-rose-500" />
              </div>

              <div className="flex-1">
                <h2 className="text-base font-semibold text-slate-900">
                  Delete account?
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() =>
                  setDeleteModal({
                    open: false,
                    id: null,
                  })
                }
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-500 transition-all hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                onClick={() => handleDelete(deleteModal.id)}
                className="rounded-xl bg-rose-500 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-rose-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AccountCard({ account, onDelete }) {
  const type =
    ACCOUNT_TYPES.find((t) => t.value === account.type) ?? ACCOUNT_TYPES[0];

  const Icon = type.icon;

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition-colors hover:border-indigo-200">
      <div className="flex items-start justify-between gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{ background: type.bg }}
        >
          <Icon size={20} style={{ color: type.color }} />
        </div>

        <div className="flex items-center gap-2">
          <span
            className="rounded-full px-2 py-1 text-[10px] font-medium"
            style={{
              background: type.badgeBg,
              color: type.badgeText,
            }}
          >
            {type.label}
          </span>

          <button
            onClick={() =>
              onDelete({
                open: true,
                id: account._id,
              })
            }
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-all hover:bg-rose-50 hover:text-rose-500"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-slate-800">{account.name}</p>

        <p className="mt-0.5 text-xs text-slate-300">{type.label} account</p>
      </div>

      <p className="text-xl font-semibold tracking-tight text-slate-900">
        {fmt(account.balance)}
      </p>
    </div>
  );
}

function AddAccountModal({ onClose, onSuccess }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("Cash");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Account name is required");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await fetch(
        "https://personal-expense-tracker-r33t.onrender.com/api/account/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: name.trim(),
            type,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to add account");
        return;
      }

      toast.success("Account added successfully");

      onSuccess();
    } catch (error) {
      console.log(error);

      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="flex w-full max-w-sm flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">
            Add new account
          </h2>

          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-400 transition-colors hover:text-slate-600"
          >
            <X size={15} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-500">
              Account name
            </label>

            <input
              type="text"
              placeholder="e.g. bKash"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-300 focus:border-indigo-400 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            {ACCOUNT_TYPES.map((t) => {
              const Icon = t.icon;
              const selected = type === t.value;

              return (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setType(t.value)}
                  className={`flex items-center gap-2.5 rounded-xl border p-3 text-left transition-all ${
                    selected
                      ? "border-indigo-400 bg-indigo-50"
                      : "border-slate-200 hover:border-indigo-200 hover:bg-slate-50"
                  }`}
                >
                  <div
                    className="flex h-7 w-7 items-center justify-center rounded-lg"
                    style={{
                      background: t.bg,
                    }}
                  >
                    <Icon
                      size={15}
                      style={{
                        color: t.color,
                      }}
                    />
                  </div>

                  <span
                    className={`text-xs font-medium ${
                      selected ? "text-indigo-600" : "text-slate-500"
                    }`}
                  >
                    {t.label}
                  </span>
                </button>
              );
            })}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex h-11 items-center justify-center gap-2 rounded-xl bg-indigo-500 text-sm font-medium text-white transition-all hover:bg-indigo-600 active:scale-[0.98] disabled:opacity-70"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>
                <Plus size={16} />
                Add account
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
