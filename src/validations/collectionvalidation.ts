import { body } from "express-validator";

export const collectionValidation = [
  body("name").notEmpty().withMessage("collection name required"),
];
