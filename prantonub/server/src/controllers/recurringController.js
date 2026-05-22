const Recurring = require("../models/Recurring");
const Transaction = require("../models/Transaction");

const getAll = async (req, res) => {
  try {
    const items = await Recurring.find({ user:req.user._id }).sort("-createdAt");
    res.json({ success:true, recurring:items });
  } catch (err) { res.status(500).json({ success:false, error:err.message }); }
};

const create = async (req, res) => {
  try {
    const { title, amount, category, type, frequency, startDate, note } = req.body;
    if (!title||!amount||!category||!type||!frequency)
      return res.status(400).json({ success:false, error:"All fields required" });
    const item = await Recurring.create({ user:req.user._id, title, amount:Number(amount), category, type, frequency, startDate:startDate?new Date(startDate):new Date(), note:note||"" });
    res.status(201).json({ success:true, recurring:item });
  } catch (err) { res.status(500).json({ success:false, error:err.message }); }
};

const update = async (req, res) => {
  try {
    const item = await Recurring.findOneAndUpdate({ _id:req.params.id, user:req.user._id }, req.body, { new:true });
    if (!item) return res.status(404).json({ success:false, error:"Not found" });
    res.json({ success:true, recurring:item });
  } catch (err) { res.status(500).json({ success:false, error:err.message }); }
};

const remove = async (req, res) => {
  try {
    await Recurring.findOneAndDelete({ _id:req.params.id, user:req.user._id });
    res.json({ success:true, message:"Deleted" });
  } catch (err) { res.status(500).json({ success:false, error:err.message }); }
};

const toggle = async (req, res) => {
  try {
    const item = await Recurring.findOne({ _id:req.params.id, user:req.user._id });
    if (!item) return res.status(404).json({ success:false, error:"Not found" });
    item.isActive = !item.isActive;
    await item.save();
    res.json({ success:true, recurring:item });
  } catch (err) { res.status(500).json({ success:false, error:err.message }); }
};

module.exports = { getAll, create, update, remove, toggle };
