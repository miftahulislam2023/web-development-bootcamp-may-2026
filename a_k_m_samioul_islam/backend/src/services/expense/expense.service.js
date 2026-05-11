import { Expense } from "../../models/expense/expense.model.js";

// Expense creation

export const createExpenseService = async (expenseData) => {
    const { title, amount, category, note } = expenseData;

    if (!title || !amount || !category) {
        const error = new Error("All fields required");
        error.statusCode = 400;
        throw error;
    }

    const expense = await Expense.create(expenseData);

    return expense;
};

// Expense fetch

export const getExpenseDetailsService=async(id, dbUser)=>{
    const expense= await Expense.findById(id).populate("user", "email");

    if(!expense){
        const error = new Error("Expense not found");
        error.statusCode = 404;
        throw error;
    }

    if(dbUser._id.toString()!==expense.user._id.toString()){
        const error = new Error("You can access your own expense data only");
        error.statusCode = 403;
        throw error;
    }

    return expense;
}

// Expense details update

export const updateExpenseDetailsService=async(expenseData, dbUser)=>{
    const {id,amount,note}=expenseData;

    const expense=await Expense.findById(id);

    if (!expense) {
        const error = new Error("Expense not found");
        error.statusCode = 404;
        throw error;
    }

    if(dbUser._id.toString()!==expense.user.toString()){
        const error = new Error("You can update your own expense data only");
        error.statusCode = 403;
        throw error;
    }

    if (!amount && !note) {
        const error = new Error("At least one field is required to update expense");
        error.statusCode = 400;
        throw error;
    }

    if(amount)
        expense.amount=amount;

    if(note)
        expense.note=note;

    await expense.save();

    return expense;
}

// Expense delete

export const deleteExpenseService=async(id, dbUser)=>{
    const expense=await Expense.findById(id);

    if (!expense) {
        const error = new Error("Expense not found");
        error.statusCode = 404;
        throw error;
    }

    if(dbUser._id.toString()!==expense.user.toString()){
        const error = new Error("You can delete your own expense data only");
        error.statusCode = 403;
        throw error;
    }

    await expense.deleteOne();

    return expense;
}

// Users expenses

export const getExpensesService=async({ dbUser, page=1, limit=10, category, search, startDate, endDate })=>{
    const query={
        user:dbUser._id
    }

    if(category)
        query.category=category;

    if(search)
        query.title={
            $regex:search,
            $options:"i"
        };

    if(startDate || endDate){
        query.createdAt={};

        if(startDate)
            query.createdAt.$gte=new Date(startDate);

        if(endDate)
            query.createdAt.$lte=new Date(endDate)
    }

    const skip=(page-1)*limit;

    const expenses= await Expense.find(query).sort({createdAt:-1}).skip(skip).limit(Number(limit));

    return expenses;
}