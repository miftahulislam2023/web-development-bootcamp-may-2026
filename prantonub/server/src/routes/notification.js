const router = require("express").Router();
const { protect } = require("../middleware/auth");
const {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
} = require("../controllers/notificationController");

// All routes require authentication
router.use(protect);

// Get notifications with pagination
router.get("/", getNotifications);

// Get unread count
router.get("/unread/count", getUnreadCount);

// Mark notification as read
router.put("/:id/read", markAsRead);

// Mark all as read
router.put("/read/all", markAllAsRead);

// Delete notification
router.delete("/:id", deleteNotification);

// Delete all notifications
router.delete("/", deleteAllNotifications);

module.exports = router;
