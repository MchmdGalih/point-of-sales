import { prisma } from "../lib/prisma";

export const getAllProductRepository = () => {
  return prisma.product.findMany();
};

export const createProductRepository = (payload: any) => {
  return prisma.product.create({
    data: payload,
  });
};
