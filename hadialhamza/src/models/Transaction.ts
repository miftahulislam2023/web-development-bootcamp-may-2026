import mongoose, { Schema, model, models } from "mongoose";

export interface ITransaction {
  _id: string;
  userId: mongoose.Types.ObjectId;
  categoryId: mongoose.Types.ObjectId;
  name: string;
  amount: number;
  type: "income" | "expense";
  date: Date;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    name: {
      type: String,
      required: [true, "Transaction name is required"],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: [true, "Transaction type is required"],
    },
    date: {
      type: Date,
      default: Date.now,
    },
    note: {
      type: String,
      trim: true,
      maxlength: [200, "Note cannot be more than 200 characters"],
    },
  },
  {
    timestamps: true,
  }
);

// Add indexes for faster querying
TransactionSchema.index({ userId: 1, date: -1 });
TransactionSchema.index({ userId: 1, categoryId: 1 });

const Transaction = models.Transaction || model<ITransaction>("Transaction", TransactionSchema);

export default Transaction;
