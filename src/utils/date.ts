import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  isAfter,
} from "date-fns";

import { fromZonedTime, toZonedTime } from "date-fns-tz";
import { CustomError } from "../errors/customError";

export type PeriodeType = "today" | "week" | "month" | "year" | "custom";

export interface DateRange {
  start: Date;
  end: Date;
}

const TIME_ZONE = "Asia/Jakarta";

const toJakartaStartOf = (date: Date, fn: (d: Date) => Date): Date => {
  const jakartaDate = toZonedTime(date, TIME_ZONE);
  const result = fn(jakartaDate);
  return fromZonedTime(result, TIME_ZONE);
};

export const getDateRange = (
  period: PeriodeType,
  customStart?: string,
  customEnd?: string,
): DateRange => {
  const now = new Date();

  switch (period) {
    case "today":
      return {
        start: toJakartaStartOf(now, startOfDay),
        end: toJakartaStartOf(now, endOfDay),
      };

    case "week":
      return {
        start: toJakartaStartOf(now, (d) =>
          startOfWeek(d, { weekStartsOn: 1 }),
        ),
        end: toJakartaStartOf(now, endOfDay),
      };

    case "month":
      return {
        start: toJakartaStartOf(now, startOfMonth),
        end: toJakartaStartOf(now, endOfDay),
      };

    case "year":
      return {
        start: toJakartaStartOf(now, startOfYear),
        end: toJakartaStartOf(now, endOfDay),
      };

    case "custom":
      if (!customStart || !customEnd) {
        throw new CustomError("Missing start or end date", 400);
      }

      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(customStart) || !dateRegex.test(customEnd)) {
        throw new Error("Format tanggal harus yyyy-MM-dd. Contoh: 2026-07-01");
      }
      const start = fromZonedTime(`${customStart} 00:00:00`, TIME_ZONE);
      const end = fromZonedTime(`${customEnd} 23:59:59.999`, TIME_ZONE);

      if (isAfter(start, end)) {
        throw new Error("customStart tidak boleh lebih besar dari customEnd");
      }
      return { start, end };
  }
};
