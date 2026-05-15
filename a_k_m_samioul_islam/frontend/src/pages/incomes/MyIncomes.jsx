import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../providers/AuthProvider/AuthProvider";
import axiosSecure from "../../utils/axios/axioshelper";
import { Search } from "lucide-react";
import { IoMdCreate } from "react-icons/io";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

// Income validation schema

const createIncomeSchema = z.object({
	title: z.string().min(1, "Title is required"),
	amount: z
		.number({ error: "Amount is required" })
		.positive("Amount must be greater than 0"),
	source: z.enum(["Salary", "Freelance", "Business", "Gift", "Others"], {
		error: "Source is required",
	}),
	note: z.string().optional(),
});

const MyIncomes = () => {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
	} = useForm({
		resolver: zodResolver(createIncomeSchema),
		defaultValues: {
			title: "",
			amount: "",
			source: "Others",
			note: "",
		},
	});
	const { userData } = useContext(AuthContext);

	const [incomes, setIncomes] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");

	useEffect(() => {
		const fetchIncomes = async () => {
			setLoading(true);
			try {
				const res = await axiosSecure.get("/incomes");

				setIncomes(res.data.data);
			} catch (error) {
				console.log(error.message);
			} finally {
				setLoading(false);
			}

			if (userData?.email) fetchIncomes();
		};
	}, [userData?.email]);

	// Add income related

	const incomeCreateModalRef = useRef();

	const openIncomeCreateModal = () => {
		incomeCreateModalRef.current?.showModal();
	};

	const closeIncomeCreateModal = () => {
		incomeCreateModalRef.current?.close();
	};

	const handleCreateIncome = async (data) => {
		try {
			const res = await axiosSecure.post("/incomes", data);

			reset();
			closeIncomeCreateModal();
			toast.success("Income added successfully");

			setIncomes((prev) => [res.data.data, ...prev]);
		} catch (error) {
			console.log(error.message);
			toast.error("Income add failed");
		}
	};

	console.log(incomes);

	return (
		<div className="w-full flex flex-col inter">
			<div className="flex flex-col items-start gap-2 mb-10">
				<p className="text-4xl font-bold lobster">My Incomes</p>
				<p className="text-sm font-medium text-gray-400">
					Manage your income records and stay updated on your earnings
				</p>
			</div>

			<div className="w-full flex justify-between items-center gap-5">
				<div className="w-full flex flex-2 items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-black transition-all">
					<Search className="w-4 h-4 text-gray-400" />
					<input
						type="text"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						placeholder="Search"
						className="w-full outline-none text-sm text-gray-700 placeholder-gray-400"
					/>
				</div>
				<button
					className="px-5 py-1 flex gap-2 rounded-lg justify-center font-sm cursor-pointer text-lg items-center bg-black text-white border-white hover:bg-white hover:text-black hover:border-black border transition-colors duration-500"
					onClick={openIncomeCreateModal}
				>
					<IoMdCreate /> Add
				</button>
			</div>

			<div className="w-full flex flex-col gap-2">
				{incomes.map((income) => (
					<div className="w-full rounded-lg border border-gray-100 bg-white p-5 shadow-lg transition-all duration-300 hover:-translate-y-1">
						<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
							<div className="flex flex-col gap-2">
								<div>
									<p className="text-lg font-bold text-black">
										{income.title}
									</p>
									<p className="text-sm font-medium text-gray-400">
										{income.source}
									</p>
								</div>

								<p className="text-3xl font-bold text-emerald-600">
									{income.amount}
								</p>
							</div>

							<div className="flex gap-2">
								<button
									type="button"
									className="btn btn-sm bg-black text-white border-white hover:bg-white hover:text-black hover:border-black border transition-colors duration-500"
								>
									Edit
								</button>

								<button
									type="button"
									className="btn btn-sm bg-red-500 text-white border-red-500 hover:bg-white hover:text-red-500 transition-colors duration-500"
								>
									Delete
								</button>
							</div>
						</div>
					</div>
				))}
			</div>

			{/* Add income */}

			<dialog
				ref={incomeCreateModalRef}
				className="modal modal-bottom sm:modal-middle"
			>
				<div className="modal-box max-w-xl p-6">
					<div className="flex items-center justify-between mb-4">
						<p className="text-xl font-bold graphik">Add Income</p>

						<button
							type="button"
							className="btn btn-sm btn-circle btn-ghost"
							onClick={closeIncomeCreateModal}
						>
							✕
						</button>
					</div>

					<form
						onSubmit={handleSubmit(handleCreateIncome)}
						className="flex flex-col gap-4"
					>
						<div className="flex flex-col gap-1">
							<label className="text-sm font-semibold text-gray-700">
								Title
							</label>
							<input
								type="text"
								className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-black"
								placeholder="Monthly salary"
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
								Source
							</label>
							<select
								className="select select-bordered w-full focus:outline-none focus:ring-2 focus:ring-black"
								{...register("source")}
							>
								<option value="Salary">Salary</option>
								<option value="Freelance">Freelance</option>
								<option value="Business">Business</option>
								<option value="Gift">Gift</option>
								<option value="Others">Others</option>
							</select>
							{errors.source && (
								<p className="text-sm text-red-600">
									{errors.source?.message}
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
								onClick={closeIncomeCreateModal}
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
		</div>
	);
};

export default MyIncomes;
