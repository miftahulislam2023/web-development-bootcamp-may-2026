const mongoose = require("mongoose");
const CATEGORIES = ["Food & Dining","Transportation","Shopping","Bills & Utilities","Healthcare","Entertainment","Education","Travel","Savings","Salary","Other"];
const transactionSchema = new mongoose.Schema({
  user:        { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title:       { type: String, required: true, trim: true },
  amount:      { type: Number, required: true, min: 0.01 },
  category:    { type: String, required: true, enum: CATEGORIES },
  type:        { type: String, enum: ["income","expense"], required: true },
  date:        { type: Date, default: Date.now },
  note:        { type: String, default: "", maxlength: 500 },
  isRecurring: { type: Boolean, default: false },
  tags:        [{ type: String }],
}, { timestamps: true });
transactionSchema.index({ user: 1, date: -1 });
transactionSchema.index({ user: 1, category: 1 });
transactionSchema.index({ user: 1, type: 1 });
module.exports = mongoose.model("Transaction", transactionSchema);
