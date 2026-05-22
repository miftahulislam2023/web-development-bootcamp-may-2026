import mongoose, { Schema, model, models } from "mongoose";

export interface IBudget {
  _id: string;
  userId: mongoose.Types.ObjectId;
  amount: number;
  month: number; // 0-11
  year: number;
  createdAt: Date;
  updatedAt: Date;
}

const BudgetSchema = new Schema<IBudget>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    month: {
      type: Number,
      required: true,
      min: 0,
      max: 11,
    },
    year: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

// Compound index to ensure one budget per user per month
BudgetSchema.index({ userId: 1, month: 1, year: 1 }, { unique: true });

const Budget = models.Budget || model<IBudget>("Budget", BudgetSchema);

export default Budget;
