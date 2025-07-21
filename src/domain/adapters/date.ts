export abstract class DateAdapter {
  abstract isBefore(date: Date, compareDate: Date): boolean;
  abstract parseISO(isoString: string): Date;
  abstract format(date: Date, formatString: string): string;
  abstract addHours(date: Date, hours: number): Date;
  abstract newDateWithAmericaSaoPauloTimezone(dateToConvert: Date): Date;
  abstract addDays(date: Date, days: number): Date;
}
