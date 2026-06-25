import { Category, PrismaClient } from "../../generated/prisma/client";
import { logger } from "../../src/config/logger";

const categories = [{ name: "Foods" }, { name: "Drinks" }, { name: "Snacks" }];

export const seedCategories = async (
  prisma: PrismaClient,
): Promise<Category[]> => {
  const result = [];

  for (const category of categories) {
    const data = await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: { name: category.name },
    });

    result.push(data);
  }

  logger.info("Categories seeded successfully");

  return result;
};
