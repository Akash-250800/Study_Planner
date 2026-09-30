import User from "../models/User.js";
import Task from "../models/Task.js";
import Subject from "../models/Subject.js";
import Notification from "../models/Notification.js";

import AppError from "../utils/AppError.js";
import generateToken from "../utils/generateToken.js";

export const getProfile = async (req, res) => {
  res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      createdAt: req.user.createdAt,
      updatedAt: req.user.updatedAt,
    },
  });
};

export const updateProfile = async (req, res) => {
  const { name, email } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    throw new AppError("User not found.", 404);
  }

  if (email && email !== user.email) {
    const existing = await User.findOne({
      email,
      _id: {
        $ne: user._id,
      },
    });

    if (existing) {
      throw new AppError("This email is already being used.", 409);
    }

    user.email = email;
  }

  if (name !== undefined) {
    user.name = name;
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      updatedAt: user.updatedAt,
    },
  });
};

export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select(
    "+password +tokenVersion",
  );

  if (!user) {
    throw new AppError("User not found.", 404);
  }

  const matches = await user.comparePassword(currentPassword);

  if (!matches) {
    throw new AppError("Current password is incorrect.", 401);
  }

  user.password = newPassword;

  user.tokenVersion += 1;

  await user.save();

  const newToken = generateToken(user);

  res.status(200).json({
    success: true,
    message:
      "Password changed successfully. Previous sessions have been invalidated.",
    token: newToken,
  });
};

export const deleteAccount = async (req, res) => {
  const userId = req.user._id;

  await Notification.deleteMany({
    user: userId,
  });

  await Task.deleteMany({
    user: userId,
  });

  await Subject.deleteMany({
    user: userId,
  });

  await User.findByIdAndDelete(userId);

  res.status(200).json({
    success: true,
    message: "Account deleted successfully",
  });
};
