const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const Budget = require("../models/Budget");
const Recurring = require("../models/Recurring");

const getProfile = async (req, res) => res.json({ success:true, user:req.user });

const updateProfile = async (req, res) => {
  try {
    const { name, currency, monthlyBudget, theme } = req.body;
    const user = await User.findById(req.user._id);
    if (name) user.name=name;
    if (currency) user.currency=currency;
    if (monthlyBudget!==undefined) user.monthlyBudget=Number(monthlyBudget);
    if (theme) user.theme=theme;
    await user.save();
    res.json({ success:true, user:{ id:user._id, name:user.name, email:user.email, avatar:user.avatar, currency:user.currency, monthlyBudget:user.monthlyBudget, theme:user.theme } });
  } catch (err) { res.status(500).json({ success:false, error:err.message }); }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    if (user.passwordHash==="google-oauth")
      return res.status(400).json({ success:false, error:"Google accounts cannot change password" });
    if (!await bcrypt.compare(currentPassword, user.passwordHash))
      return res.status(400).json({ success:false, error:"Current password incorrect" });
    if (newPassword.length<6) return res.status(400).json({ success:false, error:"Min 6 characters" });
    user.passwordHash = await bcrypt.hash(newPassword, 12);
    await user.save();
    res.json({ success:true, message:"Password updated" });
  } catch (err) { res.status(500).json({ success:false, error:err.message }); }
};

const deleteAccount = async (req, res) => {
  try {
    const uid = req.user._id;
    await Promise.all([
      Transaction.deleteMany({ user:uid }),
      Budget.deleteMany({ user:uid }),
      Recurring.deleteMany({ user:uid }),
      User.findByIdAndDelete(uid),
    ]);
    res.json({ success:true, message:"Account deleted" });
  } catch (err) { res.status(500).json({ success:false, error:err.message }); }
};

module.exports = { getProfile, updateProfile, changePassword, deleteAccount };
