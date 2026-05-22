const Transaction = require("../models/Transaction");
const {
  validateAmount,
  validateString,
  validateArrayItems,
  validateTransactionType,
  validateDate,
  sanitizeString,
} = require("../utils/validators");
const { AppError, asyncHandler } = require("../middleware/errorHandler");
const notificationService = require("../utils/notificationService");

const VALID_CATEGORIES = [
  "Food & Dining",
  "Transportation",
  "Shopping",
  "Bills & Utilities",
  "Healthcare",
  "Entertainment",
  "Education",
  "Travel",
  "Savings",
  "Salary",
  "Other",
];

const getAll = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 15,
    category,
    type,
    search,
    startDate,
    endDate,
    sort = "-date",
  } = req.query;

  // Validate pagination
  const pageNum = Math.max(1, Math.min(parseInt(page) || 1, 1000));
  const limitNum = Math.max(1, Math.min(parseInt(limit) || 15, 100));

  const filter = { user: req.user._id };

  if (category && category !== "All") {
    if (!VALID_CATEGORIES.includes(category)) {
      throw new AppError("Invalid category", 400);
    }
    filter.category = category;
  }

  if (type && type !== "All") {
    if (!validateTransactionType(type)) {
      throw new AppError("Invalid transaction type", 400);
    }
    filter.type = type;
  }

  if (search) {
    if (!validateString(search, 1, 100)) {
      throw new AppError("Search term must be 1-100 characters", 400);
    }
    filter.title = {
      $regex: search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      $options: "i",
    };
  }

  if (startDate || endDate) {
    filter.date = {};
    if (startDate) {
      if (!validateDate(startDate))
        throw new AppError("Invalid start date", 400);
      filter.date.$gte = new Date(startDate);
    }
    if (endDate) {
      if (!validateDate(endDate)) throw new AppError("Invalid end date", 400);
      const e = new Date(endDate);
      e.setHours(23, 59, 59, 999);
      filter.date.$lte = e;
    }
  }

  const total = await Transaction.countDocuments(filter);
  const transactions = await Transaction.find(filter)
    .sort(sort)
    .skip((pageNum - 1) * limitNum)
    .limit(limitNum);

  res.json({
    success: true,
    transactions,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
  });
});

const create = asyncHandler(async (req, res) => {
  const { title, amount, category, type, date, note, tags } = req.body;

  // Validation
  if (!validateString(title, 1, 200)) {
    throw new AppError("Title must be 1-200 characters", 400);
  }

  if (!validateAmount(amount)) {
    throw new AppError("Amount must be a positive number", 400);
  }

  if (!VALID_CATEGORIES.includes(category)) {
    throw new AppError("Invalid category", 400);
  }

  if (!validateTransactionType(type)) {
    throw new AppError("Invalid transaction type", 400);
  }

  if (date && !validateDate(date)) {
    throw new AppError("Invalid date format", 400);
  }

  if (note && !validateString(note, 0, 500)) {
    throw new AppError("Note must be 0-500 characters", 400);
  }

  if (tags && !validateArrayItems(tags, 10)) {
    throw new AppError("Tags must be array with max 10 items", 400);
  }

  const transaction = await Transaction.create({
    user: req.user._id,
    title: sanitizeString(title),
    amount: Number(amount),
    category,
    type,
    date: date ? new Date(date) : new Date(),
    note: note ? sanitizeString(note) : "",
    tags: tags || [],
  });

  // Trigger notifications if it's an expense
  if (type === "expense") {
    const txnDate = date ? new Date(date) : new Date();
    notificationService.checkBudgetThreshold(
      req.user._id,
      category,
      txnDate.getMonth() + 1,
      txnDate.getFullYear(),
    );
    notificationService.detectAnomaly(req.user._id, category, Number(amount));
  }

  res.status(201).json({ success: true, transaction });
});

