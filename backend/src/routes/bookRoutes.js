import { Router } from "express";
import { createBook, deleteBook, getBookById, getBooks, updateBook } from "../controllers/bookController.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import { uploadCover } from "../middlewares/upload.js";
import { createBookValidator, idValidator, updateBookValidator } from "../validators/bookValidator.js";
import { validate } from "../middlewares/validationMiddleware.js";

const router = Router();
router.use(requireAuth);

router.get("/", getBooks);
router.get("/:id", idValidator, validate, getBookById);
router.post("/", uploadCover, createBookValidator, validate, createBook);
router.put("/:id", uploadCover, updateBookValidator, validate, updateBook);
router.delete("/:id", idValidator, validate, deleteBook);

export default router;