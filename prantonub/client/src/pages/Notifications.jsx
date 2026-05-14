import { useState, useEffect } from "react";
import { notificationAPI } from "../api/notification";
import { useToast } from "../components/Toast";
import Spinner from "../components/Spinner";
import EmptyState from "../components/EmptyState";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(0);
  const [filter, setFilter] = useState("all"); // all, unread, budget
  const { showError, showSuccess } = useToast();

  const limit = 20;

  // Fetch notifications
  useEffect(() => {
    fetchNotifications();
  }, [page, filter]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const { data } = await notificationAPI.getNotifications(page, limit);
      let filtered = data.notifications || [];

      if (filter === "unread") {
        filtered = filtered.filter((n) => !n.read);
      } else if (filter === "budget") {
        filtered = filtered.filter((n) =>
          ["budget_warning", "budget_exceeded"].includes(n.type),
        );
      }

      setNotifications(filtered);
      setTotal(data.total || 0);
      setPages(data.pages || 0);
    } catch (err) {
      showError("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationAPI.markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) => (n._id === notificationId ? { ...n, read: true } : n)),
      );
      showSuccess("Notification marked as read");
    } catch (err) {
      showError("Failed to mark as read");
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      await notificationAPI.deleteNotification(notificationId);
      setNotifications((prev) => prev.filter((n) => n._id !== notificationId));
      showSuccess("Notification deleted");
    } catch (err) {
      showError("Failed to delete notification");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      fetchNotifications();
      showSuccess("All notifications marked as read");
    } catch (err) {
      showError("Failed to mark all as read");
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm("Delete all notifications? This cannot be undone."))
      return;
    try {
      await notificationAPI.deleteAllNotifications();
      fetchNotifications();
      showSuccess("All notifications deleted");
    } catch (err) {
      showError("Failed to delete all notifications");
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "budget_warning":
        return "⚠️";
      case "budget_exceeded":
        return "🚨";
      case "anomaly_detected":
        return "🔍";
      case "goal_achieved":
        return "🎉";
      default:
        return "📢";
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "budget_warning":
        return "bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-400";
      case "budget_exceeded":
        return "bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400";
      case "anomaly_detected":
        return "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400";
      default:
        return "bg-gray-50 dark:bg-gray-800/50";
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Notifications 🔔</h1>
          <p className="page-sub">
            {total > 0 ? `${total} total notifications` : "No notifications"}
          </p>
        </div>
        {notifications.length > 0 && (
          <div className="flex gap-2">
            <button
              onClick={handleMarkAllAsRead}
              className="btn-secondary btn-sm"
            >
              Mark all read
            </button>
            <button onClick={handleDeleteAll} className="btn-danger btn-sm">
              Delete all
            </button>
          </div>
        )}
      </div>

      {/* Filter buttons */}
      <div className="flex flex-wrap gap-2">
        {["all", "unread", "budget"].map((f) => (
          <button
            key={f}
            onClick={() => {
              setFilter(f);
              setPage(1);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === f
                ? "bg-primary-600 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Notifications list */}
      {notifications.length === 0 ? (
        <EmptyState
          icon="📭"
          title="No notifications"
          sub={
            filter === "all"
              ? "You'll get notified when budgets change or anomalies are detected"
              : `No ${filter} notifications`
          }
        />
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className={`card p-4 ${getNotificationColor(notification.type)} ${
                !notification.read ? "ring-2 ring-primary-400" : ""
              } hover:shadow-lg transition-all`}
            >
              <div className="flex gap-4">
                {/* Icon */}
                <div className="text-3xl flex-shrink-0">
                  {getNotificationIcon(notification.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">
                        {notification.title}
                      </h3>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                        {notification.message}
                      </p>
                      {notification.percentage && (
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                notification.percentage >= 100
                                  ? "bg-red-500"
                                  : notification.percentage >= 80
                                    ? "bg-amber-500"
                                    : "bg-emerald-500"
                              }`}
                              style={{
                                width: `${Math.min(notification.percentage, 100)}%`,
                              }}
                            />
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {notification.percentage}% used
                          </p>
                        </div>
                      )}
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>

                    {/* Badge */}
                    {!notification.read && (
                      <span className="flex-shrink-0 bg-primary-500 text-white text-xs font-bold px-2 py-1 rounded">
                        NEW
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 flex-shrink-0">
                  {!notification.read && (
                    <button
                      onClick={() => handleMarkAsRead(notification._id)}
                      className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors text-blue-600 dark:text-blue-400"
                      title="Mark as read"
                    >
                      ✓
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(notification._id)}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors text-red-500"
                    title="Delete"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="btn-secondary btn-sm disabled:opacity-50"
          >
            ← Previous
          </button>
          <span className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            Page {page} of {pages}
          </span>
          <button
            onClick={() => setPage(Math.min(pages, page + 1))}
            disabled={page === pages}
            className="btn-secondary btn-sm disabled:opacity-50"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
