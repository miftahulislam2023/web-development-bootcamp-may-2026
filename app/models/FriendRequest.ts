import mongoose, { Schema, model, models } from "mongoose";

const FriendRequestSchema = new Schema(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const FriendRequest =
  models.FriendRequest || model("FriendRequest", FriendRequestSchema);
