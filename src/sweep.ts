import { DAYS, onDay, type Day } from "./days.js";

export type Rule = (date: Date) => boolean;

function sortDays(days: readonly Day[]): Day[] {
  const selected = new Set<Day>();
  for (const day of days) {
    if (!DAYS.includes(day)) {
      throw new Error(`Invalid day "${String(day)}". Expected one of: ${DAYS.join(", ")}.`);
    }
    selected.add(day);
  }
  return DAYS.filter((day) => selected.has(day));
}

function formatDays(days: readonly Day[]): string {
  return days.join(", ");
}

/** Which days of the reference week `rule` allows or blocks, at `time`. */
export function sweepWeek(rule: Rule, time?: string): {
  allowed: Day[];
  blocked: Day[];
} {
  const allowed: Day[] = [];
  const blocked: Day[] = [];
  for (const day of DAYS) {
    if (rule(onDay(day, time))) {
      allowed.push(day);
    } else {
      blocked.push(day);
    }
  }
  return { allowed, blocked };
}

/**
 * Checks that `rule` returns true only on `days` (week order), at `time`.
 * `message` is empty when the check passes.
 */
export function holdsOnlyOn(rule: Rule, days: Day[], time?: string): {
  pass: boolean;
  allowed: Day[];
  expected: Day[];
  message: string;
} {
  const { allowed } = sweepWeek(rule, time);
  const expected = sortDays(days);
  const pass = allowed.length === expected.length && allowed.every((day, index) => day === expected[index]);
  const message = pass
    ? ""
    : `expected rule to hold only on [${formatDays(expected)}], but it held on [${formatDays(allowed)}]`;
  return { pass, allowed, expected, message };
}
