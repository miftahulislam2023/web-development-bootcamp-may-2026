import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../providers/AuthProvider/AuthProvider";
import axiosSecure from "../../utils/axios/axioshelper.js";
import { toast } from "sonner";
import CardSkeleton from "../../components/cardSkeleton/CardSkeleton";
import { GrMoney } from "react-icons/gr";
import { TbCreditCardPay, TbCreditCardRefund } from "react-icons/tb";
import { GiPodiumWinner } from "react-icons/gi";
import { TiTick } from "react-icons/ti";
import { AiOutlineStop } from "react-icons/ai";
import { GrDocumentPerformance } from "react-icons/gr";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	formatCurrency,
	formatDate,
} from "../../utils/formatting/formatting.js";
import {
	BarChart,
	Bar,
	PieChart,
	Pie,
	Cell,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	Legend,
	CartesianGrid,
} from "recharts";

// Form validation

const createBudgetSchema = z
	.object({
		amount: z
			.number({ error: "Amount is required" })
			.positive("Amount must be greater than 0"),
		startDate: z.string().min(1, "Start date is required"),
		endDate: z.string().min(1, "End date is required"),
	})
	.refine(
		(data) => {
			const start = new Date(data.startDate);

			const today = new Date();
			today.setHours(0, 0, 0, 0);

			return start >= today;
		},
		{
			message: "Start date cannot be earlier than today",
			path: ["startDate"],
		},
	)
	.refine((data) => new Date(data.startDate) < new Date(data.endDate), {
		message: "Start date must be before end date",
		path: ["endDate"],
	});

