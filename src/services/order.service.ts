import { logger } from "../config/logger";
import { CustomError } from "../errors/customError";
import type {
  CreateOrderResponse,
  ItemOrder,
  ListOrderResponse,
  OrderDetailResponse,
  OrderQueryRequest,
} from "../model/order-model";
import {
  createOrderRepository,
  deleteOrderRepository,
  getAllOrderRepository,
  getOrderByIdRepository,
} from "../repositories/order.repository";
import { getProductByIdsRepository } from "../repositories/product.repository";
import { getUserByIdRepository } from "../repositories/user.repository";
import {
  serializeCreateOrder,
  serializeOrderDetail,
  serializeOrders,
} from "../utils/formatter/order";
import { generateCode } from "../utils/generate-code";
import type { CreateOrderPayload } from "../validations/order.validation";

export const getAllOrderService = async (
  query: OrderQueryRequest,
): Promise<ListOrderResponse> => {
  const { page = 1, limit = 10, search, status, orderNumber } = query;

  const skip = (page - 1) * limit;

  const { orders, totalData } = await getAllOrderRepository({
    skip,
    take: limit,
    ...(search && { search }),
    ...(status && { status }),
    ...(orderNumber && { orderNumber }),
  });

  return {
    data: serializeOrders(orders),
    meta: {
      page,
      limit,
      totalData,
      totalPage: Math.ceil(totalData / limit),
    },
  };
};

export const createOrderService = async (
  userId: string,
  payload: CreateOrderPayload,
): Promise<CreateOrderResponse> => {
  const { orderItems, customerName } = payload;

  const productIds = orderItems.map((item: ItemOrder) => item.productId);

  const products = await getProductByIdsRepository(productIds);
  if (products.length !== productIds.length) {
    throw new CustomError("One or more product", 404);
  }

  let totalAmount = 0;

  const orderItemDatas = orderItems.map((item: ItemOrder) => {
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
      productName: product.name,
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
    customerName,
    orderNumber,
    totalAmount,
    orderItem: { create: orderItemDatas },
  });

  return serializeCreateOrder(order);
};

export const getOrderByIdService = async (
  id: string,
): Promise<OrderDetailResponse> => {
  const order = await getOrderByIdRepository(id);

  if (!order) throw new CustomError("Order not found", 404);

  return serializeOrderDetail(order);
};

export const deleteOrderService = async (id: string): Promise<void> => {
  return await deleteOrderRepository(id);
};
