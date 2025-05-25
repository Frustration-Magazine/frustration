export function getHours() {
  return new Array(24)
    .fill(0)
    .map((_, index) => index)
    .slice(12);
}

export function getMinutes() {
  return new Array(4).fill(0).map((_, index) => index * 15);
}

export function convertHourToString(hour: number) {
  return hour.toString();
}

export function convertMinuteToString(minute: number) {
  return minute.toString().padStart(2, "0");
}

export function convertHourToNumber(hour: string) {
  return Number(hour.replace(/[^0-9]/g, ""));
}

export function convertMinuteToNumber(minute: string) {
  return Number(minute.replace(/[^0-9]/g, ""));
}
