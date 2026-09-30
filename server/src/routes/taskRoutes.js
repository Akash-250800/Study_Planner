import express from "express";

import { body, param, query } from "express-validator";

import protect from "../middleware/authMiddleware.js";

import validateRequest from "../middleware/validateMiddleware.js";

import {
  createTask,
  getTasks,
  getTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
} from "../controllers/taskController.js";

const router = express.Router();

router.use(protect);

const taskFields = [
  body("title")
    .trim()
    .isLength({
      min: 2,
      max: 120,
    })
    .withMessage("Task title must contain between 2 and 120 characters."),

  body("description")
    .optional()
    .trim()
    .isLength({
      max: 1000,
    })
    .withMessage("Description cannot exceed 1000 characters."),

  body("subject").isMongoId().withMessage("A valid subject ID is required."),

  body("deadline")
    .isISO8601()
    .withMessage("A valid deadline is required.")
    .toDate(),

  body("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Priority must be low, medium, or high."),

  body("status")
    .optional()
    .isIn(["pending", "completed"])
    .withMessage("Status must be pending or completed."),
];

const optionalTaskFields = [
  body("title")
    .optional()
    .trim()
    .isLength({
      min: 2,
      max: 120,
    })
    .withMessage("Task title must contain between 2 and 120 characters."),

  body("description")
    .optional()
    .trim()
    .isLength({
      max: 1000,
    })
    .withMessage("Description cannot exceed 1000 characters."),

  body("subject").optional().isMongoId().withMessage("Invalid subject ID."),

  body("deadline")
    .optional()
    .isISO8601()
    .withMessage("Deadline must be a valid date.")
    .toDate(),

  body("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Priority must be low, medium, or high."),

  body("status")
    .optional()
    .isIn(["pending", "completed"])
    .withMessage("Status must be pending or completed."),
];

router
  .route("/")
  .get(
    [
      query("subject")
        .optional()
        .isMongoId()
        .withMessage("Invalid subject filter."),

      query("status")
        .optional()
        .isIn(["pending", "completed"])
        .withMessage("Invalid task status."),

      query("priority")
        .optional()
        .isIn(["low", "medium", "high"])
        .withMessage("Invalid priority."),

      query("deadlineFrom")
        .optional()
        .isISO8601()
        .withMessage("Invalid starting deadline."),

      query("deadlineTo")
        .optional()
        .isISO8601()
        .withMessage("Invalid ending deadline."),

      query("page")
        .optional()
        .isInt({
          min: 1,
        })
        .withMessage("Page must be at least 1."),

      query("limit")
        .optional()
        .isInt({
          min: 1,
          max: 100,
        })
        .withMessage("Limit must be between 1 and 100."),

      query("sortBy")
        .optional()
        .isIn(["createdAt", "updatedAt", "deadline", "title"])
        .withMessage("Invalid sort field."),

      query("order")
        .optional()
        .isIn(["asc", "desc"])
        .withMessage("Order must be asc or desc."),
    ],

    validateRequest,
    getTasks,
  )

  .post(taskFields, validateRequest, createTask);

router.patch(
  "/:id/status",

  [
    param("id").isMongoId().withMessage("Invalid task ID."),

    body("status")
      .isIn(["pending", "completed"])
      .withMessage("Status must be pending or completed."),
  ],

  validateRequest,
  updateTaskStatus,
);

router
  .route("/:id")

  .get(
    [param("id").isMongoId().withMessage("Invalid task ID.")],

    validateRequest,
    getTask,
  )

  .put(
    [
      param("id").isMongoId().withMessage("Invalid task ID."),

      ...optionalTaskFields,
    ],

    validateRequest,
    updateTask,
  )

  .delete(
    [param("id").isMongoId().withMessage("Invalid task ID.")],

    validateRequest,
    deleteTask,
  );

export default router;
