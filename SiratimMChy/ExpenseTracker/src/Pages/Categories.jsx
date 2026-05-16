import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AuthContext } from '../Provider/AuthProvider';
import { FiTrash2 } from 'react-icons/fi';
import { FaRegEdit } from 'react-icons/fa';

const Categories = () => {
    const { user } = useContext(AuthContext);

    const [expenseCategories, setExpenseCategories] = useState([]);
    const [incomeCategories, setIncomeCategories] = useState([]);
    const [categoryName, setCategoryName] = useState('');
    const [activeTab, setActiveTab] = useState('expense');
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState('');
    const [showAllDefaults, setShowAllDefaults] = useState({ expense: false, income: false });

    const DEFAULT_PREVIEW_COUNT = 3;

    useEffect(() => {
        const queryEmail = user?.email ? `&email=${user.email}` : '';
        const fetchExpense = axios.get(`http://localhost:5000/categories?type=expense${queryEmail}`);
        const fetchIncome = axios.get(`http://localhost:5000/categories?type=income${queryEmail}`);

        Promise.all([fetchExpense, fetchIncome])
            .then(([expenseRes, incomeRes]) => {
                setExpenseCategories(expenseRes.data);
                setIncomeCategories(incomeRes.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });

    }, [user?.email]);

    const currentCategories = activeTab === 'expense' ? expenseCategories : incomeCategories;
    const setCurrentCategories = activeTab === 'expense' ? setExpenseCategories : setIncomeCategories;

    const defaultCategories = currentCategories.filter(c => c.isDefault);
    const userCategories = currentCategories.filter(c => !c.isDefault);

    const visibleDefaults = showAllDefaults[activeTab]
        ? defaultCategories
        : defaultCategories.slice(0, DEFAULT_PREVIEW_COUNT);

    const handleAddCategory = (e) => {
        e.preventDefault();

        if (!user?.email) {
            toast.error('Login first to add categories');
            return;
        }

        const name = categoryName.trim();
        if (!name) return;

        const exists = currentCategories.find(c => c.name.toLowerCase() === name.toLowerCase());
        if (exists) {
            toast.error('Category already exists!');
            setCategoryName('');
            return;
        }

        const newCategory = {
            name,
            type: activeTab,
            email: user.email,
            createdAt: new Date(),
            isDefault: false
        };

        axios.post('http://localhost:5000/categories', newCategory)
            .then(res => {
                setCurrentCategories(prev => [
                    ...prev,
                    { ...newCategory, _id: res.data.insertedId }
                ]);
                toast.success('Category added successfully!');
                setCategoryName('');
            })
            .catch(err => {
                console.error(err);
                toast.error('Failed to add category');
            });
    };

    const handleEditCategory = (item) => {
        setEditingId(item._id);
        setEditName(item.name);
    };

    const handleSaveEdit = (id) => {
        const name = editName.trim();
        if (!name) return;

        axios.put(`http://localhost:5000/categories/${id}`, { name })
            .then(() => {
                setCurrentCategories(prev =>
                    prev.map(c => c._id === id ? { ...c, name } : c)
                );
                toast.success('Category updated successfully!');
                setEditingId(null);
                setEditName('');
            })
            .catch(err => {
                console.error(err);
                toast.error('Failed to update category');
            });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditName('');
    };

    const handleRemoveCategory = (item) => {
        axios.delete(`http://localhost:5000/categories/${item._id}`)
            .then(() => {
                setCurrentCategories(prev => prev.filter(c => c._id !== item._id));
                toast.success('Category deleted successfully!');
            })
            .catch(err => {
                console.error(err);
                toast.error('Failed to delete category');
            });
    };

    const handleTabSwitch = (tab) => {
        setActiveTab(tab);
        setEditingId(null);
        setEditName('');
        setCategoryName('');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-100 px-4 py-8 lg:px-10">
            <div className="max-w-7xl mx-auto">

                {/* HEADER */}
                <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="text-sm uppercase tracking-[0.2em] font-extrabold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                            Cashnivo
                        </p>
                        <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900">
                            Manage Categories
                        </h1>
                        <p className="mt-2 text-base-content/70 max-w-2xl">
                            Add, edit, and delete categories so your expense tracker stays organised.
                        </p>
                    </div>
                </div>

                {/* TABS */}
                <div className="flex gap-2 mb-6">
                    <button
                        onClick={() => handleTabSwitch('expense')}
                        className={`px-5 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${activeTab === 'expense'
                            ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-transparent shadow'
                            : 'bg-base-200 text-base-content/70 border-base-content/10 hover:border-blue-400'
                            }`}
                    >
                        Expense
                    </button>
                    <button
                        onClick={() => handleTabSwitch('income')}
                        className={`px-5 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${activeTab === 'income'
                            ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-transparent shadow'
                            : 'bg-base-200 text-base-content/70 border-base-content/10 hover:border-blue-400'
                            }`}
                    >
                        Income
                    </button>
                </div>

                <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">

                    {/* ADD FORM */}
                    <div className="card bg-base-200 border border-base-content/10 shadow-sm p-6">
                        <h2 className="text-xl font-semibold mb-1">Add new category</h2>
                        <p className="text-sm text-base-content/60 mb-4">
                            Adding to <span className="font-medium capitalize text-base-content/80">{activeTab}</span> categories
                        </p>
                        <form onSubmit={handleAddCategory} className="flex flex-col gap-4">
                            <input
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                                placeholder={activeTab === 'expense' ? 'Example: Groceries' : 'Example: Freelance'}
                                className="input input-bordered w-full bg-base-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                                disabled={!user}
                            />
                            <button
                                type="submit"
                                disabled={!user}
                                className={`btn bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-none hover:scale-[1.01] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 ${!user ? 'opacity-60 cursor-not-allowed' : ''}`}
                            >
                                Add Category
                            </button>
                            {!user && (
                                <p className="text-xs text-base-content/50">
                                    Login to add custom categories.
                                </p>
                            )}
                        </form>
                    </div>

                    {/* CATEGORY LIST */}
                    <div className="card bg-base-200 border border-base-content/10 shadow-sm p-6">
                        <div className="mb-4">
                            <h2 className="text-xl font-semibold capitalize">{activeTab} categories</h2>
                            <p className="text-sm text-base-content/70">
                                Edit or remove any category you no longer need.
                            </p>
                        </div>

                        {/* SYSTEM DEFAULTS */}
                        <div className="mb-4">
                            <p className="text-xs uppercase tracking-widest text-base-content/40 font-bold mb-2">
                                System defaults
                            </p>
                            <div className="space-y-2">
                                {visibleDefaults.map((item) => (
                                    <div
                                        key={item._id}
                                        className="flex items-center justify-between gap-3 rounded-2xl border border-base-content/10 bg-base-100 px-4 py-3"
                                    >
                                        <div>
                                            <span className="font-medium">{item.name}</span>
                                            <p className="text-xs text-gray-400">System category</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {defaultCategories.length > DEFAULT_PREVIEW_COUNT && (
                                <button
                                    onClick={() =>
                                        setShowAllDefaults(prev => ({
                                            ...prev,
                                            [activeTab]: !prev[activeTab]
                                        }))
                                    }
                                    className="mt-2 text-xs text-blue-500 hover:text-blue-700 transition-colors"
                                >
                                    {showAllDefaults[activeTab]
                                        ? 'Show less'
                                        : `+ ${defaultCategories.length - DEFAULT_PREVIEW_COUNT} more system categories`}
                                </button>
                            )}
                        </div>

                        {/* USER CATEGORIES */}
                        {userCategories.length > 0 && (
                            <div>
                                <p className="text-xs uppercase tracking-widest text-base-content/40 font-bold mb-2">
                                    Your categories
                                </p>
                                <div className="space-y-2">
                                    {userCategories.map((item) => (
                                        <div
                                            key={item._id}
                                            className="flex items-center justify-between gap-3 rounded-2xl border border-base-content/10 bg-base-100 px-4 py-3"
                                        >
                                            {editingId === item._id ? (
                                                <div className="flex items-center gap-2 flex-1">
                                                    <input
                                                        value={editName}
                                                        onChange={(e) => setEditName(e.target.value)}
                                                        className="input input-bordered flex-1 bg-base-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                                    />
                                                    <button
                                                        onClick={() => handleSaveEdit(item._id)}
                                                        className="btn btn-sm bg-green-600 border-none hover:bg-green-800 text-white"
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        onClick={handleCancelEdit}
                                                        className="btn btn-sm bg-red-600 border-none hover:bg-red-800 text-white"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            ) : (
                                                <>
                                                    <span className="font-medium">{item.name}</span>
                                                    <div className="flex gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleEditCategory(item)}
                                                            className="btn btn-sm bg-blue-600 text-black hover:bg-blue-50"
                                                        >
                                                            <FaRegEdit className="h-5 w-5" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveCategory(item)}
                                                            className="btn btn-sm bg-red-500 text-black-600 hover:bg-red-50"
                                                        >
                                                            <FiTrash2 className="h-5 w-5" />
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {userCategories.length === 0 && (
                            <p className="text-sm text-base-content/40 text-center py-4">
                                No custom {activeTab} categories yet.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Categories;