import type { PeriodeType } from "../utils/date";

export interface DashboardSummaryResponse {
  summary: {
    totalOrders: number;
    revenue: number;
    paidOrders: number;
    pendingOrders: number;
    totalProducts: number;
    lowStockProducts: number;
    totalCustomers: number;
    averageOrderValue: number;
  };
}

export interface TopSellingProductResponse {
  productId: string;
  productName: string;
  quantity: number;
}

export interface RecentOrdersResponse {
  orderNumber: string;
  customerName: string;
  totalAmount: number;
  paymentMethod?: string | undefined;
  paymentStatus?: string | undefined;
}

export interface PaymentMethodBreakdownResponse {
  method: string;
  transactionCount: number;
  amount: number;
}

export interface GetSalesTrendResponse {
  period: PeriodeType;
  salesTrend: SalesTrendItem[];
}

export interface SalesTrendItem {
  date: Date;
  totalOrders: number;
  revenue: number;
}
