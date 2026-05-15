import Expense from "../../models/expense.model.js";

import ExpenseType from "../../models/expenseType.model.js";

import CustomError from "../../utils/customError.js";
import mongoose from "mongoose";


// Create Expense
export const createExpenseService =
  async (
    userId,
    validatedData
  ) => {

    const {
      expenseType,
      title,
      amount,
      note,
    } = validatedData;


    // Check Expense Type
    const existingExpenseType =
      await ExpenseType.findById(
        expenseType
      );

    if (!existingExpenseType) {

      throw new CustomError(
        "Expense type not found",
        404
      );

    }


    const expense =
      await Expense.create({
        user: userId,
        expenseType,
        title,
        amount,
        note,
      });


    return expense;

};


export const getExpensesService =
  async (
    userId,
    query
  ) => {

    const {
      page = 1,
      limit = 10,
      search = "",
      expenseType,
      month,
      year,
    } = query;


    // Dynamic Filter
    const filter = {
      user: userId,
    };


    // Search By title or note
   if (search) {

  filter.$or = [

    {
      title: {
        $regex: search,
        $options: "i",
      },
    },

    {
      note: {
        $regex: search,
        $options: "i",
      },
    },

  ];

}


    // Filter By Expense Type
    if (expenseType) {

      filter.expenseType =
        expenseType;

    }


    // Filter By Month + Year
    if (month && year) {

      filter.expenseDate = {

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

      };

    }


    // Pagination
    const skip =
      (page - 1) * limit;


    // Total Count
    const totalExpenses =
      await Expense.countDocuments(
        filter
      );


    // Get Expenses
    const expenses =
      await Expense.find(filter)

        .populate(
          "expenseType",
          "name"
        )

        .sort({
          createdAt: -1,
        })

        .skip(skip)

        .limit(Number(limit));


    return {

      currentPage:
        Number(page),

      totalPages:
        Math.ceil(
          totalExpenses / limit
        ),

      totalExpenses,

      expenses,

    };

};


export const updateExpenseService =
  async (
    expenseId,
    userId,
    validatedData
  ) => {

    const expense =
      await Expense.findOne({
        _id: expenseId,
        user: userId,
      });


    if (!expense) {

      throw new CustomError(
        "Expense not found",
        404
      );

    }


    

    const updatedExpense =
      await Expense.findByIdAndUpdate(
        expenseId,
        validatedData,
        {
          new: true,
        }
      )

        .populate(
          "expenseType",
          "name"
        );


    return updatedExpense;

};

export const deleteExpenseService =
  async (
    expenseId,
    userId
  ) => {

    const expense =
      await Expense.findOne({
        _id: expenseId,
        user: userId,
      });


    if (!expense) {

      throw new CustomError(
        "Expense not found",
        404
      );

    }


    await Expense.findByIdAndDelete(
      expenseId
    );


    return;

};


export const getExpenseSummaryService =
  async (userId) => {

    // Total Expense
    const totalExpenseResult =
      await Expense.aggregate([
        {
          $match: {
            user: new mongoose.Types.ObjectId(
              userId
            ),
          },
        },

        {
          $group: {
            _id: null,

            totalAmount: {
              $sum: "$amount",
            },

            totalTransactions: {
              $sum: 1,
            },
          },
        },
      ]);


    // Latest Expense
    const latestExpense =
      await Expense.findOne({
        user: userId,
      })

        .sort({
          createdAt: -1,
        })

        .populate(
          "expenseType",
          "name"
        );


    return {
      totalExpense:
        totalExpenseResult[0]
          ?.totalAmount || 0,

      totalTransactions:
        totalExpenseResult[0]
          ?.totalTransactions || 0,

      latestExpense,
    };

};


export const getCategorySummaryService =
  async (userId) => {

    const categorySummary =
      await Expense.aggregate([

        {
          $match: {
            user:
              new mongoose.Types.ObjectId(
                userId
              ),
          },
        },


        {
          $group: {

            _id: "$expenseType",

            totalAmount: {
              $sum: "$amount",
            },

          },
        },


        {
          $lookup: {

            from: "expensetypes",

            localField: "_id",

            foreignField: "_id",

            as: "expenseType",

          },
        },


        {
          $unwind: "$expenseType",
        },


        {
          $project: {

            _id: 0,

            category:
              "$expenseType.name",

            totalAmount: 1,

          },
        },

      ]);


    return categorySummary;

};

export const getMonthlySummaryService =
  async (userId) => {

    const monthlySummary =
      await Expense.aggregate([

        {
          $match: {
            user:
              new mongoose.Types.ObjectId(
                userId
              ),
          },
        },


        {
          $group: {

            _id: {

              year: {
                $year: "$expenseDate",
              },

              month: {
                $month: "$expenseDate",
              },

            },

            totalAmount: {
              $sum: "$amount",
            },

          },
        },


        {
          $sort: {
            "_id.year": 1,
            "_id.month": 1,
          },
        },


        {
          $project: {

            _id: 0,

            month: {
              $concat: [

                {
                  $toString:
                    "$_id.year",
                },

                "-",

                {
                  $cond: [

                    {
                      $lt: [
                        "$_id.month",
                        10,
                      ],
                    },

                    {
                      $concat: [
                        "0",
                        {
                          $toString:
                            "$_id.month",
                        },
                      ],
                    },

                    {
                      $toString:
                        "$_id.month",
                    },

                  ],
                },

              ],
            },

            totalAmount: 1,

          },
        },

      ]);


    return monthlySummary;

};

export const getSingleExpenseService =
  async (
    expenseId,
    userId
  ) => {

    const expense =
      await Expense.findOne({

        _id: expenseId,

        user: userId,

      })

        .populate(
          "expenseType",
          "name"
        );


    if (!expense) {

      throw new CustomError(
        "Expense not found",
        404
      );

    }


    return expense;

};