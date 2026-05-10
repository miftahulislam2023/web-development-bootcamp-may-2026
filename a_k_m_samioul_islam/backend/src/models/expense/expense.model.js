import mongoose, { Schema } from "mongoose";

const expenseSchema=new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    amount:{
        type:Number,
        required:true,
    },
    user:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    category:{
        type: String,
        enum: ["Food", "Transport", "Shopping", "Bills","Health", "Rent","Others"],
        default:"Others",
        required:true
    },
    note:{
        type: String,
        trim:true
    }
},{
    timestamps:true
});

export const Expense = mongoose.model("Expense", expenseSchema);