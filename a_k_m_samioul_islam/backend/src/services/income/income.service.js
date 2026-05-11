import { Income } from "../../models/income/income.model";

// Income creation

export const createIncomeService = async (incomeData) => {
    const { title, amount, source, note } = incomeData;

    if (!title || !amount || !source) {
        const error = new Error("All fields required");
        error.statusCode = 400;
        throw error;
    }

    const income = await Income.create(incomeData);

    return income;
};

// Income fetch

export const getIncomeDetailsService=async(id, dbUser)=>{
    const income= await Income.findById(id).populate("user", "email");

    if(!income){
        const error = new Error("Income not found");
        error.statusCode = 404;
        throw error;
    }

    if(dbUser._id.toString()!==income.user._id.toString()){
        const error = new Error("You can access your own income data only");
        error.statusCode = 403;
        throw error;
    }

    return income;
};

// Income details update

export const updateIncomeDetailsService=async(incomeData, dbUser)=>{
    const {id,amount,note}=incomeData;

    const income=await Income.findById(id);

    if (!income) {
        const error = new Error("Income not found");
        error.statusCode = 404;
        throw error;
    }

    if(dbUser._id.toString()!==income.user.toString()){
        const error = new Error("You can update your own income data only");
        error.statusCode = 403;
        throw error;
    }

    if (!amount && !note) {
        const error = new Error("At least one field is required to update income");
        error.statusCode = 400;
        throw error;
    }

    if(amount)
        income.amount=amount;

    if(note)
        income.note=note;

    await income.save();

    return income;
};

// Income delete

export const deleteIncomeService=async(id, dbUser)=>{
    const income=await Income.findById(id);

    if (!income) {
        const error = new Error("Income not found");
        error.statusCode = 404;
        throw error;
    }

    if(dbUser._id.toString()!==income.user.toString()){
        const error = new Error("You can delete your own income data only");
        error.statusCode = 403;
        throw error;
    }

    await income.deleteOne();

    return income;
}