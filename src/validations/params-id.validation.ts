import z from "zod";

export const paramsIdSchema = z.object({
  id: z
    .string({
      message: "User id is required",
    })
    .uuid({ message: "Invalid user id" }),
});
