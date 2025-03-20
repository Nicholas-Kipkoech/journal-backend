import { Router } from "express";
import {
  loginValidation,
  registerValidation,
} from "../validations/authValidation";
import { AuthController } from "../controllers/authController";
import { authenticateUser, authorizeRole } from "../middleware/authMiddleware";

const authRouter = Router();

/**
 * @openapi
 * '/auth/register':
 *  post:
 *     tags:
 *     - User Registration
 *     summary: create new user account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *
 *               lastName:
 *                 type: string
 *
 *               email:
 *                 type: string
 *
 *               password:
 *                 type: string
 *
 *     responses:
 *       200:
 *         description: Fetched
 *       409:
 *         description: Conflict
 *       404:
 *         description: Not Found
 *       500:
 *         description: Server Error
 */

authRouter.post("/register", registerValidation, AuthController.register);

/**
 * @openapi
 * '/auth/login':
 *  post:
 *     tags:
 *     - User Login
 *     summary: login into your account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *
 *
 *               - email
 *               - password
 *             properties:
 *
 *               email:
 *                 type: string
 *
 *               password:
 *                 type: string
 *
 *     responses:
 *       200:
 *         description: Fetched
 *       409:
 *         description: Conflict
 *       404:
 *         description: Not Found
 *       500:
 *         description: Server Error
 */

authRouter.post("/login", loginValidation, AuthController.login);

/**
 * @openapi
 * '/auth/profile':
 *  get:
 *     tags:
 *     - User profile
 *     summary: Get own data
 *     security:
 *       - bearerAuth: []  # 👈 This enables Bearer Token authentication in Swagger
 *     responses:
 *       200:
 *         description: Successfully fetched user profile
 *       401:
 *         description: Unauthorized, missing or invalid token
 *       403:
 *         description: Forbidden, token expired or invalid
 *       404:
 *         description: User not found
 *       500:
 *         description: Server Error
 */

authRouter.get("/profile", authenticateUser, AuthController.getMe);

export default authRouter;
