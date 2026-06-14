import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(3),
  price: z.coerce.number().min(1),
  stock: z.coerce.number().min(1),
  categoryId: z.string().min(1),
});

export const UpdateProductSchema = productSchema.partial();

export type ProductDTO = z.infer<typeof productSchema>;
export type UpdateProductPayload = z.infer<typeof UpdateProductSchema>;
