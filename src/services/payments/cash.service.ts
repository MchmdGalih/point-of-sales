import { PaymentMethod, PaymentStatus } from "../../../generated/prisma/enums";
import type { CreatePaymentResponse } from "../../model/payment-model";
import { getOrderByIdRepository } from "../../repositories/order.repository";
import { createPaymentRepository } from "../../repositories/payment.repository";

export const cashService = async (
  orderId: string,
  paymentNumber: string,
  userId: string,
): Promise<CreatePaymentResponse> => {
  const existingOrder = await getOrderByIdRepository(orderId);

  if (!existingOrder) throw new Error("Order not found");

  await createPaymentRepository({
    orderId: existingOrder.id,
    status: PaymentStatus.PAID,
    paymentNumber,
    amount: Number(existingOrder.totalAmount),
    method: PaymentMethod.CASH,
  });

  return {
    snapToken: null,
    redirectUrl: null,
  };
};
