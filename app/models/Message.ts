import mongoose, { Schema, model, models } from "mongoose";

const MessageSchema = new Schema(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, trim: true }, // Legacy/Plaintext fallback
    ciphertext: { type: String }, // Base64 Encrypted Payload
    iv: { type: String },         // Base64 Random 12-byte initialization vector
    authTag: { type: String },    // Base64 16-byte GCM Auth Tag
    algorithm: { type: String, default: "aes-256-gcm" },
    chat: { type: Schema.Types.ObjectId, ref: "Chat", required: true },
    readBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export const Message = models.Message || model("Message", MessageSchema);
