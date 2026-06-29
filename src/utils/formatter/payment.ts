import type { PaymentResponse } from "../../model/payment-model";

export const serializePayment = (payment: any): PaymentResponse => ({
  id: payment.id,
  orderId: payment.orderId,
  method: payment.method,
  status: payment.status,
  provider: payment.provider ?? null,
  paymentNumber: payment.paymentNumber,
  amount: Number(payment.amount),
  providerTransactionId: payment.providerTransactionId ?? null,
  providerPaymentType: payment.providerPaymentType ?? null,
  snapToken: payment.snapToken ?? null,
  paidAt: payment.paidAt ?? null,
});
