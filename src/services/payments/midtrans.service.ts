import { PaymentMethod, PaymentStatus } from "../../../generated/prisma/enums";
import { snap } from "../../config/midtrans";
import { CustomError } from "../../errors/customError";
import { getOrderByIdRepository } from "../../repositories/order.repository";
import { createPaymentRepository } from "../../repositories/payment.repository";
import { getUserByIdRepository } from "../../repositories/user.repository";

export const midtransService = async (
  orderId: string,
  paymentNumber: string,
  userId: string,
) => {
  const existingOrder = await getOrderByIdRepository(orderId);

  if (!existingOrder) throw new Error("Order not found");

  const users = await getUserByIdRepository(userId);

  if (!users) throw new CustomError("User not found", 404);

  let parameter = {
    transaction_details: {
      order_id: existingOrder.orderNumber,
      gross_amount: Math.round(Number(existingOrder.totalAmount)),
    },
    customer_details: {
      first_name: existingOrder.customerName,
      last_name: users.username,
    },
    items_details: existingOrder.orderItem.map((item: any) => ({
      id: item.productId,
      price: Number(item.price),
      quantity: item.quantity,
      name: item.productId,
    })),
  };

  const midtransResponse = await snap.createTransaction(parameter);

  await createPaymentRepository({
    orderId: existingOrder.id,
    status: PaymentStatus.PENDING,
    snapToken: midtransResponse.token,
    paymentNumber,
    amount: Number(existingOrder.totalAmount),
    method: PaymentMethod.MIDTRANS,
  });

  return {
    snapToken: midtransResponse.token,
    redirectUrl: midtransResponse.redirect_url,
  };
};
