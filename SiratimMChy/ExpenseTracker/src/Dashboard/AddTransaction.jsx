import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router';
import { AuthContext } from '../Provider/AuthProvider';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Save } from 'lucide-react';

const AddTransaction = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [formData, setFormData] = useState({
        type: 'expense',
        amount: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
    });

    useEffect(() => {
        if (!user?.email) return;
        let active = true;

        const fetchCategories = async () => {
            try {
                setLoadingCategories(true);
                const res = await axios.get(`https://cashnivo.vercel.app/categories?email=${user.email}`);
                if (!active) return;
                const data = Array.isArray(res.data) ? res.data : [];
                setCategories(data);
                setFormData(prev => ({
                    ...prev,
                    category: prev.category || (data.find(c => c.type === prev.type)?.name || ''),
                }));
            } catch (err) {
                console.error(err);
                toast.error('Unable to load categories.');
            } finally {
                if (active) setLoadingCategories(false);
            }
        };

        fetchCategories();
        return () => { active = false; };
    }, [user?.email]);

    const categoryOptions = categories
        .filter(c => c.type === formData.type)
        .map(c => c.name);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleTypeChange = (type) => {
        setFormData(prev => ({
            ...prev,
            type,
            category: categories.find(c => c.type === type)?.name || '',
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.amount || !formData.category || !formData.date) {
            toast.error('Amount, category and date are required.');
            return;
        }

        const amount = parseFloat(formData.amount);
        if (Number.isNaN(amount) || amount <= 0) {
            toast.error('Please enter a valid amount.');
            return;
        }

        const transaction = {
            ...formData,
            amount,
            email: user.email,
            createdAt: new Date().toISOString(),
        };

        try {
            await axios.post('https://cashnivo.vercel.app/transactions', transaction);
            toast.success('Transaction saved successfully!');
            navigate("/dashboard/dashboardhome");
        } catch (err) {
            console.error(err);
            toast.error('Unable to save transaction.');
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-base-100 px-4 py-8">
                <div className="max-w-3xl mx-auto rounded-3xl border border-base-content/10 bg-base-200 p-8 text-center shadow-sm">
                    <h2 className="text-2xl font-semibold mb-4">Please sign in first</h2>
                    <p className="text-base-content/70 mb-6">
                        You need to log in before you can add a transaction.
                    </p>
                    <Link
                        to="/login"
                        className="btn bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-none"
                    >
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-100 px-4 py-8 lg:px-10">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8 flex items-center gap-4">
                    <div>
                        <p className="text-sm uppercase tracking-[0.2em] font-extrabold text-blue-600">
                            Cashnivo
                        </p>
                        <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900">
                            Add Transaction
                        </h1>
                        <p className="text-base-content/70 mt-2">
                            Record a new expense or income and keep your budget up to date.
                        </p>
                    </div>
                </div>

                <div className="card bg-base-200 border border-base-content/10 shadow-sm p-6">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div>
                            <label className="block text-sm font-medium text-base-content/70 mb-3">
                                Transaction Type
                            </label>
                            <div className="flex rounded-2xl border border-base-300 bg-base-100 p-1">
                                <button
                                    type="button"
                                    onClick={() => handleTypeChange('expense')}
                                    className={`flex-1 py-3 text-sm font-semibold rounded-xl transition ${
                                        formData.type === 'expense'
                                            ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-sm'
                                            : 'text-base-content/70 hover:text-base-content'
                                    }`}
                                >
                                    Expense
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleTypeChange('income')}
                                    className={`flex-1 py-3 text-sm font-semibold rounded-xl transition ${
                                        formData.type === 'income'
                                            ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-sm'
                                            : 'text-base-content/70 hover:text-base-content'
                                    }`}
                                >
                                    Income
                                </button>
                            </div>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <label className="flex flex-col gap-2">
                                <span className="font-semibold text-base-content">Amount</span>
                                <input
                                    type="number"
                                    name="amount"
                                    step="0.01"
                                    min="0"
                                    value={formData.amount}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    className="input input-bordered w-full bg-base-100 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                    required
                                />
                            </label>

                            <label className="flex flex-col gap-2">
                                <span className="font-semibold text-base-content">Date</span>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    className="input input-bordered w-full bg-base-100 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                    required
                                />
                            </label>
                        </div>

                        <label className="flex flex-col gap-2">
                            <span className="font-semibold text-base-content">Category</span>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="select select-bordered w-full bg-base-100 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                disabled={loadingCategories || categoryOptions.length === 0}
                                required
                            >
                                {loadingCategories ? (
                                    <option>Loading categories...</option>
                                ) : categoryOptions.length === 0 ? (
                                    <option>No categories available</option>
                                ) : (
                                    categoryOptions.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat}
                                        </option>
                                    ))
                                )}
                            </select>
                        </label>

                        <label className="flex flex-col gap-2">
                            <span className="font-semibold text-base-content">Description</span>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="4"
                                placeholder="Optional notes for this transaction"
                                className="textarea textarea-bordered w-full bg-base-100 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                            />
                        </label>

                        <div className="pt-4 border-t border-base-300/50 flex flex-col gap-3 sm:flex-row sm:justify-end">
                            <Link
                                to="/dashboard/dashboardhome"
                                className="btn btn-outline w-full sm:w-auto"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                className="btn w-full sm:w-auto bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-none"
                            >
                                <Save size={16} className="mr-2" />
                                Save Transaction
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddTransaction;