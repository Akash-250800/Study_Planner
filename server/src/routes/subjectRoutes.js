import express from "express";

import { body, param } from "express-validator";

import protect from "../middleware/authMiddleware.js";

import validateRequest from "../middleware/validateMiddleware.js";

import {
  getSubjects,
  getSubject,
  createSubject,
  updateSubject,
  deleteSubject,
} from "../controllers/subjectController.js";

const router = express.Router();

router.use(protect);

router
  .route("/")
  .get(getSubjects)
  .post(
    [
      body("name")
        .trim()
        .isLength({
          min: 2,
          max: 80,
        })
        .withMessage("Subject name must contain between 2 and 80 characters."),

      body("description")
        .optional()
        .trim()
        .isLength({
          max: 500,
        })
        .withMessage("Description cannot exceed 500 characters."),
    ],

    validateRequest,
    createSubject,
  );

router
  .route("/:id")
  .get(
    [param("id").isMongoId().withMessage("Invalid subject ID.")],

    validateRequest,
    getSubject,
  )
  .put(
    [
      param("id").isMongoId().withMessage("Invalid subject ID."),

      body("name")
        .optional()
        .trim()
        .isLength({
          min: 2,
          max: 80,
        })
        .withMessage("Subject name must contain between 2 and 80 characters."),

      body("description")
        .optional()
        .trim()
        .isLength({
          max: 500,
        })
        .withMessage("Description cannot exceed 500 characters."),
    ],

    validateRequest,
    updateSubject,
  )
  .delete(
    [param("id").isMongoId().withMessage("Invalid subject ID.")],

    validateRequest,
    deleteSubject,
  );

export default router;