const update = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!transaction) {
    throw new AppError("Transaction not found", 404);
  }

  const { title, amount, category, type, date, note, tags } = req.body;

  // Validate updates (all optional)
  if (title !== undefined && !validateString(title, 1, 200)) {
    throw new AppError("Title must be 1-200 characters", 400);
  }

  if (amount !== undefined && !validateAmount(amount)) {
    throw new AppError("Amount must be a positive number", 400);
  }

  if (category !== undefined && !VALID_CATEGORIES.includes(category)) {
    throw new AppError("Invalid category", 400);
  }

  if (type !== undefined && !validateTransactionType(type)) {
    throw new AppError("Invalid transaction type", 400);
  }

  if (date !== undefined && !validateDate(date)) {
    throw new AppError("Invalid date format", 400);
  }

  if (note !== undefined && !validateString(note, 0, 500)) {
    throw new AppError("Note must be 0-500 characters", 400);
  }

  if (tags !== undefined && !validateArrayItems(tags, 10)) {
    throw new AppError("Tags must be array with max 10 items", 400);
  }

  // Update fields
  if (title !== undefined) transaction.title = sanitizeString(title);
  if (amount !== undefined) transaction.amount = Number(amount);
  if (category !== undefined) transaction.category = category;
  if (type !== undefined) transaction.type = type;
  if (date !== undefined) transaction.date = new Date(date);
  if (note !== undefined) transaction.note = sanitizeString(note);
  if (tags !== undefined) transaction.tags = tags;

  await transaction.save();

  // Trigger notifications if it's an expense
  if (transaction.type === "expense") {
    notificationService.checkBudgetThreshold(
      req.user._id,
      transaction.category,
      transaction.date.getMonth() + 1,
      transaction.date.getFullYear(),
    );
    notificationService.detectAnomaly(
      req.user._id,
      transaction.category,
      transaction.amount,
    );
  }

  res.json({ success: true, transaction });
});

const remove = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!transaction) {
    throw new AppError("Transaction not found", 404);
  }

  res.json({ success: true, message: "Transaction deleted successfully" });
});

const getSummary = asyncHandler(async (req, res) => {
  const uid = req.user._id;
  const now = new Date();
  const som = new Date(now.getFullYear(), now.getMonth(), 1);
  const solm = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const eolm = new Date(now.getFullYear(), now.getMonth(), 0);
  const six = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  const [
    incomeThis,
    expenseThis,
    incomeLast,
    expenseLast,
    catBreakdown,
    monthlyTrend,
    recent,
  ] = await Promise.all([
    Transaction.aggregate([
      { $match: { user: uid, type: "income", date: { $gte: som } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    Transaction.aggregate([
      { $match: { user: uid, type: "expense", date: { $gte: som } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    Transaction.aggregate([
      {
        $match: { user: uid, type: "income", date: { $gte: solm, $lte: eolm } },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    Transaction.aggregate([
      {
        $match: {
          user: uid,
          type: "expense",
          date: { $gte: solm, $lte: eolm },
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    Transaction.aggregate([
      { $match: { user: uid, type: "expense", date: { $gte: som } } },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ]),
    Transaction.aggregate([
      { $match: { user: uid, date: { $gte: six } } },
      {
        $group: {
          _id: { y: { $year: "$date" }, m: { $month: "$date" }, type: "$type" },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.y": 1, "_id.m": 1 } },
    ]),
    Transaction.find({ user: uid }).sort("-date").limit(5),
  ]);

  res.json({
    success: true,
    summary: {
      thisMonth: {
        income: incomeThis[0]?.total || 0,
        expense: expenseThis[0]?.total || 0,
      },
      lastMonth: {
        income: incomeLast[0]?.total || 0,
        expense: expenseLast[0]?.total || 0,
      },
      categoryBreakdown: catBreakdown,
      monthlyTrend,
      recentTransactions: recent,
    },
  });
});

module.exports = { getAll, create, update, remove, getSummary };
