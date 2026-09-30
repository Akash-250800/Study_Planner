import jwt from "jsonwebtoken";
import User from "../models/User.js";
import AppError from "../utils/AppError.js";

const protect = async (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new AppError("Authentication required. Please log in.", 401);
  }

  const token = authorization.split(" ")[1];

  if (!token) {
    throw new AppError("Authentication token is missing.", 401);
  }

  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET, {
      issuer: "study-planner-api",
      audience: "study-planner-client",
    });
  } catch {
    throw new AppError("Invalid or expired authentication token.", 401);
  }

  const user = await User.findById(decoded.id).select("+tokenVersion");

  if (!user) {
    throw new AppError(
      "The account associated with this token no longer exists.",
      401,
    );
  }

  if (decoded.tokenVersion !== user.tokenVersion) {
    throw new AppError(
      "Your session is no longer valid. Please log in again.",
      401,
    );
  }

  req.user = user;

  next();
};

export default protect;