const MyActivity = () => {
	const { userData } = useContext(AuthContext);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
	} = useForm({
		resolver: zodResolver(createBudgetSchema),
		defaultValues: {
			amount: "",
			startDate: new Date().toISOString().split("T")[0],
			endDate: "",
		},
	});

	const [loading, setLoading] = useState(true);
	const [summary, setSummary] = useState({});
	const [summaryExpenses, setSummaryExpenses] = useState({});
	const [currentBudget, setCurrentBudget] = useState(null);
	const [budgetHistory, setBudgetHistory] = useState({});
	const [transactions, setTransactions] = useState({});

	const [aiLoading, setAiLoading] = useState(true);
	const [aiData, setAiData] = useState({});

	// Budget set related

	const budgetSetModalRef = useRef();

	const openBudgetSetModal = () => {
		budgetSetModalRef.current?.showModal();
	};

	const closeBudgetSetModal = () => {
		budgetSetModalRef.current?.close();
	};

	// Current budget fetch

	const budgetFetch = async () => {
		try {
			const res = await axiosSecure.get("/budget");

			setCurrentBudget(res.data.data);
		} catch (error) {
			// console.log(error.message);
		}
	};

	// Budget history fetch function

	const budgetHistoryFetch = async () => {
		try {
			const res = await axiosSecure.get("/budget/summary");

			setBudgetHistory(res.data.data);
		} catch (error) {
			// console.log(error.message);
		}
	};

	// Load budget information

	useEffect(() => {
		const loadBudgetData = async () => {
			setLoading(true);
			try {
				await Promise.all([budgetFetch(), budgetHistoryFetch()]);
			} catch (error) {
				// console.log(error.message);
			} finally {
				setLoading(false);
			}
		};

		if (userData?.email) loadBudgetData();
	}, [userData?.email]);

	// Budget set function

	const handleSetBudget = async (data) => {
		try {
			await axiosSecure.post("/budget", data);

			await budgetFetch();
			await budgetHistoryFetch();

			reset();
			closeBudgetSetModal();
			toast.success("Budget set successfully");
		} catch (error) {
			// console.log(error.message);
		}
	};

	// Summary data fetch

	useEffect(() => {
		// Summary fetch function

		const fetchSummary = async () => {
			setLoading(true);
			try {
				const res = await axiosSecure.get("/summary");
				setSummary(res.data.data);
			} catch (error) {
				// toast.error("Summary fetch failed");
				// console.log(error.message);
			} finally {
				setLoading(false);
			}
		};

		// Last 7 days categorical expenses

		const fetchSummaryExpenses = async () => {
			setLoading(true);
			try {
				const res = await axiosSecure.get("/summary/expenses");

				setSummaryExpenses(res.data.data);
			} catch (error) {
				// console.log(error.message);
			} finally {
				setLoading(false);
			}
		};

		// Last 7 days incomes vs expenses

		const fetchSummaryTransactions = async () => {
			setLoading(true);
			try {
				const res = await axiosSecure.get("/summary/transactions");

				setTransactions(res.data.data);
			} catch (error) {
				// console.log(error.message);
			} finally {
				setLoading(false);
			}
		};

		if (userData?.email) {
			fetchSummary();
			fetchSummaryExpenses();
			fetchSummaryTransactions();
		}
	}, [userData?.email]);

	// AI insights data fetch

	useEffect(() => {
		// AI insights fetch function

		const fetchAiInsight = async () => {
			setAiLoading(true);
			try {
				const res = await axiosSecure.get("/ai");
				setAiData(res.data.data);
			} catch (error) {
				// console.log(error.message);
			} finally {
				setAiLoading(false);
			}
		};

		if (userData?.email) fetchAiInsight();
	}, [userData?.email]);

	// Stats card infos

	const stats = [
		{
			title: "Net Balance",
			info: summary.netBalance,
			logo: GrMoney,
			iconBg: "bg-orange-100",
			icon: "text-orange-700",
		},
		{
			title: "Monthly Incomes",
			info: summary.totalMonthlyIncome,
			logo: TbCreditCardRefund,
			iconBg: "bg-blue-100",
			icon: "text-blue-700",
		},
		{
			title: "Monthly Expenses",
			info: summary.totalMonthlyExpense,
			logo: TbCreditCardPay,
			iconBg: "bg-green-100",
			icon: "text-green-700",
		},
	];

	// Budget History stats

	const budgetHistoryStats = [
		{
			title: "Total Completed Budgets",
			info: budgetHistory.totalCompletedBudgets,
			logo: GiPodiumWinner,
			iconBg: "bg-orange-100",
			icon: "text-orange-700",
		},
		{
			title: "Fulfilled Count",
			info: budgetHistory.fulfilledCount,
			logo: TiTick,
			iconBg: "bg-blue-100",
			icon: "text-blue-700",
		},
		{
			title: "Overspent Count",
			info: budgetHistory.overspentCount,
			logo: AiOutlineStop,
			iconBg: "bg-green-100",
			icon: "text-green-700",
		},
		{
			title: "Best Performance",
			info: budgetHistory.bestPerformance
				? budgetHistory.bestPerformance
				: "None",
			logo: GrDocumentPerformance,
			iconBg: "bg-yellow-100",
			icon: "text-yellow-700",
		},
	];

	const spentPercentage = currentBudget?.amount
		? Math.min(
				(Number(currentBudget.spentAmount || 0) /
					Number(currentBudget.amount)) *
					100,
				100,
			)
		: 0;

	const budgetStatusClass =
		currentBudget?.status === "active"
			? "bg-emerald-100 text-emerald-700"
			: currentBudget?.status === "exceeded"
				? "bg-red-100 text-red-700"
				: "bg-gray-100 text-gray-700";

	// Charts related data

	const transactionChartData = Object.entries(transactions || {}).map(
		([day, value]) => ({
			day,
			income: value.income || 0,
			expense: value.expense || 0,
		}),
	);

	const categoryExpenseChartData = Object.entries(summaryExpenses || {}).map(
		([category, amount]) => ({
			category,
			amount,
		}),
	);

	const colors = ["#111827", "#ef4444", "#16a34a", "#f59e0b", "#2563eb"];

	// console.log(userData);
	// console.log(currentBudget, budgetHistory);
	// console.log(aiData, transactions);

	return (
		<div className="w-full flex flex-col inter">
			{/* Heading */}

			<div className="flex flex-col items-start gap-2 mb-10">
				<p className="text-4xl font-bold lobster">My Activities</p>
				<p className="text-sm font-medium text-gray-400">
					Track your financial activities and stay in control of your
					budget
				</p>
			</div>

			{/* Stat cards */}

			<div className="w-full max-w-full grid grid-cols-1 lg:grid-cols-3 justify-items-center gap-5 mb-5">
				{loading
					? Array.from({ length: 3 }).map((_, i) => (
							<CardSkeleton key={i} variant="stat" />
						))
					: stats.map((stat) => (
							<div
								key={stat.title}
								className="w-full min-w-0 p-5 rounded-lg shadow-lg flex flex-col gap-2 box-border border border-gray-100 hover:-translate-y-1 transition-all duration-300"
							>
								<div className="flex gap-3 items-center">
									<div
										className={`w-10 h-10 rounded-xl flex justify-center items-center ${stat.iconBg}`}
									>
										<stat.logo
											className={`w-5 h-5 ${stat.icon} shrink-0`}
										/>
									</div>

									<p className="text-gray-500 text-sm font-medium min-w-0 break-words">
										{stat.title}
									</p>
								</div>
								<p className="text-3xl font-bold">
									{stat.info}
								</p>
							</div>
						))}
			</div>

			{/* Charts section */}

			<div className="grid w-full grid-cols-1 gap-5 lg:grid-cols-2 mb-5">
				{loading ? (
					<>
						<CardSkeleton variant="chart" />
						<CardSkeleton variant="chart" />
					</>
				) : (
					<>
						{transactionChartData.length === 0 ? (
							<div className="w-full h-full flex justify-center items-center rounded-lg p-5 shadow-lg">
								<p className="text-md text-black text-center">
									No transaction data found
								</p>
							</div>
						) : (
							<div className="w-full rounded-lg p-5 shadow-lg">
								<p className="mb-5 text-xl font-bold text-black">
									Last 7 Days Transactions
								</p>

								<div className="h-80 w-full">
									<ResponsiveContainer
										width="100%"
										height="100%"
									>
										<BarChart data={transactionChartData}>
											<CartesianGrid
												strokeDasharray="3 3"
												vertical={false}
											/>
											<XAxis dataKey="day" />
											<YAxis />
											<Tooltip />
											<Legend />
											<Bar
												dataKey="income"
												fill="#16a34a"
												radius={[6, 6, 0, 0]}
											/>
											<Bar
												dataKey="expense"
												fill="#ef4444"
												radius={[6, 6, 0, 0]}
											/>
										</BarChart>
									</ResponsiveContainer>
								</div>
							</div>
						)}

						{categoryExpenseChartData.length === 0 ? (
							<div className="w-full h-full flex justify-center items-center rounded-lg p-5 shadow-lg">
								<p className="text-md text-black text-center">
									No expense data found
								</p>
							</div>
						) : (
							<div className="w-full rounded-lg p-5 shadow-lg">
								<p className="mb-5 text-xl font-bold text-black">
									Category Wise Expenses
								</p>

								<div className="h-80 w-full">
									<ResponsiveContainer
										width="100%"
										height="100%"
									>
										<PieChart>
											<Pie
												data={categoryExpenseChartData}
												dataKey="amount"
												nameKey="category"
												cx="50%"
												cy="50%"
												outerRadius={100}
												label
											>
												{categoryExpenseChartData.map(
													(entry, index) => (
														<Cell
															key={entry.category}
															fill={
																colors[
																	index %
																		colors.length
																]
															}
														/>
													),
												)}
											</Pie>

											<Tooltip />
											<Legend />
										</PieChart>
									</ResponsiveContainer>
								</div>
							</div>
						)}
					</>
				)}
			</div>

			{/* AI */}

			<div className="w-full mb-5">
				{aiLoading ? (
					<CardSkeleton variant="ai" />
				) : (
					<div className="collapse collapse-arrow bg-[#f8fafc] border border-[#e2e8f0] hover:border-black transition-all duration-300">
						<input type="checkbox" />

						<div className="collapse-title text-lg font-semibold text-black">
							SEE WHAT AI IS SAYING ABOUT YOUR FINANCIAL ACTIVITIES
						</div>

						<div className="collapse-content text-sm text-gray-700">
							<p className="mb-4">
								{aiData?.aiRecommendation?.insight ||
									"No AI insight available yet."}
							</p>

							{aiData?.aiRecommendation?.recommendations && (
								<div className="flex flex-col gap-2">
									<p className="font-semibold text-black">
										Recommendations
									</p>

									<ul className="list-disc space-y-2 pl-5">
										{aiData?.aiRecommendation?.recommendations.map(
											(recommendation, index) => (
												<li key={index}>
													{recommendation}
												</li>
											),
										)}
									</ul>
								</div>
							)}
						</div>
					</div>
				)}
			</div>

			{/* Budget section */}

			{loading ? (
				<CardSkeleton variant="budget"></CardSkeleton>
			) : (
				<div className="w-full shadow-lg rounded-lg p-5 box-border flex flex-col items-start gap-10 mb-5">
					<div className="w-full">
						{!currentBudget ||
						Object.keys(currentBudget).length === 0 ? (
							<>
								<button
									type="submit"
									className="btn w-50 h-12 rounded-lg font-medium cursor-pointer text-lg bg-black text-white border-white hover:bg-white hover:text-black hover:border-black border transition-colors duration-500"
									onClick={openBudgetSetModal}
								>
									Set Budget
								</button>
							</>
						) : (
							<>
								{/* Current budget */}

								<div className="w-full flex flex-col gap-5">
									<div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
										<div className="flex flex-col gap-2">
											<p className="font-bold text-black text-xl">
												Current Budget
											</p>
											<p className="text-sm text-gray-500">
												{formatDate(
													currentBudget.startDate,
												)}{" "}
												-{" "}
												{formatDate(
													currentBudget.endDate,
												)}
											</p>
										</div>

										<div
											className={`w-fit rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] ${budgetStatusClass}`}
										>
											{currentBudget.status}
										</div>
									</div>

									<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
										<div className="rounded-3xl border-2 border-black bg-black p-5 text-white">
											<p className="text-xs uppercase tracking-[0.2em] text-white/70">
												Budget Amount
											</p>
											<p className="mt-3 text-3xl font-bold">
												{formatCurrency(currentBudget.amount, userData?.currency)}
											</p>
										</div>

										<div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
											<p className="text-xs uppercase tracking-[0.2em] text-gray-500">
												Spent
											</p>
											<p className="mt-3 text-3xl font-bold text-red-500">
												{formatCurrency(currentBudget.spentAmount, userData?.currency)}
											</p>
										</div>

										<div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
											<p className="text-xs uppercase tracking-[0.2em] text-gray-500">
												Remaining
											</p>
											<p className="mt-3 text-3xl font-bold text-emerald-600">
												{formatCurrency(currentBudget.remainingAmount, userData?.currency)}
											</p>
										</div>
									</div>

									<div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
										<div className="mb-4 flex items-center justify-between gap-3">
											<p className="text-sm font-semibold text-gray-700">
												Budget usage
											</p>
											<p className="text-sm font-bold text-black">
												{spentPercentage.toFixed(0)}%
											</p>
										</div>

										<div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
											<div
												className={`h-full rounded-full transition-all duration-500 ${
													spentPercentage >= 100
														? "bg-red-500"
														: "bg-black"
												}`}
												style={{
													width: `${spentPercentage}%`,
												}}
											/>
										</div>

										<div className="mt-4 flex flex-col gap-2 text-sm text-gray-600 md:flex-row md:items-center md:justify-between">
											<p className="font-semibold text-black">
												Spent{" "}
												{formatCurrency(
													currentBudget.spentAmount,
												)}
											</p>
											{Number(
												currentBudget.exceededAmount,
											) > 0 ? (
												<p className="font-semibold text-red-500">
													Exceeded by{" "}
													{formatCurrency(
														currentBudget.exceededAmount,
													)}
												</p>
											) : (
												<p className="font-semibold text-emerald-600">
													{formatCurrency(
														currentBudget.remainingAmount,
													)}{" "}
													left to spend
												</p>
											)}
										</div>
									</div>
								</div>
							</>
						)}
					</div>

					{/* Budget history section */}

					<div className="w-full flex flex-col gap-5">
						<p className="font-bold text-black text-xl">
							Budget History
						</p>
						<div className="w-full max-w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 justify-items-center gap-5 mb-5">
							{loading
								? Array.from({ length: 4 }).map((_, i) => (
										<CardSkeleton key={i} variant="stat" />
									))
								: budgetHistoryStats.map((stat) => (
										<div
											key={stat.title}
											className="w-full min-w-0 p-5 rounded-lg shadow-lg flex flex-col gap-2 box-border border border-gray-100 hover:-translate-y-1 transition-all duration-300"
										>
											<div className="flex gap-3 items-center">
												<div
													className={`w-10 h-10 rounded-xl flex justify-center items-center ${stat.iconBg}`}
												>
													<stat.logo
														className={`w-5 h-5 ${stat.icon} shrink-0`}
													/>
												</div>

												<p className="text-gray-500 text-sm font-medium min-w-0 break-words">
													{stat.title}
												</p>
											</div>
											<p className="text-3xl font-bold">
												{stat.info}
											</p>
										</div>
									))}
						</div>
					</div>
				</div>
			)}

			{/* Budget set modal */}

			<dialog
				ref={budgetSetModalRef}
				className="modal modal-bottom sm:modal-middle"
			>
				<div className="modal-box max-w-xl p-6">
					<div className="flex items-center justify-between mb-4">
						<p className="text-xl font-bold">Set Budget</p>
						<button
							className="btn btn-sm btn-circle btn-ghost"
							onClick={closeBudgetSetModal}
						>
							✕
						</button>
					</div>

					<form
						onSubmit={handleSubmit(handleSetBudget)}
						className="flex flex-col gap-4"
					>
						{/* Amount */}

						<div className="flex flex-col gap-1">
							<label className="text-sm font-semibold text-gray-700">
								Amount
							</label>
							<input
								type="number"
								className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-black"
								step="0.01"
								{...register("amount", { valueAsNumber: true })}
							/>
							{errors.amount && (
								<p className="text-sm text-red-600">
									{errors.amount?.message}
								</p>
							)}
						</div>

						{/* Start date */}

						<div className="flex flex-col gap-1">
							<label className="text-sm font-semibold text-gray-700">
								Start Date
							</label>
							<input
								type="date"
								className="input input-bordered w-full outline-none focus:ring-2 focus:ring-black"
								min={new Date().toISOString().split("T")[0]}
								{...register("startDate")}
							/>
							{errors.startDate && (
								<p className="text-sm text-red-600">
									{errors.startDate?.message}
								</p>
							)}
						</div>

						{/* End date */}

						<div className="flex flex-col gap-1">
							<label className="text-sm font-semibold text-gray-700">
								End Date
							</label>
							<input
								type="date"
								className="input input-bordered w-full outline-none focus:ring-2 focus:ring-black"
								min={new Date().toISOString().split("T")[0]}
								{...register("endDate")}
							/>
							{errors.endDate && (
								<p className="text-sm text-red-600">
									{errors.endDate?.message}
								</p>
							)}
						</div>

						<div className="flex justify-end gap-2">
							<button
								onClick={closeBudgetSetModal}
								type="button"
								className="btn btn-soft"
							>
								Cancel
							</button>
							<button
								type="submit"
								className="w-25 btn bg-black text-white border-white hover:bg-white hover:text-black hover:border-black border transition-colors duration-500"
								disabled={isSubmitting}
							>
								{isSubmitting ? (
									<span className="loading loading-dots loading-md"></span>
								) : (
									"Set"
								)}
							</button>
						</div>
					</form>
				</div>
			</dialog>
		</div>
	);
};

export default MyActivity;
