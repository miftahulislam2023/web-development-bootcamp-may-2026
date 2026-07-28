import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    username: { type: String, required: true },
    email: { 
      type: String, 
      required: true, 
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { 
      type: String, 
      required: true,
      select: false,
    },
    avatar: { type: String, default: "" },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    }
  },
  { timestamps: true }
);

// Prevent model recompilation errors in Next.js
export const User = models.User || model("User", UserSchema);
