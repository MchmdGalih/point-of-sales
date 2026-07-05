import z from "zod";

export const topProductQuerySchema = z.object({
  period: z.enum(["today", "week", "month"]).default("week"),
});
