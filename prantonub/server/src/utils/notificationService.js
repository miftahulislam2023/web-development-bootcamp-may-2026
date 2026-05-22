const Notification = require("../models/Notification");
const Budget = require("../models/Budget");
const Transaction = require("../models/Transaction");

/**
 * Check if budget thresholds are exceeded and create notifications
 * @param {ObjectId} userId - User ID
 * @param {String} category - Transaction category
 * @param {Number} month - Month (1-12)
 * @param {Number} year - Year
 */
const checkBudgetThreshold = async (userId, category, month, year) => {
  try {
    // Find budget for this category and month
    const budget = await Budget.findOne({
      user: userId,
      category: category,
      month: month,
      year: year,
    });

    if (!budget) return; // No budget set for this category

    // Calculate spending for this month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    endDate.setHours(23, 59, 59, 999);

    const spending = await Transaction.aggregate([
      {
        $match: {
          user: userId,
          category: category,
          type: "expense",
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    const spent = spending[0]?.total || 0;
    const budgetAmount = budget.amount;
    const percentage = Math.round((spent / budgetAmount) * 100);

    // Check if notification already exists for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingNotification = await Notification.findOne({
      user: userId,
      type: { $in: ["budget_warning", "budget_exceeded"] },
      category: category,
      createdAt: { $gte: today },
    });

    if (existingNotification) return; // Already notified today

    // Create notification based on threshold
    if (percentage >= 100) {
      // Budget exceeded
      await Notification.create({
        user: userId,
        type: "budget_exceeded",
        category: category,
        title: `Budget Exceeded: ${category}`,
        message: `You've exceeded your ${category} budget by $${(spent - budgetAmount).toFixed(2)}`,
        percentage: percentage,
        amount: spent,
        actionUrl: `/budgets`,
      });
    } else if (percentage >= 80) {
      // Budget warning at 80%
      await Notification.create({
        user: userId,
        type: "budget_warning",
        category: category,
        title: `Budget Warning: ${category}`,
        message: `You're at ${percentage}% of your ${category} budget. $${(budgetAmount - spent).toFixed(2)} remaining.`,
        percentage: percentage,
        amount: spent,
        actionUrl: `/budgets`,
      });
    }
  } catch (err) {
    console.error("Error checking budget threshold:", err);
  }
};

/**
 * Detect anomalous transactions
 * @param {ObjectId} userId - User ID
 * @param {String} category - Transaction category
 * @param {Number} amount - Transaction amount
 */
const detectAnomaly = async (userId, category, amount) => {
  try {
    // Get last 6 months of transactions in this category
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const transactions = await Transaction.find({
      user: userId,
      category: category,
      type: "expense",
      date: { $gte: sixMonthsAgo },
    });

    if (transactions.length < 3) return; // Not enough data

    // Calculate average and standard deviation
    const amounts = transactions.map((t) => t.amount);
    const avg = amounts.reduce((a, b) => a + b) / amounts.length;

    const variance =
      amounts.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) /
      amounts.length;
    const stdDev = Math.sqrt(variance);

    // Z-score calculation
    const zScore = (amount - avg) / stdDev;

    // Flag if transaction is more than 2.5 standard deviations away
    if (Math.abs(zScore) > 2.5) {
      const existingNotification = await Notification.findOne({
        user: userId,
        type: "anomaly_detected",
        category: category,
        createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }, // Last 24 hours
      });

      if (!existingNotification) {
        await Notification.create({
          user: userId,
          type: "anomaly_detected",
          category: category,
          title: `Unusual Spending: ${category}`,
          message: `Your ${category} transaction of $${amount.toFixed(2)} is ${Math.round(
            Math.abs(zScore),
          )}x your usual amount.`,
          amount: amount,
          actionUrl: `/transactions`,
        });
      }
    }
  } catch (err) {
    console.error("Error detecting anomaly:", err);
  }
};

/**
 * Mark notification as read
 * @param {ObjectId} notificationId - Notification ID
 */
const markAsRead = async (notificationId) => {
  return await Notification.findByIdAndUpdate(
    notificationId,
    { read: true },
    { new: true },
  );
};

/**
 * Mark all notifications as read for a user
 * @param {ObjectId} userId - User ID
 */
const markAllAsRead = async (userId) => {
  return await Notification.updateMany({ user: userId }, { read: true });
};

/**
 * Delete notification
 * @param {ObjectId} notificationId - Notification ID
 */
const deleteNotification = async (notificationId) => {
  return await Notification.findByIdAndDelete(notificationId);
};

/**
 * Get user notifications with pagination
 * @param {ObjectId} userId - User ID
 * @param {Number} page - Page number
 * @param {Number} limit - Items per page
 */
const getUserNotifications = async (userId, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;

  const [notifications, total] = await Promise.all([
    Notification.find({ user: userId })
      .sort("-createdAt")
      .skip(skip)
      .limit(limit),
    Notification.countDocuments({ user: userId }),
  ]);

  return {
    notifications,
    total,
    page,
    pages: Math.ceil(total / limit),
  };
};

/**
 * Get unread notification count
 * @param {ObjectId} userId - User ID
 */
const getUnreadCount = async (userId) => {
  return await Notification.countDocuments({ user: userId, read: false });
};

module.exports = {
  checkBudgetThreshold,
  detectAnomaly,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUserNotifications,
  getUnreadCount,
};
