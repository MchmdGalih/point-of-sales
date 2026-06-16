import { prisma } from "../lib/prisma";

type EntityType = "PRD" | "ORD" | "PAY";

export const generateCode = async (type: EntityType): Promise<string> => {
  let count = 0;

  switch (type) {
    case "PRD":
      count = await prisma.product.count({
        where: {
          deletedAt: null,
        },
      });
      break;
    case "ORD":
      count = await prisma.order.count({
        where: {
          deletedAt: null,
        },
      });
      break;
    case "PAY":
      count = await prisma.payment.count();
      break;

    default:
      break;
  }

  const number = String(count + 1).padStart(3, "0");
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();

  return `${type}-${number}-${random}`;
};
