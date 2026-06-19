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

interface OrderQueryDTO {
  page: number;
  limit: number;
  search?: string;
  status?: string;
  orderNumber?: string;
}

export const getAllOrderService = async (query: OrderQueryDTO) => {
  const { page = 1, limit = 10, search, status, orderNumber } = query;

  const skip = (page - 1) * limit;

  const result = await getAllOrderRepository({
    skip,
    take: limit,
    ...(search && { search }),
    ...(status && { status }),
    ...(orderNumber && { orderNumber }),
  });

  return {
    data: result.orders,
    meta: {
      page,
      limit,
      totalData: result.totalData,
    },
  };
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

  return {
    data: order,
  };
};

export const getOrderByIdService = async (id: string) => {
  const order = await getOrderByIdRepository(id);

  if (!order) throw new CustomError("Order not found", 404);

  return {
    data: order,
  };
};
