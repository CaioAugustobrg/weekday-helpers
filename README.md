# weekday-test

Readable weekday and time helpers designed to make automated testing of time-dependent business rules easier and more standardized.

## 📦 Installation

Add the package to your project using your preferred package manager:

```bash
npm i weekday-test
# or
yarn add weekday-test
# or
pnpm add weekday-test
# or
bun add weekday-test
```

---

## 🚀 How to Use

### 1. Creating reference dates for tests (`onDay`)
The `onDay` function allows you to anchor a reference date (based on a default Sunday: `November 1, 2026`) and easily offset to any day of the week, applying an optional time in `HH:mm` format.

```javascript
import { onDay, sunday, monday, friday } from 'weekday-test';

// Creates a Date object pointing to the next Tuesday at 14:30
const ruleDate = onDay('tuesday', '14:30');

// You can also use specific weekday helper functions directly:
const targetSunday = sunday('08:00');
const targetMonday = monday('09:00');
const targetFriday = friday('18:00');
```

### 2. Validating rules per period (`sweepWeek` and `holdsOnlyOn`)
Ideal for testing whether a specific business rule applies (or is blocked) on the correct days of the week.

* **`sweepWeek(ruleFn, time?)`**: Runs a validation function for all days of the week in order, separating what passed (`allowed`) from what was blocked (`blocked`).
* **`holdsOnlyOn(expectedDays, ruleFn, time?)`**: Checks if a rule holds true **exclusively** on the days specified in the list.

```javascript
import { holdsOnlyOn, sweepWeek } from 'weekday-test';

// Example: Test if business hours occur only from Monday to Friday
const isBusinessHours = (date) => {
  const day = date.getDay();
  return day >= 1 && day <= 5; // Monday (1) to Friday (5)
};

// Validates if the rule holds only on the expected days
const result = holdsOnlyOn(['monday', 'tuesday', 'wednesday', 'thursday', 'friday'], isBusinessHours, '10:00');

console.log(result); // true or false
```

---

## 📂 Source Code of the Initial Version (`v0.1.0`)

### `src/index.ts` (Entry Point)
```typescript
const REFERENCE_SUNDAY = new Date('2026-11-01T12:00:00Z');

const WEEKDAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;

export type Weekday = (typeof WEEKDAYS)[number];

export function parseTime(time: string): { hours: number; minutes: number } {
  if (!/^\d{2}:\d{2}$/.test(time)) {
    throw new Error(`Invalid time format: "${time}". Expected HH:mm`);
  }
  const [hoursStr, minutesStr] = time.split(':');
  const hours = Number(hoursStr);
  const minutes = Number(minutesStr);
  if (hours > 23 || minutes > 59) {
    throw new Error(`Invalid time values in: "${time}"`);
  }
  return { hours, minutes };
}

export function onDay(day: Weekday, time?: string): Date {
  const index = WEEKDAYS.indexOf(day);
  if (index === -1) {
    throw new Error(`Unknown weekday: "${day}"`);
  }
  const result = new Date(REFERENCE_SUNDAY);
  result.setUTCDate(REFERENCE_SUNDAY.getUTCDate() + index);

  if (time) {
    const { hours, minutes } = parseTime(time);
    result.setUTCHours(hours, minutes, 0, 0);
  }
  return result;
}

export const sunday = (time?: string) => onDay('sunday', time);
export const monday = (time?: string) => onDay('monday', time);
export const tuesday = (time?: string) => onDay('tuesday', time);
export const wednesday = (time?: string) => onDay('wednesday', time);
export const thursday = (time?: string) => onDay('thursday', time);
export const friday = (time?: string) => onDay('friday', time);
export const saturday = (time?: string) => onDay('saturday', time);

export function sweepWeek(rule: (date: Date, day: Weekday) => boolean, time?: string) {
  const allowed: Weekday[] = [];
  const blocked: Weekday[] = [];

  for (const day of WEEKDAYS) {
    const date = onDay(day, time);
    if (rule(date, day)) {
      allowed.push(day);
    } else {
      blocked.push(day);
    }
  }

  return { allowed, blocked };
}

export function holdsOnlyOn(expectedDays: Weekday[], rule: (date: Date, day: Weekday) => boolean, time?: string): boolean {
  const normalizedExpected = Array.from(new Set(expectedDays)).sort(
    (a, b) => WEEKDAYS.indexOf(a) - WEEKDAYS.indexOf(b)
  );

  const { allowed } = sweepWeek(rule, time);
  const sortedAllowed = allowed.sort(
    (a, b) => WEEKDAYS.indexOf(a) - WEEKDAYS.indexOf(b)
  );

  if (sortedAllowed.length !== normalizedExpected.length) {
    return false;
  }

  return sortedAllowed.every((day, idx) => day === normalizedExpected[idx]);
}
```

