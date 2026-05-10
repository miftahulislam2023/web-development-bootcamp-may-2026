import mongoose, { Schema } from "mongoose";

const budgetSchema=new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    amount:{
        type:Number,
        required:true,
    },
    startDate:{
        type: Date,
        required:true
    },
    endDate:{
        type: Date,
        required:true
    }
},{
    timestamps:true
});

export const Budget = mongoose.model("Budget", budgetSchema);