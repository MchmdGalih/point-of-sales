import type { PaymentQueryDTO } from "../dto/payment.dto";
import { CustomError } from "../errors/customError";
import { snap } from "../lib/midtrans";
import { getOrderByIdRepository } from "../repositories/order.repository";
import {
  createPaymentRepository,
  getAllPaymentRepository,
} from "../repositories/payment.repository";
import { getUserByIdRepository } from "../repositories/user.repository";
import { generateCode } from "../utils/generate-code";

export const getAllPaymentService = async (query: PaymentQueryDTO) => {
  const {} = query;

  return await getAllPaymentRepository(query);
};

export const createPaymentService = async (orderId: string, userId: string) => {
  const orders = await getOrderByIdRepository(orderId);

  if (!orders) throw new CustomError("Order not found", 404);

  const users = await getUserByIdRepository(userId);

  if (!users) throw new CustomError("User not found", 404);

  let parameter = {
    transaction_details: {
      order_id: orders.orderNumber,
      gross_amount: Math.round(Number(orders.totalAmount)),
    },
    customer_details: {
      first_name: users.username,
      email: users.email,
    },
    items_details: orders.orderItem.map((item: any) => ({
      id: item.productId,
      price: Number(item.price),
      quantity: item.quantity,
      name: item.productId,
    })),
  };

  const transaction = await snap.createTransaction(parameter);

  const paymentNumber = await generateCode("PAY");

  await createPaymentRepository({
    orderId: orders.id,
    paymentNumber,
    snapToken: transaction.token,
    method: "MIDTRANS",
    status: "PENDING",
    amount: Math.round(Number(orders.totalAmount)),
  });

  return {
    snapToken: transaction.token,
    redirectUrl: transaction.redirect_url,
  };
};
