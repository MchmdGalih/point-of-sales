import { PaymentMethod } from "../../../generated/prisma/enums";
import { CustomError } from "../../errors/customError";
import {
  deletePaymentRepository,
  getAllPaymentRepository,
  getPaymentByIdRepository,
} from "../../repositories/payment.repository";
import { generateCode } from "../../utils/generate-code";
import type {
  CreatePaymentResponse,
  ListPaymentResponse,
  PaymentDetailResponse,
} from "../../model/payment-model";
import { cashService } from "./cash.service";
import { midtransService } from "./midtrans.service";
import {
  serializePaymentDetail,
  serializePaymentList,
} from "../../utils/formatter/payment";
import type { PaymentQueryRequest } from "../../validations/payment.validation";

export const getAllPaymentService = async (
  query: PaymentQueryRequest,
): Promise<ListPaymentResponse> => {
  const { page, limit, status, search, method } = query;
  const skip = (page - 1) * limit;

  const result = await getAllPaymentRepository({
    skip,
    take: limit,
    ...(search && { search }),
    ...(status && { status }),
    ...(method && { method }),
  });

  return {
    data: serializePaymentList(result.payments),
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
  amount: number,
): Promise<CreatePaymentResponse> => {
  const paymentNumber: string = await generateCode("PAY");

  if (method === PaymentMethod.CASH)
    return await cashService(orderId, paymentNumber, amount);

  if (method === PaymentMethod.MIDTRANS)
    return await midtransService(orderId, paymentNumber);

  throw new CustomError("Payment method not found", 404);
};

export const getPaymentByIdService = async (
  id: string,
): Promise<PaymentDetailResponse> => {
  const payment = await getPaymentByIdRepository(id);

  if (!payment) throw new CustomError("Payment not found", 404);

  return serializePaymentDetail(payment);
};

export const deletePaymentService = async (id: string): Promise<void> => {
  await deletePaymentRepository(id);
};
