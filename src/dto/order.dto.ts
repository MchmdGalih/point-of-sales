export interface orderItemsDTO {
  productId: string;
  quantity: number;
}

export interface CreateOrderDTO {
  customerName: string;
  orderItems: orderItemsDTO[];
}
