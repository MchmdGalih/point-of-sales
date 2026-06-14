import { getAllOrderRepository } from "../repositories/order.repository";

export const getAllOrderService = async () => {
  return await getAllOrderRepository();
};
