import mongoose, { Schema, model, models } from "mongoose";

const FriendshipSchema = new Schema(
  {
    users: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
  },
  { timestamps: true }
);

export const Friendship =
  models.Friendship || model("Friendship", FriendshipSchema);
