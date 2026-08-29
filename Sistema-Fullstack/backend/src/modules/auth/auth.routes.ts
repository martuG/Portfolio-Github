import { Router } from "express";
import { login, register } from "./auth.controller.js";
import { loginValidator, registerValidator } from "./auth.validators.js";
import { validateRequest } from "../../middlewares/validate.middleware.js";

const router = Router();

router.post("/register", registerValidator, validateRequest, register);
router.post("/login", loginValidator, validateRequest, login);

export default router;
