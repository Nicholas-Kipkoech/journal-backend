import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { AuthService } from "../services/authService";
import { CustomRequest, LoginDto, UserDto } from "../shared";

export class AuthController {
  // user registration
  static async register(req: Request, res: Response): Promise<void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return; // ✅ Stop execution after sending response
    }

    try {
      const userData: UserDto = req.body;
      const user = await AuthService.registerUser(userData);
      res.status(201).json({ message: "User registered successfully", user });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // login user controller
  static async login(req: Request, res: Response): Promise<void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    try {
      const userLoginData: LoginDto = req.body;
      const data = await AuthService.loginUser(userLoginData);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // update user
  static async updateUser(req: CustomRequest, res: Response): Promise<void> {
    try {
      const updatedUser = await AuthService.updateUser(req.user.id, req.body);
      res
        .status(200)
        .json({ message: "Profile updated successfully", updatedUser });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // fetch logged-in user profile
  static async getMe(req: CustomRequest, res: Response): Promise<void> {
    try {
      const user = await AuthService.getUser(req.user.id);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