### `test/days.test.ts` (Day Tests)
```typescript
import { describe, it, expect } from 'bun:test';
import { onDay, sunday, monday, tuesday, wednesday, thursday, friday, saturday } from '../src/index';

describe('onDay', () => {
  it('uses the reference Sunday of 1 November 2026 at 12:00 by default', () => {
    const d = onDay('sunday');
    expect(d.toISOString()).toBe('2026-11-01T12:00:00.000Z');
  });

  it('offsets each day from that Sunday in week order', () => {
    expect(sunday().toISOString()).toBe('2026-11-01T12:00:00.000Z');
    expect(monday().toISOString()).toBe('2026-11-02T12:00:00.000Z');
    expect(tuesday().toISOString()).toBe('2026-11-03T12:00:00.000Z');
    expect(wednesday().toISOString()).toBe('2026-11-04T12:00:00.000Z');
    expect(thursday().toISOString()).toBe('2026-11-05T12:00:00.000Z');
    expect(friday().toISOString()).toBe('2026-11-06T12:00:00.000Z');
    expect(saturday().toISOString()).toBe('2026-11-07T12:00:00.000Z');
  });

  it('applies an HH:mm time', () => {
    const d = onDay('wednesday', '08:45');
    expect(d.toISOString()).toBe('2026-11-04T08:45:00.000Z');
  });

  it('rejects a time that is not HH:mm', () => {
    expect(() => onDay('monday', '8:45')).toThrow();
    expect(() => onDay('monday', '25:00')).toThrow();
  });
});

describe('day helpers', () => {
  it('sunday through saturday match onDay', () => {
    expect(sunday('10:00').toISOString()).toBe(onDay('sunday', '10:00').toISOString());
    expect(monday('10:00').toISOString()).toBe(onDay('monday', '10:00').toISOString());
    expect(tuesday('10:00').toISOString()).toBe(onDay('tuesday', '10:00').toISOString());
    expect(wednesday('10:00').toISOString()).toBe(onDay('wednesday', '10:00').toISOString());
    expect(thursday('10:00').toISOString()).toBe(onDay('thursday', '10:00').toISOString());
    expect(friday('10:00').toISOString()).toBe(onDay('friday', '10:00').toISOString());
    expect(saturday('10:00').toISOString()).toBe(onDay('saturday', '10:00').toISOString());
  });
});
```

### `test/sweep.test.ts` (Sweep Tests)
```typescript
import { describe, it, expect } from 'bun:test';
import { sweepWeek, holdsOnlyOn } from '../src/index';

describe('sweepWeek', () => {
  it('splits the week into allowed and blocked days in week order', () => {
    const result = sweepWeek((_, day) => day === 'saturday' || day === 'sunday');
    expect(result.allowed).toEqual(['sunday', 'saturday']);
    expect(result.blocked).toEqual(['monday', 'tuesday', 'wednesday', 'thursday', 'friday']);
  });

  it('passes the time through to each day', () => {
    sweepWeek((date) => {
      expect(date.getUTCHours()).toBe(9);
      expect(date.getUTCMinutes()).toBe(15);
      return true;
    }, '09:15');
  });
});

describe('holdsOnlyOn', () => {
  it('passes when the rule holds on exactly the expected days', () => {
    const ok = holdsOnlyOn(['saturday', 'sunday'], (_, day) => day === 'saturday' || day === 'sunday');
    expect(ok).toBe(true);
  });

  it('sorts expected days into week order and reports a mismatch', () => {
    const ok = holdsOnlyOn(['monday', 'sunday'], (_, day) => day === 'monday');
    expect(ok).toBe(false);
  });

  it('treats duplicate expected days as one day', () => {
    const ok = holdsOnlyOn(['monday', 'monday'], (_, day) => day === 'monday');
    expect(ok).toBe(true);
  });

  it('forwards time to the rule', () => {
    const ok = holdsOnlyOn(['monday'], (date) => date.getUTCHours() === 14, '14:00');
    expect(ok).toBe(true);
  });
});
```

## 📄 License
MIT