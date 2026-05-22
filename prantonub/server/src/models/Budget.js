const mongoose = require("mongoose");
const budgetSchema = new mongoose.Schema({
  user:     { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  category: { type: String, required: true },
  amount:   { type: Number, required: true, min: 1 },
  month:    { type: Number, required: true },
  year:     { type: Number, required: true },
}, { timestamps: true });
budgetSchema.index({ user: 1, month: 1, year: 1 });
module.exports = mongoose.model("Budget", budgetSchema);
