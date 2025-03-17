import { Router } from "express";
import {
  loginValidation,
  registerValidation,
} from "../validations/authValidation";
import { AuthController } from "../controllers/authController";
import { authenticateUser } from "../middleware/authMiddleware";

const router = Router();

router.post("/register", registerValidation, AuthController.register);
router.post("/login", loginValidation, AuthController.login);
router.get("/profile", authenticateUser, AuthController.getMe);
