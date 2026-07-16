import {
  countPendingOrdersByDateRange,
  getDistinctCustomerByDateRange,
  countOrderByDateRange,
  getRecentOrdersRepository,
  getSalesTrendRepository,
} from "../repositories/order.repository";
import { getTopSellingProductsrepository } from "../repositories/orderItem.repository";
import {
  countPaymentMethodRepository,
  countPaymentStatusPaidByDateRange,
  getRevenueByDateRange,
} from "../repositories/payment.repository";
import {
  getProductByIdsRepository,
  countTotalLowStockProducts,
  getTotalProducts,
  getTotalLowStockProducts,
} from "../repositories/product.repository";
import type {
  DashboardSummaryResponse,
  GetSalesTrendResponse,
  PaymentMethodBreakdownResponse,
  RecentOrdersResponse,
  SalesTrendItem,
  TopSellingProductResponse,
} from "../types/dashboard.types";
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
      countTotalLowStockProducts(),
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
  period: PeriodeType,
): Promise<TopSellingProductResponse[]> => {
  const { start, end } = getDateRange(period);

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

export const getrecenstOrdersService = async (): Promise<
  RecentOrdersResponse[]
> => {
  const datas = await getRecentOrdersRepository();
  const result = datas.map((data) => ({
    orderNumber: data.orderNumber,
    customerName: data.customerName,
    totalAmount: Number(data.totalAmount),
    paymentMethod: data.payment?.method,
    paymentStatus: data.payment?.status,
  }));

  return result;
};

export const countPaymentMethodService = async (): Promise<
  PaymentMethodBreakdownResponse[]
> => {
  const datas = await countPaymentMethodRepository();
  const result = datas.map((data) => ({
    method: data.method,
    transactionCount: data._count.id,
    amount: Number(data._sum.amount),
  }));

  return result;
};

export const getLowStockProductService = async () => {
  return await getTotalLowStockProducts();
};

export const getSalesTrendService = async (
  period: PeriodeType,
): Promise<GetSalesTrendResponse> => {
  const { start, end } = getDateRange(period);

  const sales = (await getSalesTrendRepository(start, end)) as SalesTrendItem[];

  return {
    period,
    salesTrend: sales,
  };
};
