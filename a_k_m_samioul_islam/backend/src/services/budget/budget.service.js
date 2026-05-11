import { Budget } from "../../models/budget/budget.model.js";

// Budget create

export const createBudgetService=async({amount, startDate, endDate, dbUser})=>{
    if(!amount || !startDate || !endDate){
        const error=new Error("All fields required");
        error.statusCode=400;
        throw error;
    }

    const start=new Date(startDate);
    const end=new Date(endDate);
    const now=new Date()

    if(Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())){
        const error=new Error("Invalid start and end date");
        error.statusCode=400;
        throw error;
    }

    if(start>=end){
        const error=new Error("Start date must be before end date");
        error.statusCode=400;
        throw error;
    }

    const currentBudget=await Budget.findOne({
        user:dbUser._id,
        startDate:{$lte:now},
        endDate:{$gte:now}
    });

    if(currentBudget){
        const error=new Error("Current active budget already exists");
        error.statusCode=409;
        throw error;
    }

    const budget=await Budget.create({
        user:dbUser._id,
        amount,
        startDate:start,
        endDate:end
    });

    return budget;
}