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
      const now = new Date();

      return start >= now;
    },
    {
      message: "Start date cannot be earlier than now",
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
      startDate: "",
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
      console.log(error.message);
    }
  };

  // Budget history fetch function

  const budgetHistoryFetch = async () => {
    try {
      const res = await axiosSecure.get("/budget/summary");

      setBudgetHistory(res.data.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  // Load budget information

  useEffect(() => {
    const loadBudgetData = async () => {
      setLoading(true);
      try {
        await Promise.all([budgetFetch(), budgetHistoryFetch()]);
      } catch (error) {
        console.log(error.message);
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
      console.log(error.message);
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
        console.log(error.message);
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
        console.log(error.message);
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
        console.log(error.message);
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

  // useEffect(() => {

  //     // AI insights fetch function

  //     const fetchAiInsight = async () => {
  //         setAiLoading(true);
  //         try {
  //             const res = await axiosSecure.get("/ai");
  //             setAiData(res.data.data);
  //         } catch (error) {
  //             console.log(error.message);
  //         } finally {
  //             setAiLoading(false);
  //         }
  //     };

  //     if (userData?.email)
  //         fetchAiInsight();
  // },[userData?.email]);

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

  console.log(userData);
  console.log(budgetHistory);

  return (
    <div className="w-full flex flex-col inter">
      {/* Heading */}

      <div className="flex flex-col items-start gap-2 mb-10">
        <p className="text-4xl font-bold lobster">My Activities</p>
        <p className="text-sm font-medium text-gray-400">
          Track your financial activities and stay in control of your budget
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
                    <stat.logo className={`w-5 h-5 ${stat.icon} shrink-0`} />
                  </div>

                  <p className="text-gray-500 text-sm font-medium min-w-0 break-words">
                    {stat.title}
                  </p>
                </div>
                <p className="text-3xl font-bold">{stat.info}</p>
              </div>
            ))}
      </div>

      {/* Budget section */}

      <div className="w-full shadow-lg rounded-lg p-5 box-border flex flex-col items-start gap-10">
        <div>
          {!currentBudget || Object.keys(currentBudget).length === 0 ? (
            <>
              <button
                type="submit"
                className="btn w-full h-12 font-medium cursor-pointer text-lg bg-black text-white border-white hover:bg-white hover:text-black hover:border-black border transition-colors duration-500"
                onClick={openBudgetSetModal}
              >
                Set Budget
              </button>
            </>
          ) : (
            <>
              <div className="flex flex-col gap-2">
                <p className="font-bold text-black text-xl">Current Budget</p>
              </div>
            </>
          )}
        </div>

        {/* Budget history section */}

        <div className="w-full flex flex-col gap-5">
          <p className="font-bold text-black text-xl">Budget History</p>
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
                    <p className="text-3xl font-bold">{stat.info}</p>
                  </div>
                ))}
          </div>
        </div>
      </div>

      {/* Budget set modal */}

      <dialog
        ref={budgetSetModalRef}
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box max-w-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xl font-bold graphik">Set Budget</p>
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
                <p className="text-sm text-red-600">{errors.amount?.message}</p>
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
