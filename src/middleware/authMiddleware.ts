import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { prisma } from "../../prisma/client";

interface TokenPayload extends JwtPayload {
  userId: string;
  email: string;
}

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "Unauthorized: Token missing" });
      return;
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      res.status(401).json({ message: "Unauthorized: Invalid token format" });
      return;
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      res.status(401).json({ message: "Unauthorized: User not found" });
      return;
    }

    (req as any).user = user; // Attach user to request
    next();
  } catch (error) {
    console.error("JWT Authentication Error:", error);
    res.status(401).json({ message: "Unauthorized: Invalid token" });
    return;
  }
};
