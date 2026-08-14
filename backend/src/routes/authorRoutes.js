import { Router } from "express";
import { createAuthor, deleteAuthor, getAuthorById, getAuthors, updateAuthor } from "../controllers/authorController.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import { authorValidator } from "../validators/authorValidator.js";
import { idValidator } from "../validators/bookValidator.js";
import { validate } from "../middlewares/validationMiddleware.js";

const router = Router();
router.use(requireAuth);

router.get("/", getAuthors);
router.get("/:id", idValidator, validate, getAuthorById);
router.post("/", authorValidator, validate, createAuthor);
router.put("/:id", idValidator, authorValidator, validate, updateAuthor);
router.delete("/:id", idValidator, validate, deleteAuthor);

export default router;