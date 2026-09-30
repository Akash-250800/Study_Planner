import User from "../models/User.js";
import AppError from "../utils/AppError.js";
import generateToken from "../utils/generateToken.js";

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({
    email,
  });

  if (existingUser) {
    throw new AppError("An account with this email already exists.", 409);
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  const token = generateToken(user);

  res.status(201).json({
    success: true,
    message: "Account created successfully",
    token,
    user: publicUser(user),
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    email,
  }).select("+password +tokenVersion");

  if (!user) {
    throw new AppError("Invalid email or password.", 401);
  }

  const passwordMatches = await user.comparePassword(password);

  if (!passwordMatches) {
    throw new AppError("Invalid email or password.", 401);
  }

  const token = generateToken(user);

  res.status(200).json({
    success: true,
    message: "Logged in successfully",
    token,
    user: publicUser(user),
  });
};

export const logout = async (req, res) => {
  res.status(200).json({
    success: true,
    message:
      "Logged out successfully. Remove the stored token from the client.",
  });
};
