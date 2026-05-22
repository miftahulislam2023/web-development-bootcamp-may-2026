const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: [
        "budget_warning",
        "budget_exceeded",
        "goal_achieved",
        "anomaly_detected",
      ],
      required: true,
    },
    category: String, // e.g., "Food & Dining"
    title: { type: String, required: true },
    message: { type: String, required: true },
    percentage: Number, // Budget usage percentage (e.g., 75)
    amount: Number, // Transaction/budget amount
    read: { type: Boolean, default: false },
    actionUrl: String, // Link to view transaction or budget
  },
  { timestamps: true },
);

// Index for user notifications
notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ user: 1, read: 1 });

module.exports = mongoose.model("Notification", notificationSchema);
