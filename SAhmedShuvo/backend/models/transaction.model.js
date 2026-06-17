const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    // Which user owns this transaction
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // From which account the transaction happened
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },

    // Income or Expense
    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
    },

    // Transaction title
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // Amount of money
    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    // Category
    category: {
      type: String,
      required: true,
      enum: [
        "Salary",
        "Freelance",
        "Investment",
        "Business",
        "Bonus",
        "Gift",
        "Refund",
        "Rental",
        "Food",
        "Transport",
        "Shopping",
        "Bills",
        "Education",
        "Health",
        "Entertainment",
        "Other",
        "Shopping",
        "Rent",
        "Travel",
        "Insurance",
        "Subscription",
        "Investment",
        "Business",
        "Bonus",
        "Refund",
        "Rental",
      ],
    },

    // Optional note
    note: {
      type: String,
      trim: true,
      default: "",
    },

    // Transaction date
    transactionDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model(
  "Transaction",
  transactionSchema
);

module.exports = Transaction;