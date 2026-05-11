import { Income } from "../../models/income/income.model.js";
import { Expense } from "../../models/expense/expense.model.js";

// Dashboard summary fetch

export const getSummaryService = async (dbUser) => {
  const now = new Date();

  const year = now.getFullYear();
  const month = now.getMonth();

  const incomes = await Income.find({
    user: dbUser._id,
  }).sort({ createdAt: -1 });

  const expenses = await Expense.find({
    user: dbUser._id,
  }).sort({ createdAt: -1 });

  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
  const totalExpense = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0,
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
    0,
  );
  const totalMonthlyExpense = monthlyExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0,
  );

  return {
    netBalance: totalIncome - totalExpense,
    incomeCount: monthlyIncome.length,
    expenseCount: monthlyExpenses.length,
    totalMonthlyIncome,
    totalMonthlyExpense,
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
