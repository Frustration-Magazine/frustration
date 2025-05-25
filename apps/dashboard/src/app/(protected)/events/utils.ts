export function getHours(): number[] {
  return new Array(24)
    .fill(0)
    .map((_, index) => index)
    .slice(12);
}

export function getMinutes(): number[] {
  return new Array(4).fill(0).map((_, index) => index * 15);
}

export function convertHourToString(hour: number): string {
  return hour.toString();
}

export function convertMinuteToString(minute: number): string {
  return minute.toString().padStart(2, "0");
}

export function convertHourToNumber(hour: string): number {
  return Number(hour.replace(/[^0-9]/g, ""));
}

export function convertMinuteToNumber(minute: string): number {
  return Number(minute.replace(/[^0-9]/g, ""));
}
