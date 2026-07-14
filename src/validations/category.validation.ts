import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string({ message: "Name is required" })
    .trim()
    .min(3, { message: "Name must be at least 3 characters" }),
});

export const updateCategorySchema = categorySchema.partial();
