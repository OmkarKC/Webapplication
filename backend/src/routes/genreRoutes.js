import { Router } from "express";
import { createGenre, deleteGenre, getGenreById, getGenres, updateGenre } from "../controllers/genreController.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import { genreValidator } from "../validators/genreValidator.js";
import { idValidator } from "../validators/bookValidator.js";
import { validate } from "../middlewares/validationMiddleware.js";

const router = Router();
router.use(requireAuth);

router.get("/", getGenres);
router.get("/:id", idValidator, validate, getGenreById);
router.post("/", genreValidator, validate, createGenre);
router.put("/:id", idValidator, genreValidator, validate, updateGenre);
router.delete("/:id", idValidator, validate, deleteGenre);

export default router;