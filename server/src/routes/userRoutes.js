import express from "express";
import { body } from "express-validator";

import protect from "../middleware/authMiddleware.js";
import validateRequest from "../middleware/validateMiddleware.js";

import {
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
} from "../controllers/userController.js";

const router = express.Router();

router.use(protect);

router.get("/profile", getProfile);

router.put(
  "/profile",

  [
    body("name")
      .optional()
      .trim()
      .isLength({
        min: 2,
        max: 60,
      })
      .withMessage("Name must contain between 2 and 60 characters."),

    body("email")
      .optional()
      .trim()
      .isEmail()
      .withMessage("Please enter a valid email address.")
      .normalizeEmail(),
  ],

  validateRequest,
  updateProfile,
);

router.put(
  "/password",

  [
    body("currentPassword")
      .notEmpty()
      .withMessage("Current password is required."),

    body("newPassword")
      .isLength({
        min: 8,
        max: 128,
      })
      .withMessage("New password must contain at least 8 characters.")
      .matches(/[a-z]/)
      .withMessage("New password must contain a lowercase letter.")
      .matches(/[A-Z]/)
      .withMessage("New password must contain an uppercase letter.")
      .matches(/[0-9]/)
      .withMessage("New password must contain a number."),
  ],

  validateRequest,
  changePassword,
);

router.delete("/account", deleteAccount);

export default router;
