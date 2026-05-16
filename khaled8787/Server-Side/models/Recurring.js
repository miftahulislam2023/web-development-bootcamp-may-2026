const mongoose = require("mongoose");

const recurringSchema =
  new mongoose.Schema(
    {
      userId: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

      title: {
        type: String,
        required: true,
      },

      amount: {
        type: Number,
        required: true,
      },

      type: {
        type: String,
        enum: [
          "income",
          "expense",
        ],
      },

      frequency: {
        type: String,
        enum: [
          "daily",
          "weekly",
          "monthly",
        ],
      },

      nextDate: {
        type: Date,
      },
    },
    {
      timestamps: true,
    }
  );

module.exports = mongoose.model(
  "Recurring",
  recurringSchema
);