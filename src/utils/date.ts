import {
  startOfDay,
  endOfDay,
  startOfWeek,
  startOfMonth,
  startOfYear,
  endOfWeek,
  endOfMonth,
  endOfYear,
} from "date-fns";

import { CustomError } from "../errors/customError";
import { fromZonedTime, toZonedTime } from "date-fns-tz";

export type PeriodeType = "today" | "week" | "month" | "year" | "custom";

export interface DateRange {
  start: Date;
  end: Date;
}

const TIME_ZONE = "Asia/Jakarta";

const now = new Date();

const jakartaZone = toZonedTime(now, TIME_ZONE);

export const getDateRange = (period: PeriodeType): DateRange => {
  switch (period) {
    case "today":
      return {
        start: fromZonedTime(startOfDay(jakartaZone), TIME_ZONE),
        end: fromZonedTime(endOfDay(jakartaZone), TIME_ZONE),
      };

    case "week":
      return {
        start: fromZonedTime(
          startOfWeek(jakartaZone, { weekStartsOn: 1 }),
          TIME_ZONE,
        ),
        end: fromZonedTime(
          endOfWeek(jakartaZone, { weekStartsOn: 1 }),
          TIME_ZONE,
        ),
      };

    case "month":
      return {
        start: fromZonedTime(startOfMonth(jakartaZone), TIME_ZONE),
        end: fromZonedTime(endOfMonth(jakartaZone), TIME_ZONE),
      };

    case "year":
      return {
        start: fromZonedTime(startOfYear(jakartaZone), TIME_ZONE),
        end: fromZonedTime(endOfYear(jakartaZone), TIME_ZONE),
      };

    default:
      throw new CustomError("Invalid period", 400);
  }
};
