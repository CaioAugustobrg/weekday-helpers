# weekday-test

**`weekday-test` delivers clean, predictable weekday and time helpers designed to make testing time-dependent business rules simple and expressive.**

Testing logic tied to specific days of the week often leads to brittle date math, repetitive setup code, and tests that are hard to read at a glance. By anchoring dates to a fixed reference week (`November 1, 2026`) and providing expressive helper utilities, `weekday-test` gives you a clean way to mock, sweep, and assert weekly schedules without managing raw Javascript `Date` offsets manually.

```typescript
import { onDay, holdsOnlyOn } from 'weekday-test';

// Target a specific day and time instantly
const targetDate = onDay('tuesday', '14:30');

// Verify that a business rule holds EXCLUSIVELY on business days
const isBusinessHours = (date: Date) => {
  const day = date.getUTCDay();
  return day >= 1 && day <= 5;
};

const holdsOnWorkdays = holdsOnlyOn(
  ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
  isBusinessHours,
  '10:00'
);
// returns true
```

Your test suites stay completely readable, self-documenting, and isolated from timezone artifacts or floating dates, ensuring your time-based business rules behave correctly under every condition.

---

## 📦 Installation

```bash
npm i weekday-test
```

Or using your preferred package manager:

```bash
yarn add weekday-test
# or
pnpm add weekday-test
# or
bun add weekday-test
```

---

## 🚀 Key Features & Usage

### 1. Simple Day Anchoring (`onDay`)

Generate reliable reference date objects for any day of the week with optional `HH:mm` time formatting.

```typescript
import { onDay, monday, friday } from 'weekday-test';

// Using onDay directly
const date = onDay('tuesday', '14:30');

// Using explicit day shortcuts
const startOfWeek = monday('09:00');
const endOfWeek = friday('18:00');
```

### 2. Full-Week Sweeps (`sweepWeek` & `holdsOnlyOn`)

Validate your rules against every single day of the week effortlessly.

```typescript
import { sweepWeek, holdsOnlyOn } from 'weekday-test';

// Separate allowed and blocked days across an entire week
const { allowed, blocked } = sweepWeek((date) => date.getUTCDay() !== 0, '12:00');

// Assert that a condition is true ONLY on expected days
const isValid = holdsOnlyOn(['saturday', 'sunday'], (date, day) => day === 'saturday' || day === 'sunday');
```

---

## 📄 License

MIT