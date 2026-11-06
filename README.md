```ts
import { friday, holdsOnlyOn } from "weekday-test";

const weekendsOnly = (date: Date) => date.getDay() === 0 || date.getDay() === 6;

const result = holdsOnlyOn(weekendsOnly, ["sat", "sun"]);
console.log(result.pass, friday("09:30"));
```

# weekday-test

Test business rules that depend on the day of the week without hand-writing dates or comments like "this is a Wednesday". Dates come from a fixed reference week (Sunday 1 November 2026, local time), so results stay deterministic.

## Install

```bash
npm i weekday-test
```

```bash
bun add weekday-test
```

## API

`Day` is `"sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat"`. `DAYS` lists them in that week order. A `Rule` is `(date: Date) => boolean`.

### `onDay(day, time?)`

Returns a `Date` on the reference week for `day`. `time` is `"HH:mm"` and defaults to `"12:00"`.

### `sunday(time?)` … `saturday(time?)`

Same as `onDay` for one weekday. `wednesday()` is a Wednesday (`Date#getDay() === 3`).

### `sweepWeek(rule, time?)`

Runs `rule` once per day at `time` (default `"12:00"`).

```ts
sweepWeek(weekendsOnly);
// { allowed: ["sun", "sat"], blocked: ["mon", "tue", "wed", "thu", "fri"] }
```

`allowed` and `blocked` are always in week order.

### `holdsOnlyOn(rule, days, time?)`

Compares the days `rule` allows with `days`. `expected` is `days` sorted into week order. `pass` is true when `allowed` and `expected` match.

```ts
holdsOnlyOn(weekendsOnly, ["sat", "sun"]);
// { pass: true, allowed: ["sun", "sat"], expected: ["sun", "sat"], message: "" }
```

On failure, `message` looks like:

```text
expected rule to hold only on [sun, sat], but it held on [mon]
```

## Roadmap

- `freezeTime()` wrapper around fake timers
- `atBoundaries()` edge-case generator
- Test-runner matchers (`expect.extend` for Bun, Vitest, and Jest)
- Time zone parameter, daylight-saving handling, and holidays

## License

MIT. See [LICENSE](LICENSE).
