import z from "zod";

export const topProductQuerySchema = z
  .object({
    period: z
      .enum(["today", "week", "month", "year", "custom"])
      .default("week"),
    startOfDate: z
      .string()
      .regex(
        /^\d{4}-\d{2}-\d{2}$/,
        "Format harus yyyy-MM-dd. Contoh: 2026-07-01",
      )
      .optional(),
    endOfDate: z
      .string()
      .regex(
        /^\d{4}-\d{2}-\d{2}$/,
        "Format harus yyyy-MM-dd. Contoh: 2026-07-01",
      )
      .optional(),
  })
  .refine(
    (data) => {
      if (data.period === "custom") {
        return !!data.startOfDate && !!data.endOfDate;
      }
      return true;
    },
    {
      message:
        "Start of date and end of date are required when period is custom",
    },
  )
  .refine(
    (data) => {
      if (data.startOfDate && data.endOfDate) {
        return new Date(data.startOfDate) <= new Date(data.endOfDate);
      }
      return true;
    },
    {
      message: "Start of date can't be greater than end of date",
    },
  );

export type DashboardQuery = z.infer<typeof topProductQuerySchema>;
