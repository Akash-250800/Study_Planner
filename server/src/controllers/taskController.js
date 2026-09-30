import Task from "../models/Task.js";
import Subject from "../models/Subject.js";
import Notification from "../models/Notification.js";
import AppError from "../utils/AppError.js";

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const ensureOwnedSubject = async (subjectId, userId) => {
  const subject = await Subject.findOne({
    _id: subjectId,
    user: userId,
  });

  if (!subject) {
    throw new AppError(
      "Selected subject does not exist or does not belong to you.",
      400,
    );
  }

  return subject;
};

export const createTask = async (req, res) => {
  const {
    title,
    description = "",
    subject,
    deadline,
    priority = "medium",
    status = "pending",
  } = req.body;

  await ensureOwnedSubject(subject, req.user._id);

  const task = await Task.create({
    user: req.user._id,
    title,
    description,
    subject,
    deadline,
    priority,
    status,
    completedAt: status === "completed" ? new Date() : null,
  });

  await task.populate("subject", "name description");

  res.status(201).json({
    success: true,
    message: "Task created successfully",
    task,
  });
};

export const getTasks = async (req, res) => {
  const {
    search,
    subject,
    status,
    priority,
    deadlineFrom,
    deadlineTo,
    sortBy = "createdAt",
    order = "desc",
  } = req.query;

  const page = Math.max(Number(req.query.page) || 1, 1);

  const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);

  const filter = {
    user: req.user._id,
  };

  if (subject) {
    filter.subject = subject;
  }

  if (status) {
    filter.status = status;
  }

  if (priority) {
    filter.priority = priority;
  }

  if (search) {
    const safeSearch = escapeRegex(search.trim());

    filter.$or = [
      {
        title: {
          $regex: safeSearch,
          $options: "i",
        },
      },
      {
        description: {
          $regex: safeSearch,
          $options: "i",
        },
      },
    ];
  }

  if (deadlineFrom || deadlineTo) {
    filter.deadline = {};

    if (deadlineFrom) {
      filter.deadline.$gte = new Date(deadlineFrom);
    }

    if (deadlineTo) {
      const endDate = new Date(deadlineTo);

      if (!deadlineTo.includes("T")) {
        endDate.setHours(23, 59, 59, 999);
      }

      filter.deadline.$lte = endDate;
    }
  }

  const permittedSortFields = ["createdAt", "updatedAt", "deadline", "title"];

  const safeSortBy = permittedSortFields.includes(sortBy)
    ? sortBy
    : "createdAt";

  const sortDirection = order === "asc" ? 1 : -1;

  const total = await Task.countDocuments(filter);

  const tasks = await Task.find(filter)
    .populate("subject", "name description")
    .sort({
      [safeSortBy]: sortDirection,
    })
    .skip((page - 1) * limit)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: tasks.length,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
    tasks,
  });
};

export const getTask = async (req, res) => {
  const task = await Task.findOne({
    _id: req.params.id,
    user: req.user._id,
  }).populate("subject", "name description");

  if (!task) {
    throw new AppError("Task not found.", 404);
  }

  res.status(200).json({
    success: true,
    task,
  });
};

export const updateTask = async (req, res) => {
  const task = await Task.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!task) {
    throw new AppError("Task not found.", 404);
  }

  const { title, description, subject, deadline, priority, status } = req.body;

  if (subject !== undefined) {
    await ensureOwnedSubject(subject, req.user._id);

    task.subject = subject;
  }

  if (title !== undefined) {
    task.title = title;
  }

  if (description !== undefined) {
    task.description = description;
  }

  if (deadline !== undefined) {
    task.deadline = deadline;
  }

  if (priority !== undefined) {
    task.priority = priority;
  }

  if (status !== undefined) {
    task.status = status;

    if (status === "completed") {
      task.completedAt = task.completedAt || new Date();

      await Notification.deleteMany({
        user: req.user._id,
        task: task._id,
      });
    } else {
      task.completedAt = null;
    }
  }

  await task.save();

  await task.populate("subject", "name description");

  res.status(200).json({
    success: true,
    message: "Task updated successfully",
    task,
  });
};

export const updateTaskStatus = async (req, res) => {
  const { status } = req.body;

  const task = await Task.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!task) {
    throw new AppError("Task not found.", 404);
  }

  task.status = status;

  if (status === "completed") {
    task.completedAt = task.completedAt || new Date();

    await Notification.deleteMany({
      user: req.user._id,
      task: task._id,
    });
  } else {
    task.completedAt = null;
  }

  await task.save();

  await task.populate("subject", "name description");

  res.status(200).json({
    success: true,
    message: "Task status updated",
    task,
  });
};

export const deleteTask = async (req, res) => {
  const task = await Task.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!task) {
    throw new AppError("Task not found.", 404);
  }

  await Notification.deleteMany({
    user: req.user._id,
    task: task._id,
  });

  await task.deleteOne();

  res.status(200).json({
    success: true,
    message: "Task deleted successfully",
  });
};
