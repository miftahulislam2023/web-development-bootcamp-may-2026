const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, default: null },
    googleId: { type: String, default: null },
    avatar: { type: String, default: "" },
    currency: { type: String, default: "USD" },
    monthlyBudget: { type: Number, default: 0 },
    theme: { type: String, enum: ["light", "dark"], default: "light" },
    isActive: { type: Boolean, default: true },

    // Email OTP verification
    isVerified: { type: Boolean, default: false },
    otp: { type: String, default: null },
    otpExpiry: { type: Date, default: null },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
