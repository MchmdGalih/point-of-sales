import z from "zod";

export const topProductQuerySchema = z.object({
  period: z.enum(["today", "week", "month", "year"]).default("week"),
});

export type DashboardQuery = z.infer<typeof topProductQuerySchema>;
