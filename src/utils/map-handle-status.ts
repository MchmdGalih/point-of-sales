import { OrderStatus, PaymentStatus } from "../../generated/prisma/enums";

export const handleMapStatus = (
  status: string,
): {
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
} => {
  switch (status) {
    case "capture":
    case "settlement":
      return {
        orderStatus: OrderStatus.COMPLETED,
        paymentStatus: PaymentStatus.PAID,
      };
    case "expire":
      return {
        orderStatus: OrderStatus.PENDING,
        paymentStatus: PaymentStatus.EXPIRED,
      };
    case "cancel":
      return {
        orderStatus: OrderStatus.CANCELED,
        paymentStatus: PaymentStatus.CANCELED,
      };
    case "deny":
      return {
        orderStatus: OrderStatus.PENDING,
        paymentStatus: PaymentStatus.FAILED,
      };
    default:
      return {
        orderStatus: OrderStatus.PENDING,
        paymentStatus: PaymentStatus.PENDING,
      };
  }
};
