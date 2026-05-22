import mongoose, { Schema, model, models } from "mongoose";

const ChatSchema = new Schema(
  {
    chatName: { type: String },
    isGroupChat: { type: Boolean, default: false },
    users: [{ type: Schema.Types.ObjectId, ref: "User" }],
    latestMessage: { type: Schema.Types.ObjectId, ref: "Message" },
    groupAdmin: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const Chat = models.Chat || model("Chat", ChatSchema);
