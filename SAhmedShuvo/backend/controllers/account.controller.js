const User = require("../models/user.model");
const Account = require("../models/account.model");
const moment = require("moment");


const addAccount = async (req, res) => {
    const { name, type} = req.body;
   
    const userId = req.user.sub;
    try {
        if (!name || !type) {
            return res.status(400).json({ message: "Name and type are required" });
        }
        const newAccount = new Account({name, type, userId});
        await newAccount.save();
        res.status(201).json({ message: "Account added successfully" });
    } catch (error) {
        console.error("Error adding account:", error);
        res.status(500).json({ message: "Server error" });
    }
};
const showAccount = async (req, res) => {
   console.log("hello");
    const userId = req.user.sub;
    try {
        const accounts = await Account.find({userId});
        if(accounts.length===0)
        {
            return res.status(404).json({message: "No accounts found"});
        }
        res.status(200).json({ message: "Accounts found", data: accounts });
    } catch (error) {
        console.error("Error showing accounts:", error);
        res.status(500).json({ message: "Server error" });
    }
};
const balanceTransfer = async (req, res) => {
    const {from, to, amount} = req.body;
    const userId = req.user.sub;
    try {
        if(!from || !to || !amount){
            return res.status(400).json({message: "All fields are required"});
        }
        if(from===to){
            return res.status(400).json({message: "Cannot transfer to same account"});
        }
        const fromAccount = await Account.findOne({_id: from, userId});
        const toAccount = await Account.findOne({_id: to, userId});
        if(!fromAccount || !toAccount){
            return res.status(404).json({message: "One or both accounts not found"});
        }
        if(fromAccount.balance < amount){
            return res.status(400).json({message: "Insufficient balance in source account"});
        }
        fromAccount.balance -= amount;
        toAccount.balance += amount;
        await fromAccount.save();
        await toAccount.save();
        res.status(200).json({message: "Balance transferred successfully"});
    } catch (error) {
        console.error("Error transferring balance:", error);
        res.status(500).json({message: error.message});
    }
}
const deleteAccount = async (req, res) => {
    const {id} = req.params;
    const userId = req.user.sub;
    try {
        const account = await Account.findOne({_id: id, userId});
        if(!account){
            return res.status(404).json({message: "Account not found"});
        }
        if(account.balance > 0){
            return res.status(400).json({message: "Cannot delete account with balance"});
        };
        await account.deleteOne();
        res.status(200).json({message: "Account deleted successfully"});
    } catch (error) {
        console.error("Error deleting account:", error);
        res.status(500).json({message: error.message});
    }
}





module.exports = {
    addAccount,
    showAccount,
    balanceTransfer,
    deleteAccount,
};

