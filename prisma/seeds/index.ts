import { logger } from "../../src/config/logger";
import { prisma } from "../../src/lib/prisma";
import { seedCategories } from "./categories-seed";
import { seeduser } from "./users-seed";

const main = async () => {
  logger.info("Seeding started...");

  await seeduser(prisma);
  await seedCategories(prisma);
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
