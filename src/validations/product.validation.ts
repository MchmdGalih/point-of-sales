import { z } from "zod";

export const productSchema = z.object({
  name: z
    .string({ message: "Name is required" })
    .min(3, { message: "Name must be at least 3 characters" }),
  price: z.coerce
    .number({ message: "Price is required" })
    .min(1, { message: "Price must be at least 1" }),
  stock: z.coerce
    .number({ message: "Stock is required" })
    .min(1, { message: "Stock must be at least 1" }),
  categoryId: z
    .string({ message: "Category id is required" })
    .uuid("Invalid category id"),
});

export const UpdateProductSchema = productSchema.partial();
