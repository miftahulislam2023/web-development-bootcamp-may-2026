import mongoose, {Document, Schema} from "mongoose";

export interface IUser extends Document{
    name: string;
    email: string;
    avatar: {
        url: string;
        publicId: string;
    };
    isInvisible: boolean;
}

const schema: Schema<IUser> = new Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    avatar: {
        url: { type: String, default: "" },
        publicId: { type: String, default: "" },
    },
    isInvisible: {
        type: Boolean,
        default: false,
    },
});

export const User = mongoose.model<IUser>("User", schema);