const Notification = require("../models/Notification");
const notificationService = require("../utils/notificationService");
const { asyncHandler, AppError } = require("../middleware/errorHandler");

/**
 * Get all notifications for user
 */
const getNotifications = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;

  const result = await notificationService.getUserNotifications(
    req.user._id,
    parseInt(page),
    parseInt(limit),
  );

  res.json({ success: true, ...result });
});

/**
 * Get unread notification count
 */
const getUnreadCount = asyncHandler(async (req, res) => {
  const count = await notificationService.getUnreadCount(req.user._id);
  res.json({ success: true, count });
});

/**
 * Mark notification as read
 */
const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!notification) {
    throw new AppError("Notification not found", 404);
  }

  const updated = await notificationService.markAsRead(req.params.id);
  res.json({ success: true, notification: updated });
});

/**
 * Mark all notifications as read
 */
const markAllAsRead = asyncHandler(async (req, res) => {
  await notificationService.markAllAsRead(req.user._id);
  res.json({ success: true, message: "All notifications marked as read" });
});

/**
 * Delete notification
 */
const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!notification) {
    throw new AppError("Notification not found", 404);
  }

  await notificationService.deleteNotification(req.params.id);
  res.json({ success: true, message: "Notification deleted" });
});

/**
 * Delete all notifications for user
 */
const deleteAllNotifications = asyncHandler(async (req, res) => {
  await Notification.deleteMany({ user: req.user._id });
  res.json({ success: true, message: "All notifications deleted" });
});

module.exports = {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
};
