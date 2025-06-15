/**
 * getNumberOfDaysFromNow
 *
 * Description:
 * This function calculates the number of days between the current date and a given date.
 *
 * Usage:
 * Call this function with a Date object as the argument. It will return the number of days
 * from the given date to the current date.
 *
 * Example:
 * const pastDate = new Date('2023-01-01');
 * const daysFromNow = getNumberOfDaysFromNow(pastDate);
 * Output: (number of days between January 1, 2023, and today)
 *
 * @param {Date} date - The date from which to calculate the number of days to the current date.
 * @returns {number} - The number of days from the given date to the current date.
 */
export function getNumberOfDaysFromNow(date: Date) {
  const now = new Date();
  const differenceInMilliseconds = now.getTime() - date.getTime();
  const differenceInDays = Math.floor(differenceInMilliseconds / 86400000);
  return differenceInDays;
}

/**
 * convertDifferenceOfDays
 *
 * Description:
 * This function converts a given number of days into a human-readable string in French.
 *
 * Usage:
 * Call this function with a number representing the difference in days. It will return a string
 * describing the difference in days in French.
 *
 * Example:
 * const differenceInDays = 2;
 * const readableString = convertDifferenceOfDays(differenceInDays);
 * Output: "Avant-hier"
 *
 * @param {number} differenceInDays - The number of days to convert into a human-readable string.
 * @returns {string} - A human-readable string describing the difference in days in French.
 */
export function convertDifferenceOfDays(differenceInDays: number): string {
  switch (differenceInDays) {
    case 0:
      return "Aujourd'hui";
    case 1:
      return "Hier";
    case 2:
      return "Avant-hier";
    default:
      return `${differenceInDays} jours`;
  }
}

/* ------------------------------- */
/* Convert local date to date UTC  */
/* ------------------------------- */
/*
  Input : 2023-10-01T12:00:00-04:00
  Output : 2023-10-01T16:00:00.000Z
*/
export function convertLocalDateToDateUTC(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds()));
}

/* ------------------------------------ */
/* Convert unix timestamp to Date UTC   */
/* ------------------------------------ */
/*
  Input : 811111000
  Output : Thu Sep 14 1995 22:36:40 GMT+0200 (Central European Summer Time)
*/
export function convertUTCtoDate(dateUTC: number): Date {
  return new Date(+dateUTC * 1000);
}

/* ----------------------------------------------- */
/* Month and year of a date (long or short format) */
/* ----------------------------------------------- */
/*
   Input : value: "2023-10-01", monthLength: "long"
   Output: "Octobre 2023"

   Input : value: "2023-10-01", monthLength: "short"
   Output: "Oct. 2023"
*/
export const formatExplicitMonth = (value: string | Date, monthLength: "long" | "short") => {
  const date = !(value instanceof Date) ? new Date(value) : value;
  const explicitMonth = date.toLocaleDateString("fr-FR", {
    month: monthLength,
    year: "numeric"
  });
  return explicitMonth.charAt(0).toUpperCase() + explicitMonth.slice(1);
};

/* ---------------------------------------------------- */
/* Day, month and year of a date (long or short format) */
/* ---------------------------------------------------- */
/*
  Input : value: "2023-10-01", dayLength: "long"
  Output: "1 octobre 2023"

  Input : value: "2023-10-01", dayLength: "short"
  Output: "1 oct. 2023"
*/
export const formatExplicitDay = (value: string | Date, dayLength: "long" | "short" = "long") => {
  const date = !(value instanceof Date) ? new Date(value) : value;
  const explicitDay = date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: dayLength,
    year: "numeric"
  });
  return explicitDay.charAt(0).toUpperCase() + explicitDay.slice(1);
};

/* ------------- */
/* Explicit date */
/* ------------- */
/*
  Input : Sun Aug 18 2024 18:16:35 GMT+0200 (Central European Summer Time)
  Output : 18 août 2024
*/
export function explicitDate(date: Date): string {
  const explicitDate = date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
  return explicitDate;
}

/* ---------------------------- */
/* Get first day of the month   */
/* ---------------------------- */

export function getFirstDayOfTheMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

/* ------------- */
/* Format date */
/* ------------- */
/*
  Input : date: Date, displayHour: boolean
  Output : 18 août 2024
*/
export function formatDateHour(date: Date, displayHour: boolean) {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "numeric",
    month: "long",
    ...(displayHour
      ? {
          hour: "numeric",
          minute: "numeric",
          hour12: false
        }
      : null)
  };

  let formattedDate = new Intl.DateTimeFormat("fr-FR", options).format(date);
  formattedDate = formattedDate.replace(":", "h");
  formattedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  return formattedDate;
}

/* ------------- */
/* Truncate date */
/* ------------- */
/*
  Input : Sun Aug 18 2024 18:16:35 GMT+0200 (Central European Summer Time)
  Output : Sun Aug 18 2024 00:00:00 GMT+0200 (Central European Summer Time)
*/

export function truncateDateToDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/* ------------- */
/* Are same day */
/* ------------- */

export function areSameDay(date1: Date, date2: Date): boolean {
  if (!(date1 instanceof Date) || !(date2 instanceof Date)) {
    return false;
  }
  if (isNaN(date1.getTime()) || isNaN(date2.getTime())) {
    return false;
  }
  return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
}

/* -------------- */
/* Are same month */
/* -------------- */

export function areSameMonth(date1: Date, date2: Date): boolean {
  if (!(date1 instanceof Date) || !(date2 instanceof Date)) {
    return false;
  }
  if (isNaN(date1.getTime()) || isNaN(date2.getTime())) {
    return false;
  }
  return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth();
}

/* -------------- */
/* truncateMonth  */
/* -------------- */

export function truncateMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth());
}

/* --------------------------- */
/* Convert date for date input */
/* --------------------------- */

export function convertDateForDateInput(date: Date) {
  return date.toISOString().split("T")[0];
}
