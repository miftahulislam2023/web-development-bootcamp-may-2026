import { Income } from "../../models/income/income.model.js";
import { Expense } from "../../models/expense/expense.model.js";

// Dashboard summary fetch

export const getSummaryService = async (dbUser) => {
    const now = new Date();

    const year = now.getFullYear();
    const month = now.getMonth();

    const incomes = await Income.find({
        user: dbUser._id
    }).sort({ createdAt: -1 });

    const expenses = await Expense.find({
        user: dbUser._id
    }).sort({ createdAt: -1 });

    const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
    const totalExpense = expenses.reduce(
        (sum, expense) => sum + expense.amount,
        0
    );

    const currentMonth = new Date(year, month, 1);
    const nextMonth = new Date(year, month + 1, 1);

    const monthlyIncome = incomes.filter((income) => {
        return income.createdAt >= currentMonth && income.createdAt < nextMonth;
    });

    const monthlyExpenses = expenses.filter((expense) => {
        return expense.createdAt >= currentMonth && expense.createdAt < nextMonth;
    });

    const totalMonthlyIncome = monthlyIncome.reduce(
        (sum, income) => sum + income.amount,
        0
    );
    const totalMonthlyExpense = monthlyExpenses.reduce(
        (sum, expense) => sum + expense.amount,
        0
    );

    return {
        netBalance: totalIncome - totalExpense,
        incomeCount: monthlyIncome.length,
        expenseCount: monthlyExpenses.length,
        totalMonthlyIncome,
        totalMonthlyExpense,
        monthlyIncome,
        monthlyExpenses
    };
};

// Last 7 days category wise expense

export const categoryWiseExpenseService = async (dbUser) => {
    const day = new Date();

    day.setDate(day.getDate() - 7);

    const expenses = await Expense.find({
        user: dbUser._id,
        createdAt: {
            $gte: day
        }
    }).sort({ createdAt: -1 });

    const categoryWiseCount=expenses.reduce((result,expense)=>{
        const category=expense.category;

        if(!result[category])
            result[category]=0;

        result[category]+=expense.amount;

        return result;
    },{});

    return categoryWiseCount;
};

// Last 7 days incomes vs expense

export const getTransactionsService=async(dbUser)=>{
    const day = new Date();

    day.setDate(day.getDate() - 7);

    const expenses = await Expense.find({
        user: dbUser._id,
        createdAt: {
            $gte: day
        }
    }).sort({ createdAt: -1 });

    const incomes = await Income.find({
        user: dbUser._id,
        createdAt: {
            $gte: day
        }
    }).sort({ createdAt: -1 });

    const totalIncomes=incomes.reduce((result,income)=>{
        const dayName= income.createdAt.toLocaleDateString("en-US",{weekday:"long"});

        if(!result[`${dayName}`])
            result[`${dayName}`]=0;

        result[`${dayName}`]+=income.amount;

        return result;
    },{});

    const totalExpenses=expenses.reduce((result,expense)=>{
        const dayName= expense.createdAt.toLocaleDateString("en-US",{weekday:"long"});

        if(!result[`${dayName}`])
            result[`${dayName}`]=0;

        result[`${dayName}`]+=expense.amount;

        return result;
    },{});

    const transactions={};

    for(const day in totalIncomes){
        if(!transactions[day])
            transactions[day]={
                income:0,
                expense:0
            };

        transactions[day].income=totalIncomes[day];
    }

    for(const day in totalExpenses){
        if(!transactions[day])
            transactions[day]={
                income:0,
                expense:0
            };

        transactions[day].expense=totalExpenses[day];
    }

    return transactions;
}
