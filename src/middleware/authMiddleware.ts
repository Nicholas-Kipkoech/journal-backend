import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { CustomRequest } from "../shared";

export const authenticateUser = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: number;
      email: string;
      role: string;
    };
    req.user = decoded; // Attach user to the request
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};
