export type DashboardSummaryResponse = {
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
};

export type TopSellingProductResponse = {
  productId: string;
  productName: string;
  quantity: number;
};

export type RecentOrdersResponse = {
  orderNumber: string;
  customerName: string;
  totalAmount: number;
  paymentMethod?: string | undefined;
  paymentStatus?: string | undefined;
};

export type PaymentMethodBreakdownResponse = {
  method: string;
  transactionCount: number;
  amount: number;
};
