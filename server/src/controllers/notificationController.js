import Notification from "../models/Notification.js";
import AppError from "../utils/AppError.js";
import { syncDeadlineNotifications } from "../services/reminderService.js";

export const getNotifications = async (req, res) => {
  await syncDeadlineNotifications(req.user._id);

  const filter = {
    user: req.user._id,
  };

  if (req.query.unread === "true") {
    filter.read = false;
  }

  const notifications = await Notification.find(filter)
    .populate("task", "title deadline priority status")
    .sort({
      dueAt: 1,
      createdAt: -1,
    });

  const unreadCount = await Notification.countDocuments({
    user: req.user._id,
    read: false,
  });

  res.status(200).json({
    success: true,
    count: notifications.length,
    unreadCount,
    notifications,
  });
};

export const markNotificationRead = async (req, res) => {
  const notification = await Notification.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!notification) {
    throw new AppError("Notification not found.", 404);
  }

  notification.read = true;

  await notification.save();

  res.status(200).json({
    success: true,
    message: "Notification marked as read",
    notification,
  });
};

export const markAllNotificationsRead = async (req, res) => {
  await Notification.updateMany(
    {
      user: req.user._id,
      read: false,
    },
    {
      $set: {
        read: true,
      },
    },
  );

  res.status(200).json({
    success: true,
    message: "All notifications marked as read",
  });
};

export const deleteNotification = async (req, res) => {
  const notification = await Notification.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!notification) {
    throw new AppError("Notification not found.", 404);
  }

  await notification.deleteOne();

  res.status(200).json({
    success: true,
    message: "Notification deleted",
  });
};
