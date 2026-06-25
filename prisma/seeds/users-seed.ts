import { PrismaClient, Role } from "../../generated/prisma/client";
import { logger } from "../../src/config/logger";
import bcrypt from "bcrypt";

const hashedPassword = async (value: string): Promise<string> => {
  return await bcrypt.hash(value, 10);
};

export const seeduser = async (prisma: PrismaClient): Promise<void> => {
  await prisma.user.createMany({
    data: [
      {
        username: "admin",
        email: "admin1@mail.com",
        password: await hashedPassword("admin123"),
        role: Role.ADMIN,
        createdAt: new Date(),
      },
      {
        username: "cashier",
        email: "cashier1@mail.com",
        password: await hashedPassword("cashier123"),
        role: Role.CASHIER,
        createdAt: new Date(),
      },
    ],
    skipDuplicates: true,
  });

  logger.info("Users seeded...");
};
