import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../providers/AuthProvider/AuthProvider';
import axiosSecure from '../../utils/axios/axioshelper.js';
import { toast } from 'sonner';
import CardSkeleton from '../../components/cardSkeleton/CardSkeleton';
import { GrMoney } from "react-icons/gr";
import { TbCreditCardPay, TbCreditCardRefund } from "react-icons/tb";

const MyActivity = () => {
    const { userData }= useContext(AuthContext);

    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState({});
    const [summaryExpenses, setSummaryExpenses] = useState({})
    const [currentBudget,setCurrentBudget] = useState(null);
    const [budgetHistory, setBudgetHistory] = useState({});
    const [transactions, setTransactions] = useState({});

    const [aiLoading, setAiLoading] = useState(true);
    const [aiData,setAiData] = useState({});

    // Summary data fetch 

    useEffect(()=>{

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
        }

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
        }

        if(userData?.email){
            fetchSummary();
            fetchSummaryExpenses();
            fetchSummaryTransactions();
        }
    },[userData?.email]);

    // Current budget and budget history fetch

    useEffect(() => {

        // Current budget fetch function

        const budgetFetch = async () => {
            setLoading(true);
            try {
                const res = await axiosSecure.get("/budget");

                setCurrentBudget(res.data.data);
            } catch (error) {
                console.log(error.message);
            } finally {
                setLoading(false);
            }
        };

        // Budget history fetch function

        const budgetHistoryFetch = async () => {
            setLoading(true);
            try {
                const res = await axiosSecure.get("/budget/summary");

                setBudgetHistory(res.data.data);
            } catch (error) {
                console.log(error.message);
            } finally {
                setLoading(false);
            }
        }
        if(userData?.email){
            budgetFetch();
            budgetHistoryFetch();
        }
    },[userData?.email]);

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
            iconBg:"bg-orange-100",
            icon:"text-orange-700"
        },
        {
            title: "Monthly Incomes",
            info: summary.totalMonthlyIncome,
            logo: TbCreditCardRefund,
            iconBg:"bg-blue-100",
            icon:"text-blue-700"
        },
        {
            title: "Monthly Expenses",
            info: summary.totalMonthlyExpense,
            logo: TbCreditCardPay,
            iconBg:"bg-green-100",
            icon:"text-green-700"
        },
    ];

    console.log(userData);
    console.log(summary, summaryExpenses, currentBudget, budgetHistory, transactions, aiData);

    return (
        <div className='w-full flex flex-col inter'>

            {/* Heading */}
        
            <div className='flex flex-col items-start gap-2 mb-10'>
                <p className='text-4xl font-bold lobster'>My Activities</p>
                <p className='text-sm font-medium text-gray-400'>Track your financial activities and stay in control of your budget</p>
            </div>

            {/* Stat cards */}

            <div className='w-full max-w-full grid grid-cols-1 lg:grid-cols-3 justify-items-center gap-5 mb-5'>
                {
                    loading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <CardSkeleton key={i} variant="stat" />
                        )
                        )
                    ) :
                        (
                            stats.map(stat =>
                                <div key={stat.title} className='w-full min-w-0 p-5 rounded-lg shadow-lg flex flex-col gap-2 box-border border border-gray-100 hover:-translate-y-1 transition-all duration-300'>
                                    <div className='flex gap-3 items-center'>
                                        <div className={`w-10 h-10 rounded-xl flex justify-center items-center ${stat.iconBg}`}>
                                            <stat.logo className={`w-5 h-5 ${stat.icon} shrink-0`} />
                                        </div>
                                        
                                        <p className='text-gray-500 text-sm font-medium min-w-0 break-words'>{stat.title}</p>

                                    </div>
                                    <p className='text-3xl font-bold'>{stat.info}</p>
                                </div>
                            )
                        )
                }
            </div>

            {/* Budget section */}

            <div className='w-full shadow-lg rounded-lg'>

            </div>
        </div>
    );
};

export default MyActivity;