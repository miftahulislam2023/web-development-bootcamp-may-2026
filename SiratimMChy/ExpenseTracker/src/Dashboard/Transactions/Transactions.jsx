import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../Provider/AuthProvider';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Trash2, Filter, TrendingUp, TrendingDown, Activity, Pencil, X } from 'lucide-react';
import { Link } from 'react-router';

const Transactions = () => {
    const { user } = useContext(AuthContext);
    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [deletingId, setDeletingId] = useState(null);
    const [editingTx, setEditingTx] = useState(null);
    const [saving, setSaving] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        if (!user?.email) return;

        const fetchTx = axios.get(`https://cashnivo.vercel.app/transactions?email=${encodeURIComponent(user.email)}`);
        const fetchCats = axios.get(`https://cashnivo.vercel.app/categories?email=${encodeURIComponent(user.email)}`);

        Promise.all([fetchTx, fetchCats])
            .then(([txRes, catRes]) => {
                setTransactions(Array.isArray(txRes.data) ? txRes.data : []);
                setCategories(Array.isArray(catRes.data) ? catRes.data : []);
            })
            .catch(err => {
                console.error(err);
                toast.error('Failed to load data.');
            })
            .finally(() => setLoading(false));
    }, [user?.email]);

    const filtered = transactions.filter(t => filter === 'all' || t.type === filter);
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const paginatedData = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const categoryOptions = categories.filter(c => c.type === editingTx?.type).map(c => c.name);

    const fmt = amt => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amt);
    const fmtDate = d => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

    const handleDelete = (id) => {
        if (!window.confirm('Delete this transaction?')) return;
        setDeletingId(id);

        axios.delete(`https://cashnivo.vercel.app/transactions/${id}`)
            .then(() => {
                setTransactions(prev => prev.filter(t => t._id !== id));
                toast.success('Transaction deleted.');
            })
            .catch(err => {
                console.error(err);
                toast.error('Failed to delete transaction.');
            })
            .finally(() => setDeletingId(null));
    };

    const handleEditOpen = (t) => {
        setEditingTx({ ...t });
        document.getElementById('edit_modal').showModal();
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditingTx(prev => ({
            ...prev,
            [name]: value,
            ...(name === 'type' ? { category: '' } : {})
        }));
    };

    const handleEditSave = () => {
        if (!editingTx.amount || !editingTx.category || !editingTx.date) {
            toast.error('Please fill in all required fields.');
            return;
        }

        const amount = parseFloat(editingTx.amount);
        if (isNaN(amount) || amount <= 0) {
            toast.error('Please enter a valid amount.');
            return;
        }

        setSaving(true);
        const updated = { ...editingTx, amount };

        axios.put(`https://cashnivo.vercel.app/transactions/${editingTx._id}`, updated)
            .then(() => {
                setTransactions(prev =>
                    prev.map(t => t._id === editingTx._id ? updated : t)
                );
                toast.success('Transaction updated.');
                document.getElementById('edit_modal').close();
                setEditingTx(null);
            })
            .catch(err => {
                console.error(err);
                toast.error('Failed to update transaction.');
            })
            .finally(() => setSaving(false));
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <span className="loading loading-spinner loading-lg"></span>
        </div>
    );

    return (
        <div className="min-h-screen bg-base-100 px-3 py-6 sm:px-6 lg:px-10">
            <div className="max-w-7xl mx-auto space-y-5">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <p className="text-xs sm:text-sm uppercase tracking-[0.2em] font-extrabold bg-linear-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                            Cashnivo
                        </p>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white">Transactions</h1>
                        <p className="mt-1 text-sm text-base-content/60 dark:text-base-content/50">{transactions.length} total records</p>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto bg-base-200 dark:bg-base-200/50 border border-base-content/10 dark:border-base-content/20 rounded-xl px-3 py-2">
                        <Filter size={15} className="text-base-content/40 dark:text-base-content/50 shrink-0" />
                        <div className="dropdown dropdown-end">
                            <button className="bg-transparent text-sm font-medium focus:outline-none text-base-content dark:text-base-content/90 flex items-center gap-1">
                                {filter === 'all' ? 'All Records' : filter.charAt(0).toUpperCase() + filter.slice(1)}
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                </svg>
                            </button>
                            <ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 dark:bg-base-200 border border-base-content/10 dark:border-base-content/20 rounded-box w-52">
                                <li><a onClick={() => { setFilter('all'); setCurrentPage(1); }}>All Records</a></li>
                                <li><a onClick={() => { setFilter('income'); setCurrentPage(1); }}>Income</a></li>
                                <li><a onClick={() => { setFilter('expense'); setCurrentPage(1); }}>Expense</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* List */}
                <div className="card bg-base-200 dark:bg-base-200/50 border border-base-content/10 dark:border-base-content/20 shadow-sm p-4 sm:p-6">
                    {filtered.length === 0 ? (
                        <div className="text-center py-14">
                            <div className="w-14 h-14 bg-base-300 dark:bg-base-300/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Activity size={26} className="text-base-content/30 dark:text-base-content/40" />
                            </div>
                            <p className="text-base-content/50 dark:text-base-content/50 font-semibold">No records found</p>
                            <p className="text-base-content/30 dark:text-base-content/40 text-sm mt-1">
                                {filter === 'all'
                                    ? "You haven't added any transactions yet."
                                    : `No ${filter} records to show.`}
                            </p>
                            <Link to="/dashboard/add-transaction" className="inline-block mt-4 text-sm font-semibold text-blue-600 hover:underline">
                                + Add Transaction
                            </Link>
                        </div>
                    ) : (
                        <>
                            {/* Desktop */}
                            <div className="hidden md:block overflow-x-auto">
                                <div className="grid grid-cols-[2rem_2fr_1fr_1fr_7rem_5rem] gap-x-4 px-4 pb-2 text-[10px] uppercase tracking-widest text-base-content/30 dark:text-base-content/40 font-bold">
                                    <span>#</span>
                                    <span>Details</span>
                                    <span>Category</span>
                                    <span>Date</span>
                                    <span className="text-right">Amount</span>
                                    <span className="text-center">Actions</span>
                                </div>

                                <div className="space-y-1.5">
                                    {paginatedData.map((t, i) => (
                                        <div
                                            key={t._id}
                                            className="grid grid-cols-[2rem_2fr_1fr_1fr_7rem_5rem] gap-x-4 items-center bg-base-100 dark:bg-base-100/50 hover:bg-base-300/40 dark:hover:bg-base-300/20 border border-base-content/5 dark:border-base-content/10 hover:border-base-content/10 dark:hover:border-base-content/20 rounded-xl px-4 py-3 transition-all duration-150"
                                        >
                                            <span className="text-xs text-base-content/30 dark:text-base-content/40 font-semibold">{(currentPage - 1) * itemsPerPage + i + 1}</span>

                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${t.type === 'income' ? 'bg-green-100 dark:bg-green-500/20' : 'bg-red-100 dark:bg-red-500/20'}`}>
                                                    {t.type === 'income'
                                                        ? <TrendingUp size={14} className="text-green-600" />
                                                        : <TrendingDown size={14} className="text-red-500" />
                                                    }
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-semibold text-base-content dark:text-base-content/90 truncate">{t.description || 'No description'}</p>
                                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${t.type === 'income' ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400'}`}>
                                                        {t.type}
                                                    </span>
                                                </div>
                                            </div>

                                            <span className="text-sm text-base-content/60 dark:text-base-content/50 font-medium truncate">{t.category}</span>
                                            <span className="text-sm text-base-content/50 dark:text-base-content/40">{fmtDate(t.date)}</span>

                                            <span className={`text-right text-sm font-bold ${t.type === 'income' ? 'text-green-600' : 'text-red-500'}`}>
                                                {t.type === 'income' ? '+' : '-'}{fmt(t.amount)}
                                            </span>

                                            <div className="flex justify-center gap-1.5">
                                                <button
                                                    onClick={() => handleEditOpen(t)}
                                                    className="p-1.5 text-base-content/30 dark:text-base-content/40 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Pencil size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(t._id)}
                                                    disabled={deletingId === t._id}
                                                    className="p-1.5 text-base-content/30 dark:text-base-content/40 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-40"
                                                    title="Delete"
                                                >
                                                    {deletingId === t._id
                                                        ? <span className="loading loading-spinner loading-xs"></span>
                                                        : <Trash2 size={14} />
                                                    }
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Mobile */}
                            <div className="md:hidden space-y-2">
                                {paginatedData.map((t) => (
                                    <div key={t._id} className="flex items-center gap-2.5 bg-base-100 dark:bg-base-100/50 border border-base-content/5 dark:border-base-content/10 rounded-xl px-3 py-3">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${t.type === 'income' ? 'bg-green-100 dark:bg-green-500/20' : 'bg-red-100 dark:bg-red-500/20'}`}>
                                            {t.type === 'income'
                                                ? <TrendingUp size={14} className="text-green-600" />
                                                : <TrendingDown size={14} className="text-red-500" />
                                            }
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <p className="text-[13px] font-semibold text-base-content dark:text-base-content/90 truncate">{t.description || t.category}</p>
                                            <p className="text-[11px] text-base-content/40 dark:text-base-content/50 truncate">{fmtDate(t.date)} · {t.category}</p>
                                        </div>

                                        <div className="text-right shrink-0">
                                            <p className={`text-[13px] font-bold tabular-nums ${t.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                                                {t.type === 'income' ? '+' : '-'}{fmt(t.amount)}
                                            </p>
                                            <div className="flex justify-end gap-1 mt-1">
                                                <button
                                                    onClick={() => handleEditOpen(t)}
                                                    className="p-1 text-base-content/30 dark:text-base-content/40 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-md transition-colors"
                                                >
                                                    <Pencil size={12} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(t._id)}
                                                    disabled={deletingId === t._id}
                                                    className="p-1 text-base-content/30 dark:text-base-content/40 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors disabled:opacity-40"
                                                >
                                                    {deletingId === t._id
                                                        ? <span className="loading loading-spinner loading-xs"></span>
                                                        : <Trash2 size={12} />
                                                    }
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Pagination */}
                {filtered.length > itemsPerPage && (
                    <div className="flex items-center justify-center gap-2 mt-6">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                            className="btn btn-sm btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>

                        <div className="flex items-center gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`btn btn-sm ${currentPage === page
                                        ? 'bg-linear-to-r from-blue-600 to-cyan-600 text-white border-none'
                                        : 'btn-outline'
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                            className="btn btn-sm btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            <dialog id="edit_modal" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box bg-base-100 dark:bg-base-100/50 border border-base-content/10 dark:border-base-content/20 p-6 sm:p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-base-content dark:text-base-content/90">Edit Transaction</h3>
                        <button
                            onClick={() => document.getElementById('edit_modal').close()}
                            className="p-1.5 hover:bg-base-200 dark:hover:bg-base-200/50 rounded-lg transition-colors"
                        >
                            <X size={18} className="text-base-content/50 dark:text-base-content/40" />
                        </button>
                    </div>

                    {editingTx && (
                        <div className="space-y-4">
                            {/* Type */}
                            <div>
                                <p className="text-sm font-semibold text-base-content dark:text-base-content/90 mb-2">Type</p>
                                <div className="flex rounded-xl border border-base-300 dark:border-base-300/50 bg-base-200 dark:bg-base-200/50 p-1">
                                    {['expense', 'income'].map(type => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => handleEditChange({ target: { name: 'type', value: type } })}
                                            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition ${editingTx.type === type
                                                ? 'bg-linear-to-r from-blue-600 to-cyan-600 text-white shadow-sm'
                                                : 'text-base-content/60 dark:text-base-content/50 hover:text-base-content dark:hover:text-base-content/90'
                                                }`}
                                        >
                                            {type.charAt(0).toUpperCase() + type.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Amount + Date */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-sm font-semibold text-base-content dark:text-base-content/90 block mb-1.5">Amount</label>
                                    <input
                                        name="amount"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={editingTx.amount}
                                        onChange={handleEditChange}
                                        className="input input-bordered bg-base-100 dark:bg-base-100/50 dark:border-base-content/20 dark:text-base-content/90 w-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-base-content dark:text-base-content/90 block mb-1.5">Date</label>
                                    <input
                                        name="date"
                                        type="date"
                                        value={editingTx.date?.split('T')[0] || editingTx.date}
                                        onChange={handleEditChange}
                                        className="input input-bordered bg-base-100 dark:bg-base-100/50 dark:border-base-content/20 dark:text-base-content/90 w-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            {/* Category */}
                            <div>
                                <label className="text-sm font-semibold text-base-content dark:text-base-content/90 block mb-1.5">Category</label>
                                <div className="dropdown w-full">
                                    <button className="btn btn-outline w-full justify-between bg-base-100 dark:bg-base-100/50 dark:border-base-content/20 dark:text-base-content/90">
                                        {editingTx.category || 'Select Category'}
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                        </svg>
                                    </button>
                                    <ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 dark:bg-base-200 border border-base-content/10 dark:border-base-content/20 rounded-box w-full">
                                        {categoryOptions.map(cat => (
                                            <li key={cat}>
                                                <a onClick={() => handleEditChange({ target: { name: 'category', value: cat } })}>
                                                    {cat}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="text-sm font-semibold text-base-content dark:text-base-content/90 block mb-1.5">Description</label>
                                <textarea
                                    name="description"
                                    value={editingTx.description || ''}
                                    onChange={handleEditChange}
                                    rows={3}
                                    placeholder="Optional notes"
                                    className="textarea textarea-bordered bg-base-100 dark:bg-base-100/50 dark:border-base-content/20 dark:text-base-content/90 w-full resize-none focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => document.getElementById('edit_modal').close()}
                                    className="btn btn-outline flex-1"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleEditSave}
                                    disabled={saving}
                                    className="btn bg-linear-to-r from-blue-600 to-cyan-600 text-white border-none flex-1"
                                >
                                    {saving
                                        ? <span className="loading loading-spinner loading-sm"></span>
                                        : 'Save Changes'
                                    }
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </div>
    );
};

export default Transactions;