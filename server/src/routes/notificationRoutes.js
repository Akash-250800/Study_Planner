import express from "express";

import { param, query } from "express-validator";

import protect from "../middleware/authMiddleware.js";

import validateRequest from "../middleware/validateMiddleware.js";

import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
} from "../controllers/notificationController.js";

const router = express.Router();

router.use(protect);

router.get(
  "/",

  [
    query("unread")
      .optional()
      .isIn(["true", "false"])
      .withMessage("Unread must be true or false."),
  ],

  validateRequest,
  getNotifications,
);

router.patch("/read-all", markAllNotificationsRead);

router.patch(
  "/:id/read",

  [param("id").isMongoId().withMessage("Invalid notification ID.")],

  validateRequest,
  markNotificationRead,
);

router.delete(
  "/:id",

  [param("id").isMongoId().withMessage("Invalid notification ID.")],

  validateRequest,
  deleteNotification,
);

export default router;
