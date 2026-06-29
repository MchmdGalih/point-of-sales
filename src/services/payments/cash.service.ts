import {
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
} from "../../../generated/prisma/enums";
import { logger } from "../../config/logger";
import { CustomError } from "../../errors/customError";
import { prisma } from "../../lib/prisma";
import {
  getOrderByIdRepository,
  updateOrderStatusRepository,
} from "../../repositories/order.repository";
import {
  createPaymentRepository,
  updatePaymentByOrderIdRepository,
} from "../../repositories/payment.repository";
import { decrementProductRepository } from "../../repositories/product.repository";

export const cashService = async (orderId: string, paymentNumber: string) => {
  const existingOrder = await getOrderByIdRepository(orderId);

  if (!existingOrder) throw new CustomError("Order not found", 404);

  if (existingOrder.status === OrderStatus.COMPLETED)
    throw new CustomError("Order already completed", 400);

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

    await Promise.all(
      existingOrder.orderItem.map((item) =>
        decrementProductRepository(tx, item.productId, item.quantity),
      ),
    );
    logger.info("Product stock updated successfully");
  });

  logger.info("Transaction completed successfully");
};
