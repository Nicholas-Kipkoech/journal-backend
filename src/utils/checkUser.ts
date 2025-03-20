import { prisma } from "../../prisma/client";

export async function checkUser(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("user not found");
  return user;
}
