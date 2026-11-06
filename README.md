# weekday-helpers

**`weekday-helpers` helps you test date and time rules easily without headaches.**

Testing dates in JavaScript is hard and messy. Standard dates change every day, and manual date math breaks easily. `weekday-helpers` fixes this by using a fixed reference week (`November 1, 2026`). Now you can easily create dates, test weekdays, and check business rules with clean code.

```typescript
import { onDay, holdsOnlyOn } from 'weekday-helpers';

// Get a target date and time fast
const targetDate = onDay('tuesday', '14:30');

// Check if a rule works ONLY on workdays (Monday to Friday)
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

Your tests stay clean, simple to read, and safe from timezone bugs.

---

## 📦 Installation

```bash
npm i weekday-helpers
```

Or using another package manager:

```bash
yarn add weekday-helpers
pnpm add weekday-helpers
bun add weekday-helpers
```

---

## 🚀 How to Use

### 1. Create Dates Easily (`onDay`)

Create reliable dates for any weekday, with optional time (`HH:mm`).

```typescript
import { onDay, monday, friday } from 'weekday-helpers';

// Get Tuesday at 14:30
const date = onDay('tuesday', '14:30');

// Use quick day functions
const startOfWeek = monday('09:00');
const endOfWeek = friday('18:00');
```

### 2. Test the Whole Week (`sweepWeek` & `holdsOnlyOn`)

Check your business rules across all 7 days of the week.

```typescript
import { sweepWeek, holdsOnlyOn } from 'weekday-helpers';

// Split the week into allowed and blocked days
const { allowed, blocked } = sweepWeek((date) => date.getUTCDay() !== 0, '12:00');

// Check if a rule is true ONLY on specific days
const isValid = holdsOnlyOn(['saturday', 'sunday'], (date, day) => day === 'saturday' || day === 'sunday');
```

---

## 📄 License

MIT