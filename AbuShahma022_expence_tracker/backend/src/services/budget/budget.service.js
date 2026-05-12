import mongoose from "mongoose";

import Budget from "../../models/budget.model.js";

import Expense from "../../models/expense.model.js";

import CustomError from "../../utils/customError.js";


// Create / Update Budget
export const createBudgetService =
  async (
    userId,
    validatedData
  ) => {

    const {
      amount,
      month,
      year,
    } = validatedData;


    // Check Existing Budget
    const existingBudget =
      await Budget.findOne({
        user: userId,
        month,
        year,
      });


    // Update Existing
    if (existingBudget) {

      existingBudget.amount =
        amount;

      await existingBudget.save();

      return existingBudget;

    }


    // Create New
    const budget =
      await Budget.create({
        user: userId,
        amount,
        month,
        year,
      });


    return budget;

};



// Get Current Budget Status
export const getCurrentBudgetService =
  async (
    userId,
    month,
    year
  ) => {

    const budget =
      await Budget.findOne({
        user: userId,
        month,
        year,
      });


    if (!budget) {

      throw new CustomError(
        "Budget not found",
        404
      );

    }


    // Calculate Total Expense
    const totalExpenseResult =
      await Expense.aggregate([

        {
          $match: {

            user:
              new mongoose.Types.ObjectId(
                userId
              ),

            expenseDate: {

              $gte:
                new Date(
                  year,
                  month - 1,
                  1
                ),

              $lt:
                new Date(
                  year,
                  month,
                  1
                ),

            },

          },
        },


        {
          $group: {

            _id: null,

            totalExpense: {
              $sum: "$amount",
            },

          },
        },

      ]);


    const totalExpense =
      totalExpenseResult[0]
        ?.totalExpense || 0;


    const remainingAmount =
      budget.amount -
      totalExpense;


    const percentageUsed =
      (
        (totalExpense /
          budget.amount) *
        100
      ).toFixed(2);


    return {

      budgetAmount:
        budget.amount,

      totalExpense,

      remainingAmount,

      percentageUsed,

    };

};