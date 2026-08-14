import { Router } from "express";
import { login, logout, register } from "../controllers/authController.js";
import { loginValidator, registerValidator } from "../validators/authValidator.js";
import { validate } from "../middlewares/validationMiddleware.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const router = Router();

router.post("/register", registerValidator, validate, register);
router.post("/login", loginValidator, validate, login);
router.post("/logout", requireAuth, logout);

export default router;