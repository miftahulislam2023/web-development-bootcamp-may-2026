import mongoose, { Schema, model, models } from "mongoose";

export interface IGoal {
  _id: string;
  userId: mongoose.Types.ObjectId;
  title: string;
  targetAmount: number;
  currentAmount: number;
  category: string;
  deadline?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const GoalSchema = new Schema<IGoal>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    targetAmount: {
      type: Number,
      required: true,
      min: 1,
    },
    currentAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    category: {
      type: String,
      default: "General",
    },
    deadline: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Goal = models.Goal || model<IGoal>("Goal", GoalSchema);

export default Goal;
