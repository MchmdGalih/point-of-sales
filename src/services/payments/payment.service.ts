import { PaymentMethod } from "../../../generated/prisma/enums";
import { CustomError } from "../../errors/customError";
import { getAllPaymentRepository } from "../../repositories/payment.repository";
import { generateCode } from "../../utils/generate-code";
import type {
  CreatePaymentResponse,
  ListPaymentResponse,
  PaymentQueryRequest,
} from "../../model/payment-model";
import { cashService } from "./cash.service";
import { midtransService } from "./midtrans.service";

export const getAllPaymentService = async (
  query: PaymentQueryRequest,
): Promise<ListPaymentResponse> => {
  const {
    page = 1,
    limit = 10,
    paymentNumber,
    status,
    orderId,
    method,
  } = query;
  const skip = (page - 1) * limit;

  const result = await getAllPaymentRepository({
    skip,
    take: limit,
    ...(paymentNumber && { paymentNumber }),
    ...(status && { status }),
    ...(orderId && { orderId }),
    ...(method && { method }),
  });

  return {
    data: result.payments,
    meta: {
      page,
      limit,
      totalPage: Math.ceil(result.totalData / limit),
      totalData: result.totalData,
    },
  };
};

export const createPaymentService = async (
  orderId: string,
  method: PaymentMethod,
  userId: string,
): Promise<CreatePaymentResponse> => {
  const paymentNumber: string = await generateCode("PAY");

  if (method === PaymentMethod.CASH)
    await cashService(orderId, paymentNumber, userId);

  if (method === PaymentMethod.MIDTRANS)
    return await midtransService(orderId, paymentNumber, userId);

  throw new CustomError("Payment method not found", 404);
};
