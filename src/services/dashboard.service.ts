import type { Product } from "../../generated/prisma/client";
import type {
  DashboardSummaryResponse,
  TopSellingProductResponse,
} from "../model/dashboard-model";
import {
  countPendingOrdersByDateRange,
  getDistinctCustomerByDateRange,
  countOrderByDateRange,
} from "../repositories/order.repository";
import { getTopSellingProductsrepository } from "../repositories/orderItem.repository";
import {
  countPaymentStatusPaidByDateRange,
  getRevenueByDateRange,
} from "../repositories/payment.repository";
import {
  getProductByIdsRepository,
  getTotalLowStockProducts,
  getTotalProducts,
} from "../repositories/product.repository";

export const getTodaySummaryService =
  async (): Promise<DashboardSummaryResponse> => {
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
    const averageOrderValue: number =
      totalOrders > 0 ? revenue / totalOrders : 0;

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

export const getTopSellingProductsService = async (
  startDate: Date,
  endDate: Date,
): Promise<TopSellingProductResponse[]> => {
  const data = await getTopSellingProductsrepository(startDate, endDate);

  if (data.length === 0) return [];
  const productIds = data.map((item) => item.productId);
  const products = await getProductByIdsRepository(productIds);

  return data.map(
    (item): TopSellingProductResponse => ({
      productId: item.productId,
      productName:
        products.find((product) => product.id === item.productId)?.name ??
        "Unknown",
      quantity: item._sum.quantity ?? 0,
    }),
  );
};
