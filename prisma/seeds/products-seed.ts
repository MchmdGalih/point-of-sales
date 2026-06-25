import { faker } from "@faker-js/faker";
import {
  Category,
  Prisma,
  PrismaClient,
  Product,
} from "../../generated/prisma/client";
import { generateCode } from "../../src/utils/generate-code";
import { logger } from "../../src/config/logger";
export const seedProducts = async (
  prisma: PrismaClient,
  categories: Category[],
): Promise<void> => {
  const drinkCategories = categories.filter(
    (category: Category) => category.name === "Drinks",
  );

  const foodCategories = categories.filter(
    (category: Category) => category.name === "Foods",
  );

  const snackCategories = categories.filter(
    (category: Category) => category.name === "Snacks",
  );

  const allCategories = [
    ...drinkCategories,
    ...foodCategories,
    ...snackCategories,
  ];
  const getRandomCategory = () => {
    const randomIndex = Math.floor(Math.random() * allCategories.length);
    return allCategories[randomIndex];
  };
  const products: any = [];

  for (let i = 0; i < 50; i++) {
    const randomCategory = getRandomCategory();

    products.push({
      name: faker.commerce.productName(),
      categoryId: randomCategory.id,
      price: new Prisma.Decimal(faker.number.int({ min: 1000, max: 150000 })),
      sku: await generateCode("PRD"),
      stock: faker.number.int({ min: 1, max: 100 }),
      deletedAt: null,
    });
  }

  await prisma.product.createMany({
    data: products,
    skipDuplicates: true,
  });

  logger.info("Products seeded...");
};
