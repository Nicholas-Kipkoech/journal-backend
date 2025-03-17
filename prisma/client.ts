import { PrismaClient } from "@prisma/client";

// Use singleton pattern to ensure only one instance of prisma exists
// Avoid too many database connections

const globalForPrisma = global as unknown as { prisma?: PrismaClient };
export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
