import { Budget } from "../../models/budget/budget.model.js";
import { Expense } from "../../models/expense/expense.model.js";

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

// Current budget

export const getCurrentBudgetService=async(dbUser)=>{
    const now= new Date();

    const budget=await Budget.findOne({
        user:dbUser._id,
        startDate:{$lte:now},
        endDate:{$gte:now}
    });

    if(!budget){
        const error=new Error("No current budget found");
        error.statusCode=404;
        throw error;
    }

    const spentData= await Expense.aggregate([
        {
            $match:{
                user:dbUser._id,
                createdAt:{
                    $gte:budget.startDate,
                    $lte: budget.endDate
                }
            }
        },
        {
            $group:{
                _id:null,
                totalSpent: {$sum:"$amount"}
            }
        }
    ]);

    const spentAmount= spentData[0]?.totalSpent || 0;
    const remainingAmount= budget.amount-spentAmount > 0 ? budget.amount-spentAmount:0;
    const exceededAmount= budget.amount-spentAmount < 0 ? spentAmount-budget.amount: 0;

    return {
        ...budget.toObject(),
        spentAmount,
        remainingAmount,
        exceededAmount,
        status:"active"
    }
}

// Budget summary

export const getBudgetSummaryService=async(dbUser)=>{
    const now=new Date();

    const budgets=await Budget.find({
        user:dbUser._id,
        endDate:{$lt:now}
    }).sort({startDate:-1});

    if(!budgets.length)
        return {
            totalCompletedBudgets: 0,
            fulfilledCount:0,
            overspentCount:0,
            bestPerformance:null
        };

    let fulfilledCount=0;
    let overspentCount=0;
    let bestPerformance=null;

    for(const budget of budgets){
        const spentData= await Expense.aggregate([
            {
                $match:{
                    user:dbUser._id,
                    createdAt:{
                        $gte:budget.startDate,
                        $lte: budget.endDate
                    }
                }
            },
            {
                $group:{
                    _id:null,
                    totalSpent: {$sum:"$amount"}
                }
            }
        ]);

        const spentAmount= spentData[0]?.totalSpent || 0;
        const savingAmount= budget.amount-spentAmount;

        if(spentAmount<=budget.amount)
            fulfilledCount++;
        else
            overspentCount++;

        if (savingAmount >= 0) {
            if (!bestPerformance || (savingAmount > bestPerformance.savingAmount)) {
                bestPerformance = {
                    budgetId: budget._id,
                    period: {
                        startDate: budget.startDate,
                        endDate: budget.endDate
                    },
                    budgetAmount: budget.amount,
                    spentAmount,
                    savingAmount
                };
            }
        }

    }

    return {
        totalCompletedBudgets:budgets.length,
        fulfilledCount,
        overspentCount,
        bestPerformance
    };
};