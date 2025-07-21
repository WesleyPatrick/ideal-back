import { DateAdapter } from "@domain/adapters/date";
import { Injectable } from "@nestjs/common";
import { isBefore, parseISO, format, addHours, addDays } from "date-fns";
import { toZonedTime } from "date-fns-tz";

@Injectable()
export class DateFnsIntegration implements DateAdapter {
  addDays(date: Date, days: number): Date {
    return addDays(date, days);
  }
  newDateWithAmericaSaoPauloTimezone(dateToConvert: Date): Date {
    return toZonedTime(dateToConvert, "America/Sao_Paulo");
  }
  isBefore(date: Date, compareDate: Date): boolean {
    return isBefore(date, compareDate);
  }

  parseISO(isoString: string): Date {
    return parseISO(isoString);
  }

  format(date: Date, formatString: string): string {
    return format(date, formatString);
  }

  addHours(date: Date, hours: number): Date {
    return addHours(date, hours);
  }
}
