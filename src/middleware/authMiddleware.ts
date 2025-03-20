import { Request, Response, NextFunction } from "express";
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
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      res.status(401).json({ message: "Unauthorized!!" });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    (req as any).user = user; // Attach user to request
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

export const authorizeRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as any).user;
    if (!user || !roles.includes(user.role.name)) {
      res.status(403).json({ message: "Forbidden: Insufficient permissions" });
      return;
    }
    next();
  };
};
