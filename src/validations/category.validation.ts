import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string({ message: "Name is required" })
    .min(3, { message: "Name must be at least 3 characters" }),
});

export type CreateCategoryDTO = z.infer<typeof categorySchema>;

export type UpdateCategoryDTO = Partial<CreateCategoryDTO>;
