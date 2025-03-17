import { Router } from "express";
import {
  loginValidation,
  registerValidation,
} from "../validations/authValidation";
import { AuthController } from "../controllers/authController";
import { authenticateUser, authorizeRole } from "../middleware/authMiddleware";

const authRouter = Router();

authRouter.post("/register", registerValidation, AuthController.register);
authRouter.post("/login", loginValidation, AuthController.login);
authRouter.get("/profile", authenticateUser, AuthController.getMe);

export default authRouter;
