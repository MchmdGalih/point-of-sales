import { z } from "zod";
import { paginationSchema } from "./pagination.validation";
import { OrderStatus } from "../../generated/prisma/enums";

export const orderQuerySchema = paginationSchema.extend({
  search: z.string().trim().optional(),
  status: z.nativeEnum(OrderStatus).optional(),
});

export type OrderQueryRequest = z.infer<typeof orderQuerySchema>;

export const orderSchema = z.object({
  customerName: z
    .string({ message: "Customer name is required" })
    .min(3, { message: "Name must be at least 3 characters" }),
  orderItems: z.array(
    z.object({
      productId: z
        .string({ message: "Product id is required" })
        .uuid({ message: "Invalid product id" }),
      quantity: z.number({ message: "Quantity is required" }).min(1, {
        message: "Quantity must be at least 1",
      }),
    }),
  ),
});

export type CreateOrderPayload = z.infer<typeof orderSchema>;
