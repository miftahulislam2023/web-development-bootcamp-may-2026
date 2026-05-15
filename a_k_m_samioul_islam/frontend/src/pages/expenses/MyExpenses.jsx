import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../providers/AuthProvider/AuthProvider";
import axiosSecure from "../../utils/axios/axioshelper";
import { Search } from "lucide-react";
import { IoMdCreate } from "react-icons/io";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Pagination from "@mui/material/Pagination";
import CardSkeleton from "../../components/cardSkeleton/CardSkeleton";

// Expense validation schema

const createExpenseSchema = z.object({
	title: z.string().min(1, "Title is required"),
	amount: z
		.number({ error: "Amount is required" })
		.positive("Amount must be greater than 0"),
	category: z.enum(
		["Food", "Transport", "Shopping", "Bills", "Health", "Rent", "Others"],
		{
			error: "Category is required",
		},
	),
	note: z.string().optional(),
});

const MyExpenses = () => {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
	} = useForm({
		resolver: zodResolver(createExpenseSchema),
		defaultValues: {
			title: "",
			amount: "",
			category: "Others",
			note: "",
		},
	});

	const { userData } = useContext(AuthContext);

	const [expenses, setExpenses] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const limit = 10;

	useEffect(() => {
		const fetchExpenses = async () => {
			setLoading(true);
			try {
				const res = await axiosSecure.get("/expenses", {
					params: {
						page,
						limit,
						...(searchTerm && { search: searchTerm }),
					},
				});

				setExpenses(res.data.data);
				setTotalPages(res.data.totalPages || 1);
			} catch (error) {
				console.log(error.message);
			} finally {
				setLoading(false);
			}
		};

		if (userData?.email) fetchExpenses();
	}, [userData?.email, page, searchTerm]);

	// Add expense related

	const expenseCreateModalRef = useRef();

	const openExpenseCreateModal = () => {
		expenseCreateModalRef.current?.showModal();
	};

	const closeExpenseCreateModal = () => {
		expenseCreateModalRef.current?.close();
	};

	const handleCreateExpense = async (data) => {
		try {
			const res = await axiosSecure.post("/expenses", data);

			reset();
			closeExpenseCreateModal();
			toast.success("Expense added successfully");

			setExpenses((prev) => [res.data.data, ...prev]);
		} catch (error) {
			console.log(error.message);
			toast.error("Expense add failed");
		}
	};

	// Deletion related

	const deleteExpenseModalRef = useRef();
	const [selectedExpenseId, setSelectedExpenseId] = useState(null);

	const openDeleteExpenseModal = (id) => {
		setSelectedExpenseId(id);

		deleteExpenseModalRef.current?.showModal();
	};

	const closeDeleteExpenseModal = () => {
		deleteExpenseModalRef.current?.close();
	};

	const handleDeleteExpense = async () => {
		setLoading(true);
		try {
			await axiosSecure.delete(`/expenses/${selectedExpenseId}`);

			setExpenses((prev) =>
				prev.filter((expense) => expense._id !== selectedExpenseId),
			);

			closeDeleteExpenseModal();

			toast.success("Expense deleted successfully");
		} catch (error) {
			console.log(error.message);

			toast.error("Expense delete failed");
		} finally {
			setLoading(false);
		}
	};

	// Edit related

	const expenseEditModalRef = useRef();
	const [selectedExpense, setSelectedExpense] = useState(null);

	const {
		register: editRegister,
		handleSubmit: handleEditSubmit,
		formState: { errors: editErrors, isSubmitting: isEditSubmitting },
		reset: editReset,
	} = useForm({
		defaultValues: {
			amount: "",
			note: "",
		},
	});

	const openExpenseEditModal = (expense) => {
		setSelectedExpense(expense);

		editReset({
			amount: expense.amount,
			note: expense.note || "",
		});

		expenseEditModalRef.current?.showModal();
	};

	const closeExpenseEditModal = () => {
		expenseEditModalRef.current?.close();
	};

	const handleUpdateExpense = async (data) => {
		if (
			data.amount === selectedExpense.amount &&
			(data.note || "") === (selectedExpense.note || "")
		) {
			closeExpenseEditModal();
			toast.error("No changes detected");
			return;
		}

		try {
			const res = await axiosSecure.patch(
				`/expenses/${selectedExpense._id}`,
				data,
			);

			setExpenses((prev) =>
				prev.map((expense) =>
					expense._id === selectedExpense._id
						? res.data.data
						: expense,
				),
			);

			closeExpenseEditModal();

			toast.success("Expense updated successfully");
		} catch (error) {
			console.log(error.message);

			toast.error("Expense update failed");
		}
	};

	// console.log(expenses);

	return (
		<div className="w-full flex flex-col inter">
			{/* Heading */}

			<div className="flex flex-col items-start gap-2 mb-10">
				<p className="text-4xl font-bold lobster">My Expenses</p>
				<p className="text-sm font-medium text-gray-400">
					Stay in control of your spending with organized expense
					tracking
				</p>
			</div>

			{/* Add button and search bar */}

			<div className="w-full flex justify-between items-center gap-5 mb-10">
				<div className="w-full flex flex-2 items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-black transition-all">
					<Search className="w-4 h-4 text-gray-400" />
					<input
						type="text"
						value={searchTerm}
						onChange={(e) => {
							setSearchTerm(e.target.value);
							setPage(1);
						}}
						placeholder="Search expense"
						className="w-full outline-none text-sm text-gray-700 placeholder-gray-400"
					/>
				</div>
				<button
					className="px-5 py-1 flex gap-2 rounded-lg justify-center font-sm cursor-pointer text-lg items-center bg-black text-white border-white hover:bg-white hover:text-black hover:border-black border transition-colors duration-500"
					onClick={openExpenseCreateModal}
				>
					<IoMdCreate /> Add
				</button>
			</div>

			{/* Expenses */}

			<div className="w-full flex flex-col gap-2">
				{loading ? (
					Array.from({ length: 3 }).map((_, i) => (
						<CardSkeleton key={i} variant="income-expense" />
					))
				) : expenses.length === 0 ? (
					<div className="w-full h-50 flex justify-center items-center rounded-lg p-5 shadow-lg">
						<p className="text-md text-black text-center">
							No expense found
						</p>
					</div>
				) : (
					expenses.map((expense) => (
						<div className="w-full rounded-lg border border-gray-100 bg-white p-5 shadow-lg transition-all duration-300 hover:-translate-y-1">
							<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
								<div className="flex flex-col gap-2">
									<div>
										<p className="text-lg font-bold text-black">
											{expense.title}
										</p>
										<p className="text-sm font-medium text-gray-400">
											{expense.category}
										</p>
									</div>

									<p className="text-3xl font-bold text-red-600">
										{expense.amount}{" "}
										{userData?.currency.toUpperCase()}
									</p>
								</div>

								<div className="flex gap-2">
									<button
										type="button"
										className="btn btn-sm bg-black text-white border-white hover:bg-white hover:text-black hover:border-black border transition-colors duration-500"
										onClick={() =>
											openExpenseEditModal(expense)
										}
									>
										Edit
									</button>

									<button
										type="button"
										className="btn btn-sm bg-red-500 text-white border-red-500 hover:bg-white hover:text-red-500 transition-colors duration-500"
										onClick={() =>
											openDeleteExpenseModal(expense._id)
										}
									>
										Delete
									</button>
								</div>
							</div>
						</div>
					))
				)}
			</div>

			{/* Pagination */}

			{totalPages >= 1 && (
				<div className="mt-6 flex w-full justify-center">
					<Pagination
						count={totalPages}
						page={page}
						shape="rounded"
						onChange={(event, value) => setPage(value)}
					/>
				</div>
			)}

			{/* Add expense Modal*/}

			<dialog
				ref={expenseCreateModalRef}
				className="modal modal-bottom sm:modal-middle inter"
			>
				<div className="modal-box max-w-xl p-6">
					<div className="flex items-center justify-between mb-4">
						<p className="text-xl font-bold">Add Expense</p>

						<button
							type="button"
							className="btn btn-sm btn-circle btn-ghost"
							onClick={closeExpenseCreateModal}
						>
							✕
						</button>
					</div>

					<form
						onSubmit={handleSubmit(handleCreateExpense)}
						className="flex flex-col gap-4"
					>
						<div className="flex flex-col gap-1">
							<label className="text-sm font-semibold text-gray-700">
								Title
							</label>
							<input
								type="text"
								className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-black"
								placeholder="Electricity Bill"
								{...register("title")}
							/>
							{errors.title && (
								<p className="text-sm text-red-600">
									{errors.title?.message}
								</p>
							)}
						</div>

						<div className="flex flex-col gap-1">
							<label className="text-sm font-semibold text-gray-700">
								Amount
							</label>
							<input
								type="number"
								className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-black"
								step="0.01"
								placeholder="5000"
								{...register("amount", { valueAsNumber: true })}
							/>
							{errors.amount && (
								<p className="text-sm text-red-600">
									{errors.amount?.message}
								</p>
							)}
						</div>

						<div className="flex flex-col gap-1">
							<label className="text-sm font-semibold text-gray-700">
								Category
							</label>
							<select
								className="select select-bordered w-full focus:outline-none focus:ring-2 focus:ring-black"
								{...register("category")}
							>
								<option value="Food">Food</option>
								<option value="Transport">Transport</option>
								<option value="Shopping">Shopping</option>
								<option value="Bills">Bills</option>
								<option value="Health">Health</option>
								<option value="Rent">Rent</option>
								<option value="Others">Others</option>
							</select>
							{errors.category && (
								<p className="text-sm text-red-600">
									{errors.category?.message}
								</p>
							)}
						</div>

						<div className="flex flex-col gap-1">
							<label className="text-sm font-semibold text-gray-700">
								Note
							</label>
							<textarea
								className="textarea textarea-bordered w-full focus:outline-none focus:ring-2 focus:ring-black resize-none"
								placeholder="Optional note"
								rows={3}
								{...register("note")}
							></textarea>
							{errors.note && (
								<p className="text-sm text-red-600">
									{errors.note?.message}
								</p>
							)}
						</div>

						<div className="flex justify-end gap-2">
							<button
								onClick={closeExpenseCreateModal}
								type="button"
								className="btn btn-soft"
							>
								Cancel
							</button>

							<button
								type="submit"
								className="w-28 btn bg-black text-white border-white hover:bg-white hover:text-black hover:border-black border transition-colors duration-500"
								disabled={isSubmitting}
							>
								{isSubmitting ? (
									<span className="loading loading-dots loading-md"></span>
								) : (
									"Add"
								)}
							</button>
						</div>
					</form>
				</div>
			</dialog>

			{/* Delete Modal */}

			<dialog
				ref={deleteExpenseModalRef}
				className="modal modal-bottom sm:modal-middle inter"
			>
				<div className="modal-box max-w-md p-6">
					<div className="flex items-center justify-between mb-4">
						<p className="text-xl font-bold">Delete Expense</p>

						<button
							type="button"
							className="btn btn-sm btn-circle btn-ghost"
							onClick={closeDeleteExpenseModal}
						>
							✕
						</button>
					</div>

					<div className="flex flex-col gap-6">
						<p className="text-sm text-gray-500">
							Are you sure you want to delete this expense? This
							action cannot be undone.
						</p>

						<div className="flex justify-end gap-2">
							<button
								type="button"
								className="btn btn-soft"
								onClick={closeDeleteExpenseModal}
							>
								Cancel
							</button>

							<button
								type="button"
								onClick={handleDeleteExpense}
								className="btn bg-red-500 text-white border-red-500 hover:bg-white hover:text-red-500 transition-colors duration-500"
								disabled={loading}
							>
								{loading ? (
									<span className="loading loading-dots loading-md"></span>
								) : (
									"Delete"
								)}
							</button>
						</div>
					</div>
				</div>
			</dialog>

			{/* Edit Modal */}

			<dialog
				ref={expenseEditModalRef}
				className="modal modal-bottom sm:modal-middle inter"
			>
				<div className="modal-box max-w-xl p-6">
					<div className="flex items-center justify-between mb-4">
						<p className="text-xl font-bold">Edit Expense</p>

						<button
							type="button"
							className="btn btn-sm btn-circle btn-ghost"
							onClick={closeExpenseEditModal}
						>
							✕
						</button>
					</div>

					<form
						onSubmit={handleEditSubmit(handleUpdateExpense)}
						className="flex flex-col gap-4"
					>
						<div className="flex flex-col gap-1">
							<label className="text-sm font-semibold text-gray-700">
								Amount
							</label>

							<input
								type="number"
								step="0.01"
								className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-black"
								placeholder="5000"
								{...editRegister("amount", {
									valueAsNumber: true,
								})}
							/>
						</div>

						<div className="flex flex-col gap-1">
							<label className="text-sm font-semibold text-gray-700">
								Note
							</label>

							<textarea
								rows={3}
								className="textarea textarea-bordered w-full focus:outline-none focus:ring-2 focus:ring-black resize-none"
								placeholder="Optional note"
								{...editRegister("note")}
							></textarea>
						</div>

						<div className="flex justify-end gap-2">
							<button
								type="button"
								className="btn btn-soft"
								onClick={closeExpenseEditModal}
							>
								Cancel
							</button>

							<button
								type="submit"
								className="w-28 btn bg-black text-white border-white hover:bg-white hover:text-black hover:border-black border transition-colors duration-500"
								disabled={isEditSubmitting}
							>
								{isEditSubmitting ? (
									<span className="loading loading-dots loading-md"></span>
								) : (
									"Update"
								)}
							</button>
						</div>
					</form>
				</div>
			</dialog>
		</div>
	);
};

export default MyExpenses;
