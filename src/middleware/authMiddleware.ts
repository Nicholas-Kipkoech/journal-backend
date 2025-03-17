import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../../prisma/client";

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1]; // Get token from header
  if (!token) res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { role: true },
    });

    if (!user) res.status(401).json({ message: "User not found" });

    (req as any).user = user; // Attach user to request
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

export const authorizeRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user || !roles.includes(user.role.name)) {
      res.status(403).json({ message: "Forbidden: Insufficient permissions" });
    }
    next();
  };
};
