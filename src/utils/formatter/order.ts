import type {
  CreateOrderResponse,
  OrderDetailResponse,
  OrderItems,
  OrderResponse,
} from "../../model/order-model";
import { serializePayment } from "./payment";

export const serializeOrder = (order: any): OrderResponse => ({
  id: order.id,
  orderNumber: order.orderNumber,
  totalAmount: Number(order.totalAmount),
  customerName: order.customerName,
  cashier: { id: order.user.id, username: order.user.username },
  status: order.status,
  itemsCount: order._count?.orderItem ?? 0,
  createdAt: order.createdAt,
});

export const serializeOrders = (orders: any[]): OrderResponse[] =>
  orders.map(serializeOrder);

export const serializeCreateOrder = (order: any): CreateOrderResponse => {
  const { itemsCount, ...withoutCount } = serializeOrder(order);

  return {
    ...withoutCount,
    items: order.orderItem.map((item: any) => ({
      productId: item.productId,
      productName: item.productName,
      quantity: item.quantity,
      price: Number(item.price),
      subtotal: Number(item.subtotal),
    })),
  };
};

export const seriaizeOrderItems = (item: any): OrderItems => ({
  productId: item.productId,
  quantity: item.quantity,
  price: Number(item.price),
  productName: item.productName,
  subtotal: Number(item.subtotal),
});

export const serializeOrderDetail = (order: any): OrderDetailResponse => {
  const { itemsCount, ...withoutCount } = serializeOrder(order);
  return {
    ...withoutCount,
    orderItems: order.orderItem.map(seriaizeOrderItems),
    payment: order.payment ? serializePayment(order.payment) : null,
    updatedAt: order.updatedAt,
    createdAt: order.createdAt,
  };
};
