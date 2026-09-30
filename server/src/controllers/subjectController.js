import Subject from "../models/Subject.js";
import Task from "../models/Task.js";
import AppError from "../utils/AppError.js";

const escapeRegex = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const getSubjects = async (req, res) => {
  const subjects = await Subject.find({
    user: req.user._id
  }).sort({
    name: 1
  });

  res.status(200).json({
    success: true,
    count: subjects.length,
    subjects
  });
};

export const getSubject = async (req, res) => {
  const subject = await Subject.findOne({
    _id: req.params.id,
    user: req.user._id
  });

  if (!subject) {
    throw new AppError("Subject not found.", 404);
  }

  res.status(200).json({
    success: true,
    subject
  });
};

export const createSubject = async (req, res) => {
  const {
    name,
    description = ""
  } = req.body;

  const existingSubject = await Subject.findOne({
    user: req.user._id,
    name: {
      $regex: `^${escapeRegex(name)}$`,
      $options: "i"
    }
  });

  if (existingSubject) {
    throw new AppError(
      "A subject with this name already exists.",
      409
    );
  }

  const subject = await Subject.create({
    user: req.user._id,
    name,
    description
  });

  res.status(201).json({
    success: true,
    message: "Subject created successfully",
    subject
  });
};

export const updateSubject = async (req, res) => {
  const subject = await Subject.findOne({
    _id: req.params.id,
    user: req.user._id
  });

  if (!subject) {
    throw new AppError("Subject not found.", 404);
  }

  const {
    name,
    description
  } = req.body;

  if (
    name !== undefined &&
    name.toLowerCase() !== subject.name.toLowerCase()
  ) {
    const existing = await Subject.findOne({
      user: req.user._id,
      _id: {
        $ne: subject._id
      },
      name: {
        $regex: `^${escapeRegex(name)}$`,
        $options: "i"
      }
    });

    if (existing) {
      throw new AppError(
        "A subject with this name already exists.",
        409
      );
    }

    subject.name = name;
  }

  if (description !== undefined) {
    subject.description = description;
  }

  await subject.save();

  res.status(200).json({
    success: true,
    message: "Subject updated successfully",
    subject
  });
};

export const deleteSubject = async (req, res) => {
  const subject = await Subject.findOne({
    _id: req.params.id,
    user: req.user._id
  });

  if (!subject) {
    throw new AppError("Subject not found.", 404);
  }

  const taskExists = await Task.exists({
    user: req.user._id,
    subject: subject._id
  });

  if (taskExists) {
    throw new AppError(
      "This subject cannot be deleted because tasks are currently assigned to it.",
      409
    );
  }

  await subject.deleteOne();

  res.status(200).json({
    success: true,
    message: "Subject deleted successfully"
  });
};