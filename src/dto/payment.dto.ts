export interface PaymentQueryDTO {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  orderId?: string;
  method?: string;
}
