import api from "./axios";

export const notificationAPI = {
  // Get all notifications with pagination
  getNotifications: (page = 1, limit = 20) =>
    api.get("/notifications", { params: { page, limit } }),

  // Get unread notification count
  getUnreadCount: () => api.get("/notifications/unread/count"),

  // Mark single notification as read
  markAsRead: (notificationId) =>
    api.put(`/notifications/${notificationId}/read`),

  // Mark all notifications as read
  markAllAsRead: () => api.put("/notifications/read/all"),

  // Delete single notification
  deleteNotification: (notificationId) =>
    api.delete(`/notifications/${notificationId}`),

  // Delete all notifications
  deleteAllNotifications: () => api.delete("/notifications"),
};
