export const DAYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;

export type Day = (typeof DAYS)[number];

/** Fixed reference Sunday: 1 November 2026, local time. */
const REFERENCE_YEAR = 2026;
const REFERENCE_MONTH = 10;
const REFERENCE_SUNDAY = 1;

const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

function parseTime(time: string): { hours: number; minutes: number } {
  const match = TIME_PATTERN.exec(time);
  if (!match) {
    throw new Error(`Invalid time "${time}". Expected "HH:mm".`);
  }
  return { hours: Number(match[1]), minutes: Number(match[2]) };
}

/**
 * Date on the reference week for `day` at `time` (local).
 * `time` is `"HH:mm"` and defaults to `"12:00"`.
 */
export function onDay(day: Day, time = "12:00"): Date {
  const index = DAYS.indexOf(day);
  if (index === -1) {
    throw new Error(`Invalid day "${String(day)}". Expected one of: ${DAYS.join(", ")}.`);
  }
  const { hours, minutes } = parseTime(time);
  return new Date(REFERENCE_YEAR, REFERENCE_MONTH, REFERENCE_SUNDAY + index, hours, minutes, 0, 0);
}

export const sunday = (time?: string): Date => onDay("sun", time);
export const monday = (time?: string): Date => onDay("mon", time);
export const tuesday = (time?: string): Date => onDay("tue", time);
export const wednesday = (time?: string): Date => onDay("wed", time);
export const thursday = (time?: string): Date => onDay("thu", time);
export const friday = (time?: string): Date => onDay("fri", time);
export const saturday = (time?: string): Date => onDay("sat", time);
