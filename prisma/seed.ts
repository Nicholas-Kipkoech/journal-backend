import { prisma } from "./client";

async function main() {
  await prisma.role.createMany({
    data: [
      { name: "Admin", description: "Administrator with full access" },
      { name: "User", description: "Regular user with limited access" },
    ],
  });

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
