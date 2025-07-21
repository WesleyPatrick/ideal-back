import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main(): Promise<void> {
  await prisma.$transaction(async (tx) => {
    const hashedPassword = await hash("Senha@123", 10);

    await tx.user.upsert({
      where: {
        email: "solus@admin.com"
      },
      update: {},
      create: {
        name: "Solus Admin",
        email: "solus@admin.com",
        avatar: "https://avatar.iran.liara.run/public/25",
        cpf: "23489119061",
        password: hashedPassword,
        phone: "+5551999999999",
        role: "ADMIN",
        state: "SP",
        city: "SP",
        address: "Av. Paulista"
      }
    });
  });

  console.log("✅ Production seed applied successfully!");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error("Error to run production seed:", error);
    await prisma.$disconnect();
    process.exit(1);
  });
