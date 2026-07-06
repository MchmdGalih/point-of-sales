import type { Product } from "../../generated/prisma/client";
import type {
  DashboardSummaryResponse,
  TopSellingProductResponse,
} from "../model/dashboard-model";
import {
  countPendingOrdersByDateRange,
  getDistinctCustomerByDateRange,
  countOrderByDateRange,
  getRecentOrdersRepository,
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
import { getDateRange, type PeriodeType } from "../utils/date";

export const getTodaySummaryService =
  async (): Promise<DashboardSummaryResponse> => {
    const { start, end } = getDateRange("today");

    const [
      totalOrders,
      revenueResult,
      paidOrders,
      pendingOrders,
      totalProducts,
      lowStockProducts,
      distinctCustomers,
    ] = await Promise.all([
      countOrderByDateRange(start, end),
      getRevenueByDateRange(start, end),
      countPaymentStatusPaidByDateRange(start, end),
      countPendingOrdersByDateRange(start, end),
      getTotalProducts(),
      getTotalLowStockProducts(),
      getDistinctCustomerByDateRange(start, end),
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
  periode: PeriodeType,
  customStart?: string,
  customEnd?: string,
): Promise<TopSellingProductResponse[]> => {
  const { start, end } = getDateRange(periode, customStart, customEnd);

  const data = await getTopSellingProductsrepository(start, end);

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

export const getrecenstOrdersService = async () => {
  return await getRecentOrdersRepository();
};
