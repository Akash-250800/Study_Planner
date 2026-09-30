import express from "express";
import { body } from "express-validator";

import { register, login, logout } from "../controllers/authController.js";

import protect from "../middleware/authMiddleware.js";

import validateRequest from "../middleware/validateMiddleware.js";

const router = express.Router();

router.post(
  "/register",

  [
    body("name")
      .trim()
      .isLength({
        min: 2,
        max: 60,
      })
      .withMessage("Name must contain between 2 and 60 characters."),

    body("email")
      .trim()
      .isEmail()
      .withMessage("Please enter a valid email address.")
      .normalizeEmail(),

    body("password")
      .isLength({
        min: 8,
        max: 128,
      })
      .withMessage("Password must contain at least 8 characters.")
      .matches(/[a-z]/)
      .withMessage("Password must contain a lowercase letter.")
      .matches(/[A-Z]/)
      .withMessage("Password must contain an uppercase letter.")
      .matches(/[0-9]/)
      .withMessage("Password must contain a number."),
  ],

  validateRequest,
  register,
);

router.post(
  "/login",

  [
    body("email")
      .trim()
      .isEmail()
      .withMessage("Please enter a valid email address.")
      .normalizeEmail(),

    body("password").notEmpty().withMessage("Password is required."),
  ],

  validateRequest,
  login,
);

router.post("/logout", protect, logout);

export default router;
