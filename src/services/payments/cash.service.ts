import {
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
} from "../../../generated/prisma/enums";
import { logger } from "../../config/logger";
import { prisma } from "../../lib/prisma";
import type { CreatePaymentResponse } from "../../model/payment-model";
import {
  getOrderByIdRepository,
  updateOrderStatusRepository,
} from "../../repositories/order.repository";
import {
  createPaymentRepository,
  updatePaymentByOrderIdRepository,
} from "../../repositories/payment.repository";
import { decrementProductRepository } from "../../repositories/product.repository";

export const cashService = async (
  orderId: string,
  paymentNumber: string,
  userId: string,
): Promise<void> => {
  const existingOrder = await getOrderByIdRepository(orderId);

  if (!existingOrder) throw new Error("Order not found");

  await prisma.$transaction(async (tx) => {
    await createPaymentRepository({
      orderId: existingOrder.id,
      status: PaymentStatus.PAID,
      paymentNumber,
      amount: Number(existingOrder.totalAmount),
      method: PaymentMethod.CASH,
    });

    logger.info("Payment created successfully");

    await updateOrderStatusRepository(tx, orderId, OrderStatus.COMPLETED);

    logger.info("Order status updated successfully");

    await updatePaymentByOrderIdRepository(tx, orderId, {
      status: PaymentStatus.PAID,
      provider: PaymentMethod.CASH,
      paidAt: new Date(),
    });

    logger.info("Payment status updated successfully");

    if (PaymentStatus.PAID === PaymentStatus.PAID) {
      await Promise.all(
        existingOrder.orderItems.map((item) => {
          console.log(item);
          decrementProductRepository(tx, item.productId, item.quantity);
        }),
      );

      logger.info("Product stock updated successfully");
    }
  });

  logger.info("Transaction completed successfully");
};
