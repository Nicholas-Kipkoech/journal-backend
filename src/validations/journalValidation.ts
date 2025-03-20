import { body } from "express-validator";

export const journalValidation = [
  body("title").notEmpty().withMessage("journal title required"),
  body("content").notEmpty().withMessage("journal content required"),
  body("mood").notEmpty().withMessage("journal mood required"),
  body("collectionId").optional(),
  body("moodQuery").optional(),
];
