import mongoose, { Schema, model, models } from "mongoose";

const MessageSchema = new Schema(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true, trim: true },
    chat: { type: Schema.Types.ObjectId, ref: "Chat", required: true },
    readBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export const Message = models.Message || model("Message", MessageSchema);
