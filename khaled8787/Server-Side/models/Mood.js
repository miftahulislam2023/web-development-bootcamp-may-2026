const mongoose = require("mongoose");

const moodSchema = new mongoose.Schema(
  {
    userId: String,
    mood: String,
    amount: Number,
    notes: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Mood", moodSchema);