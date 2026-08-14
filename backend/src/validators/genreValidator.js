import { body } from "express-validator";

export const genreValidator = [
  body("name").trim().notEmpty().withMessage("Genre name is required.").isLength({ max: 50 }).withMessage("Genre name cannot be more than 50 characters.")
];