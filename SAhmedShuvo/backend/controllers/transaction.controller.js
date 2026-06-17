const Transaction = require("../models/transaction.model");
const Account = require("../models/account.model");
const User = require("../models/user.model");

const addExpense = async (req, res) => {
    const { accountId, title, amount, category, note} = req.body;
    const userId = req.user.sub;
    try {
        if (!accountId || !title || !amount || !category) {
            return res.status(400).json({
                message: "All fields except note are required"
            });
        }

        const account = await Account.findOne({
            _id: accountId,
            userId
        });

        if (!account) {
            return res.status(404).json({
                message: "Account not found"
            });
        }
        if (account.balance < amount) {
            return res.status(400).json({
                message: "Insufficient balance"
            });
        }

        const newTransaction = new Transaction({
            userId,
            accountId,
            title,
            amount,
            type: "expense",
            category,
            note
        });

        await newTransaction.save();

        account.balance -= amount;
        await account.save();

        res.status(201).json({
            message: "Expense added successfully"
        });
    }

    catch(error){
        console.error("Error adding transaction:", error);
        res.status(500).json({ message: "Server error" });
    }
};
const addIncome = async (req, res) => {
    const { accountId, title, amount, category, note} = req.body;
    const userId = req.user.sub;
    try {
        if (!accountId || !title || !amount || !category) {
            return res.status(400).json({
                message: "All fields except note are required"
            });
        }

        const account = await Account.findOne({
            _id: accountId,
            userId
        });

        if (!account) {
            return res.status(404).json({
                message: "Account not found"
            });
        }
        
        const newTransaction = new Transaction({
            userId,
            accountId,
            title,
            amount,
            type: "income",
            category,
            note
        });

        await newTransaction.save();

        account.balance += amount;
        await account.save();

        res.status(201).json({
            message: "Income added successfully"
        });
    }

    catch(error){
        console.error("Error adding transaction:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const showTransaction = async (req, res) => {
    const userId = req.user.sub;
    try {
        const transactions = await Transaction.find({userId}).populate("accountId", "name").sort({ createdAt: -1 })
        .limit(25);
        if(transactions.length===0)
        {
            return res.status(404).json({message: "No transactions found"});
        }
        res.status(200).json({ message: "Transactions found", data: transactions });

    } catch (error) {
        console.error("Error showing transactions:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const deleteTransaction = async (req, res) => {
    const userId = req.user.sub;
    const transactionId = req.params.id;
    try {
        const transaction = await Transaction.findOne({ _id: transactionId, userId });
        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        const account = await Account.findById(transaction.accountId);

        if(!account){
            return res.status(404).json({ message: "Account not found" });
        }

        if (transaction.type === "expense") {
            account.balance += transaction.amount;
        } else {
            account.balance -= transaction.amount;
        }   
        await account.save();

        await Transaction.findByIdAndDelete(transactionId);

        res.status(200).json({ message: "Transaction deleted successfully" });
    } catch (error) {
        console.error("Error deleting transaction:", error);
        res.status(500).json({ message: "Server error" });
    }
};
    
module.exports = {
    addExpense,
    addIncome,
    showTransaction,
    deleteTransaction
};