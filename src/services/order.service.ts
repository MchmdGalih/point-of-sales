import type { Prisma } from "../../generated/prisma/client";
import { CustomError } from "../errors/customError";
import {
  createOrderRepository,
  getAllOrderRepository,
  getOrderByIdRepository,
} from "../repositories/order.repository";
import { getProductByIdsRepository } from "../repositories/product.repository";
import { getUserByIdRepository } from "../repositories/user.repository";
import { generateCode } from "../utils/generate-code";
import type { CreateOrderPayload } from "../validations/order.validation";

export const getAllOrderService = async () => {
  return await getAllOrderRepository();
};

export const createOrderService = async (
  userId: string,
  payload: CreateOrderPayload,
) => {
  const { orderItems } = payload;

  const productIds = orderItems.map((item) => item.productId);

  const products = await getProductByIdsRepository(productIds);

  if (products.length !== productIds.length) {
    throw new CustomError("One or more product", 404);
  }

  let totalAmount = 0;

  const orderItemDatas: Prisma.OrderItemUncheckedCreateWithoutOrderInput[] =
    orderItems.map((item) => {
      const product = products.find((p) => p.id === item.productId);

      if (!product) {
        throw new CustomError("One or more product", 404);
      }

      if (product.stock < item.quantity) {
        throw new CustomError("Insufficient stock", 400);
      }

      const subtotal = Number(product.price) * item.quantity;
      totalAmount += subtotal;

      return {
        productId: product.id,
        quantity: item.quantity,
        price: Number(product.price),
        subtotal,
      };
    });

  const user = await getUserByIdRepository(userId);

  if (!user) throw new CustomError("User not found", 404);

  const orderNumber = await generateCode("ORD");

  const order = await createOrderRepository({
    userId,
    orderNumber,
    totalAmount,
    orderItem: { create: orderItemDatas },
  });

  return order;
};

export const getOrderByIdService = async (id: string) => {
  const order = await getOrderByIdRepository(id);

  if (!order) throw new CustomError("Order not found", 404);

  return order;
};
