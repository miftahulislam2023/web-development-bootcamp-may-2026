import mongoose from "mongoose";

const expenseSchema =
  new mongoose.Schema(
    {
      user: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      expenseType: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "ExpenseType",
        required: true,
      },

      title: {
        type: String,
        required: true,
        trim: true,
      },

      amount: {
        type: Number,
        required: true,
      },

      note: {
        type: String,
        default: "",
        trim: true,
      },

      expenseDate: {
        type: Date,
        default: Date.now,
      },

    },
    {
      timestamps: true,
      versionKey: false,
    }
  );

const Expense = mongoose.model(
  "Expense",
  expenseSchema
);

export default Expense;