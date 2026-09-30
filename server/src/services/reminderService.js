import Task from "../models/Task.js";
import Notification from "../models/Notification.js";

export const syncDeadlineNotifications = async (userId) => {
  const now = new Date();

  const reminderWindow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

  const upcomingTasks = await Task.find({
    user: userId,
    status: "pending",
    deadline: {
      $gte: now,
      $lte: reminderWindow,
    },
  }).select("_id title deadline");

  const activeTaskIds = upcomingTasks.map((task) => task._id);

  await Promise.all(
    upcomingTasks.map((task) =>
      Notification.findOneAndUpdate(
        {
          user: userId,
          task: task._id,
          type: "deadline",
        },
        {
          $set: {
            message: `Task "${task.title}" is due soon.`,
            dueAt: task.deadline,
          },
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        },
      ),
    ),
  );

  if (activeTaskIds.length > 0) {
    await Notification.deleteMany({
      user: userId,
      type: "deadline",
      task: {
        $nin: activeTaskIds,
      },
    });
  } else {
    await Notification.deleteMany({
      user: userId,
      type: "deadline",
    });
  }
};
