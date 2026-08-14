import { body, param } from "express-validator";

const fields = [
  body("title").trim().notEmpty().withMessage("Title is required.").isLength({ max: 150 }).withMessage("Title cannot be more than 150 characters."),
  body("authorId").isInt({ min: 1 }).withMessage("A valid author is required."),
  body("genreId").isInt({ min: 1 }).withMessage("A valid genre is required."),
  body("stock").isInt({ min: 0 }).withMessage("Stock quantity must be a whole number greater than or equal to 0.")
];

export const createBookValidator = fields;
export const updateBookValidator = [
  param("id").isInt({ min: 1 }).withMessage("Book id must be an integer."),
  body("title").optional().trim().notEmpty().withMessage("Title cannot be empty.").isLength({ max: 150 }).withMessage("Title cannot be more than 150 characters."),
  body("authorId").optional().isInt({ min: 1 }).withMessage("A valid author is required."),
  body("genreId").optional().isInt({ min: 1 }).withMessage("A valid genre is required."),
  body("stock").optional().isInt({ min: 0 }).withMessage("Stock quantity cannot be negative.")
];

export const idValidator = [param("id").isInt({ min: 1 }).withMessage("Id must be an integer.")];