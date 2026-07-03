import { getTodaySummaryRepository } from "../repositories/dashboard.repository";
import { getAllOrderRepository } from "../repositories/order.repository";

export const getTodaySummaryService = async () => {
  const now = new Date();

  const order = await getAllOrderRepository();

  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59, 999);

  const totalCustomers = new Set(order.orders.map((o) => o.customerName));

  const data = await getTodaySummaryRepository(
    startOfDay,
    endOfDay,
    totalCustomers,
  );

  return {
    summary: {
      totalOrders: data.totalOrders,
      revenue: data.revenue,
      paidOrders: data.paidOrders,
      pendingPayment: data.pendingPayment,
      totalProducts: data.totalProducts,
      lowStockProducts: data.lowStockProducts,
    },
  };
};
