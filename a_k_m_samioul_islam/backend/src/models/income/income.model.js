import mongoose, { Schema } from "mongoose";

const incomeSchema=new Schema({
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
    source:{
        type: String,
        enum: ["Salary", "Freelance", "Business", "Gift","Others"],
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

export const Income = mongoose.model("Income", incomeSchema);