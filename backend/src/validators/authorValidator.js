import { body } from "express-validator";

export const authorValidator = [
  body("name").trim().notEmpty().withMessage("Author name is required.").isLength({ max: 100 }).withMessage("Author name cannot be more than 100 characters."),
  body("bio").optional({ values: "null" }).isString().withMessage("Biography must be text.").isLength({ max: 1000 }).withMessage("Biography cannot be more than 1000 characters.")
];