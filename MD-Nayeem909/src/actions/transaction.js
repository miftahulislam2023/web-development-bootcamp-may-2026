'use server';

import { revalidatePath } from 'next/cache';
import connectToDatabase from '@/lib/db';
import Transaction from '@/models/Transaction';
import mongoose from 'mongoose';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function addTransaction(data) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return { error: 'Unauthorized. Please login.' };

    await connectToDatabase();
    const { type, amount, category, date, note } = data;

    if (!type || !amount || !category || !date) {
      return { error: 'Please provide all required fields.' };
    }

    const newTransaction = new Transaction({
      user: session.user.id,
      type,
      amount,
      category,
      date: new Date(date),
      note,
    });

    await newTransaction.save();

    revalidatePath('/');
    revalidatePath('/transactions');
    return { success: true };
  } catch (error) {
    console.error('Error adding transaction:', error);
    return { error: error.message || 'Failed to add transaction' };
  }
}

export async function deleteTransaction(id) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return { error: 'Unauthorized' };

    await connectToDatabase();
    await Transaction.findOneAndDelete({ _id: id, user: session.user.id });
    
    revalidatePath('/');
    revalidatePath('/transactions');
    return { success: true };
  } catch (error) {
    return { error: 'Failed to delete transaction' };
  }
}

export async function getDashboardData() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return { error: 'Unauthorized' };

    await connectToDatabase();

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const userIdObj = new mongoose.Types.ObjectId(session.user.id);

    const matchUserAndDate = {
      user: userIdObj,
      date: { $gte: startOfMonth, $lte: endOfMonth }
    };

    const incomeTotal = await Transaction.aggregate([
      { $match: { type: 'Income', ...matchUserAndDate } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const expenseTotal = await Transaction.aggregate([
      { $match: { type: 'Expense', ...matchUserAndDate } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const income = incomeTotal[0]?.total || 0;
    const expense = expenseTotal[0]?.total || 0;
    const balance = income - expense;

    const categoryData = await Transaction.aggregate([
      { $match: { type: 'Expense', ...matchUserAndDate } },
      { $group: { _id: '$category', value: { $sum: '$amount' } } },
      { $project: { name: '$_id', value: 1, _id: 0 } }
    ]);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);
    
    const dailyData = await Transaction.aggregate([
      { $match: { user: userIdObj, date: { $gte: thirtyDaysAgo, $lte: now } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          income: { $sum: { $cond: [{ $eq: ['$type', 'Income'] }, '$amount', 0] } },
          expense: { $sum: { $cond: [{ $eq: ['$type', 'Expense'] }, '$amount', 0] } }
        }
      },
      { $sort: { _id: 1 } },
      { $project: { date: '$_id', income: 1, expense: 1, _id: 0 } }
    ]);

    const recentTransactions = await Transaction.find({ user: session.user.id })
      .sort({ date: -1 })
      .limit(5)
      .lean();

    return {
      totals: { balance, income, expense },
      categoryData,
      dailyData,
      recentTransactions: JSON.parse(JSON.stringify(recentTransactions))
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return { error: 'Failed to fetch dashboard data' };
  }
}

export async function getTransactions(searchParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return [];

    await connectToDatabase();

    let query = { user: session.user.id };
    
    if (searchParams?.type && searchParams.type !== 'All') {
      query.type = searchParams.type;
    }

    if (searchParams?.month) {
      const [year, month] = searchParams.month.split('-');
      const start = new Date(parseInt(year), parseInt(month) - 1, 1);
      const end = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59);
      query.date = { $gte: start, $lte: end };
    }

    const transactions = await Transaction.find(query)
      .sort({ date: -1 })
      .lean();

    return JSON.parse(JSON.stringify(transactions));
  } catch (error) {
    return [];
  }
}
