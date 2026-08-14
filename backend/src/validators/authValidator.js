import { body } from "express-validator";

export const loginValidator = [
  body("username").trim().notEmpty().withMessage("Username is required.").isLength({ max: 50 }).withMessage("Username is too long."),
  body("password").notEmpty().withMessage("Password is required.")
];

export const registerValidator = [
  body("firstName").trim().notEmpty().withMessage("First name is required.").isLength({ max: 50 }).withMessage("First name is too long."),
  body("lastName").trim().notEmpty().withMessage("Last name is required.").isLength({ max: 50 }).withMessage("Last name is too long."),
  body("username").trim().notEmpty().withMessage("Username is required.").isLength({ max: 50 }).withMessage("Username is too long."),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters.")
];