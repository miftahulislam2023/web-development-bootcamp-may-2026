const mongoose = require("mongoose");
const recurringSchema = new mongoose.Schema({
  user:          { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title:         { type: String, required: true },
  amount:        { type: Number, required: true, min: 0.01 },
  category:      { type: String, required: true },
  type:          { type: String, enum: ["income","expense"], required: true },
  frequency:     { type: String, enum: ["daily","weekly","monthly"], required: true },
  startDate:     { type: Date, default: Date.now },
  lastGenerated: { type: Date, default: null },
  isActive:      { type: Boolean, default: true },
  note:          { type: String, default: "" },
}, { timestamps: true });
module.exports = mongoose.model("Recurring", recurringSchema);
