import mongoose from "mongoose";

const expenseTypeSchema =
  new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        trim: true,
      },

    

      user: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

      isDefault: {
        type: Boolean,
        default: false,
      },

    },
    {
      timestamps: true,
        versionKey: false,
    }
  );

const ExpenseType = mongoose.model(
  "ExpenseType",
  expenseTypeSchema
);

export default ExpenseType;