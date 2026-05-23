import mongoose, { Document, Schema, Types } from "mongoose";

export interface IMessage extends Document {
    chatId: Types.ObjectId;
    sender: string;
    text?: string;
    image?: { url: string; publicId: string; };
    file?: { url: string; publicId: string; name: string; size: number; type: string; };
    messageType: "text" | "image" | "file";
    seen: boolean;
    seenAt?: Date;
    hiddenFrom: string[];
    deleted: boolean;
    deletedAt?: Date;
    edited: boolean;
    reactions: { userId: string; emoji: string }[];
    createdAt: Date;
    updatedAt: Date;
}

const schema: Schema<IMessage> = new Schema(
    {
        chatId: {
            type: Schema.Types.ObjectId,
            ref: "Chat",
            required: true,
        },
        sender: {
            type: String,
            required: true,
        },
        text: {
            type: String,
        },
        image: {
            url: { type: String },
            publicId: { type: String },
        },
        file: {
            url: { type: String },
            publicId: { type: String },
            name: { type: String },
            size: { type: Number },
            type: { type: String },
        },
        messageType: {
            type: String,
            enum: ["text", "image", "file"],
            default: "text",
        },
        seen: {
            type: Boolean,
            default: false,
        },
        seenAt: {
            type: Date,
            default: null,
        },
        hiddenFrom: { type: [String], default: [] },
        deleted: { type: Boolean, default: false },
        deletedAt: { type: Date, default: null },
        edited: { type: Boolean, default: false },
        reactions: { type: [{ userId: String, emoji: String }], default: [] },
    },
    { timestamps: true }
);

export const Message = mongoose.model<IMessage>("Messages", schema);
