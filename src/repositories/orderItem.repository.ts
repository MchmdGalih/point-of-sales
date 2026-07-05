import { OrderStatus } from "../../generated/prisma/enums";
import { prisma } from "../lib/prisma";

export const getTopSellingProductsrepository = (
  startofDate: Date,
  endofDate: Date,
) => {
  return prisma.orderItem.groupBy({
    by: ["productId"],
    where: {
      order: {
        deletedAt: null,
        status: OrderStatus.COMPLETED,
        createdAt: {
          gte: startofDate,
          lte: endofDate,
        },
      },
    },
    _sum: {
      quantity: true,
    },
    orderBy: {
      _sum: {
        quantity: "desc",
      },
    },
    take: 5,
  });
};
