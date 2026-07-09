import type {
  CashPaymentResponse,
  PaymentDetailResponse,
  PaymentResponse,
} from "../../model/payment-model";
import { serializeOrderItems } from "./order";

export const serializePayment = (payment: any): PaymentResponse => ({
  id: payment.id,
  orderId: payment.orderId,
  method: payment.method,
  status: payment.status,
  provider: payment.provider ?? null,
  paymentNumber: payment.paymentNumber,
  amount: Number(payment.amount),
  change: Number(payment.change),
  providerTransactionId: payment.providerTransactionId ?? null,
  providerPaymentType: payment.providerPaymentType ?? null,
  paidAt: payment.paidAt ?? null,
});

export const serializePaymentList = (payments: any[]): PaymentResponse[] =>
  payments.map(serializePayment);

export const serializePaymentDetail = (payment: any): PaymentDetailResponse => {
  const { orderId, paidAt, ...withoutOrderId } = serializePayment(payment);
  return {
    ...withoutOrderId,
    paidAt: payment.paidAt,
    order: {
      id: payment.order.id,
      orderNumber: payment.order.orderNumber,
      totalAmount: Number(payment.order.totalAmount),
      customerName: payment.order.customerName,
      cashier: {
        id: payment.order.user.id,
        username: payment.order.user.username,
      },
    },
    orderItems: payment.order.orderItem.map(serializeOrderItems),
  };
};

export const serializeCashPayment = (
  payment: any,
  order: any,
): CashPaymentResponse => {
  return {
    ...serializePayment(payment),
    order: {
      id: order.id,
      orderNumber: order.orderNumber,
      totalAmount: Number(order.totalAmount),
      customerName: order.customerName,
      cashier: {
        id: order.user.id,
        username: order.user.username,
      },
      orderItems: order.orderItem.map(serializeOrderItems),
    },
  };
};
