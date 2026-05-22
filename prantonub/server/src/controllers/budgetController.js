const Budget = require("../models/Budget");
const Transaction = require("../models/Transaction");

const getAll = async (req, res) => {
  try {
    const now = new Date();
    const month = Number(req.query.month) || now.getMonth()+1;
    const year  = Number(req.query.year)  || now.getFullYear();
    const budgets = await Budget.find({ user:req.user._id, month, year });

    // Attach spent amount per category
    const start = new Date(year, month-1, 1);
    const end   = new Date(year, month, 0, 23, 59, 59);
    const spent = await Transaction.aggregate([
      { $match: { user:req.user._id, type:"expense", date:{$gte:start,$lte:end} } },
      { $group: { _id:"$category", total:{$sum:"$amount"} } },
    ]);
    const spentMap = Object.fromEntries(spent.map(s => [s._id, s.total]));

    const result = budgets.map(b => ({
      ...b.toObject(),
      spent: spentMap[b.category] || 0,
      percentage: Math.round(((spentMap[b.category]||0)/b.amount)*100),
    }));

    res.json({ success:true, budgets:result, month, year });
  } catch (err) { res.status(500).json({ success:false, error:err.message }); }
};

const upsert = async (req, res) => {
  try {
    const { category, amount, month, year } = req.body;
    if (!category||!amount) return res.status(400).json({ success:false, error:"Category and amount required" });
    const now = new Date();
    const m = month || now.getMonth()+1;
    const y = year  || now.getFullYear();
    const budget = await Budget.findOneAndUpdate(
      { user:req.user._id, category, month:m, year:y },
      { amount:Number(amount) },
      { upsert:true, new:true }
    );
    res.json({ success:true, budget });
  } catch (err) { res.status(500).json({ success:false, error:err.message }); }
};

const remove = async (req, res) => {
  try {
    await Budget.findOneAndDelete({ _id:req.params.id, user:req.user._id });
    res.json({ success:true, message:"Budget deleted" });
  } catch (err) { res.status(500).json({ success:false, error:err.message }); }
};

module.exports = { getAll, upsert, remove };
