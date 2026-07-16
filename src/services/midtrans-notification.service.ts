import { PaymentMethod, PaymentStatus } from "../../generated/prisma/enums";
import { CustomError } from "../errors/customError";
import { prisma } from "../lib/prisma";
import {
  getOrderByOrderNumberRepository,
  updateOrderStatusRepository,
} from "../repositories/order.repository";
import { updatePaymentByOrderIdRepository } from "../repositories/payment.repository";
import { decrementProductRepository } from "../repositories/product.repository";
import { handleMapStatus } from "../utils/map-handle-status";
import { verifyMidtransSignature } from "../utils/verify-midtrans-signature";

interface ParamsPayloadMidtrans {
  order_id: string;
  transaction_status: string;
  payment_type: string;
  signature_key: string;
  gross_amount: string;
  status_code: string;
  transaction_id: string;
}

export const handleMidtransNotificationService = async (
  notification: ParamsPayloadMidtrans,
): Promise<void> => {
  const {
    order_id: orderNumber,
    transaction_status,
    payment_type,
    signature_key,
    gross_amount,
    status_code,
    transaction_id,
  } = notification;

  const isValidSignature = verifyMidtransSignature({
    orderId: orderNumber,
    statusCode: status_code,
    signatureKey: signature_key,
    grossAmount: gross_amount,
  });

  if (!isValidSignature) throw new CustomError("Invalid signature key", 401);

  const order = await getOrderByOrderNumberRepository(orderNumber as string);

  if (!order) throw new CustomError("Order not found", 404);

  if (order.payment?.status === PaymentStatus.PAID)
    throw new CustomError("Order already paid", 400);

  const { orderStatus, paymentStatus } = handleMapStatus(transaction_status);

  await prisma.$transaction(async (tx) => {
    await updateOrderStatusRepository(tx, order.id, orderStatus);
    await updatePaymentByOrderIdRepository(tx, order.id, {
      status: paymentStatus,
      provider: PaymentMethod.MIDTRANS,
      providerPaymentType: payment_type,
      providerTransactionId: transaction_id,
      paidAt: paymentStatus === PaymentStatus.PAID ? new Date() : null,
    });

    if (paymentStatus === PaymentStatus.PAID) {
      await Promise.all(
        order.orderItem.map((item) =>
          decrementProductRepository(tx, item.productId, item.quantity),
        ),
      );
    }
  });
};
