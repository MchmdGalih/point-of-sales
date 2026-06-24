import { PrismaClient } from "../../generated/prisma/client";
import { logger } from "../../src/config/logger";

const categories = [{ name: "Foods" }, { name: "Drinks" }, { name: "Snacks" }];

export const seedCategories = async (prisma: PrismaClient): Promise<void> => {
  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: { name: category.name },
    });
  }

  logger.info("Categories seeded successfully");
};
