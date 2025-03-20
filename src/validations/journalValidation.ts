import { body } from "express-validator";

export const journalValidation = [
  body("title").notEmpty().withMessage("joruanl title required"),
  body("content").notEmpty().withMessage("joruanl content required"),
  body("mood").notEmpty().withMessage("joruanl mood required"),
  body("collectionId").optional(),
  body("moodScore").optional(),
  body("moodQuery").optional(),
  body("moodQuery").optional(),
];
