import { logger } from "../../src/config/logger";
import { prisma } from "../../src/lib/prisma";
import { seedCategories } from "./categories-seed";
import { seedProducts } from "./products-seed";
import { seeduser } from "./users-seed";

const main = async () => {
  logger.info("Seeding started...");

  await seeduser(prisma);
  const categories = await seedCategories(prisma);
  await seedProducts(prisma, categories);

  logger.info("Seeding completed...");
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    logger.error("Seeding failed...", e);
    await prisma.$disconnect();
    process.exit(1);
  });
