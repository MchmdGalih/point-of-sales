import {
  countPendingOrdersByDateRange,
  getDistinctCustomerByDateRange,
  countOrderByDateRange,
} from "../repositories/order.repository";
import {
  countPaymentStatusPaidByDateRange,
  getRevenueByDateRange,
} from "../repositories/payment.repository";
import {
  getTotalLowStockProducts,
  getTotalProducts,
} from "../repositories/product.repository";

export const getTodaySummaryService = async () => {
  const now = new Date();

  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59, 999);

  const [
    totalOrders,
    revenueResult,
    paidOrders,
    pendingOrders,
    totalProducts,
    lowStockProducts,
    distinctCustomers,
  ] = await Promise.all([
    countOrderByDateRange(startOfDay, endOfDay),
    getRevenueByDateRange(startOfDay, endOfDay),
    countPaymentStatusPaidByDateRange(startOfDay, endOfDay),
    countPendingOrdersByDateRange(startOfDay, endOfDay),
    getTotalProducts(),
    getTotalLowStockProducts(),
    getDistinctCustomerByDateRange(startOfDay, endOfDay),
  ]);

  const revenue: number = Number(revenueResult._sum.amount ?? 0);
  const totalCustomers: number = distinctCustomers.length;
  const averageOrderValue: number = totalOrders > 0 ? revenue / totalOrders : 0;

  return {
    summary: {
      totalOrders,
      revenue,
      paidOrders,
      pendingOrders,
      totalProducts,
      lowStockProducts,
      totalCustomers,
      averageOrderValue,
    },
  };
};
