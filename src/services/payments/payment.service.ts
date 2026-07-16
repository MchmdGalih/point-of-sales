import { PaymentMethod } from "../../../generated/prisma/enums";
import { CustomError } from "../../errors/customError";
import {
  deletePaymentRepository,
  getAllPaymentRepository,
  getPaymentByIdRepository,
} from "../../repositories/payment.repository";
import { generateCode } from "../../utils/generate-code";

import { cashService } from "./cash.service";
import { midtransService } from "./midtrans.service";
import {
  serializePaymentDetail,
  serializePaymentList,
} from "../../utils/formatter/payment";
import type { PaymentQueryRequest } from "../../validations/payment.validation";
import type { CreatePaymentDTO } from "../../dto/payment.dto";
import type {
  CreatePaymentResponse,
  ListPaymentResponse,
  PaymentDetailResponse,
} from "../../types/payment.type";

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
  payload: CreatePaymentDTO,
): Promise<CreatePaymentResponse> => {
  const { method, amount } = payload;

  const paymentNumber: string = await generateCode("PAY");

  if (method === PaymentMethod.CASH) {
    if (amount === undefined) throw new CustomError("Amount is required", 400);
    return cashService(orderId, paymentNumber, amount);
  }

  if (method === PaymentMethod.MIDTRANS)
    return midtransService(orderId, paymentNumber);

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
  const payment = await getPaymentByIdRepository(id);

  if (!payment) throw new CustomError("Payment not found", 404);

  await deletePaymentRepository(id);
};
