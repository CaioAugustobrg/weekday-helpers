import { describe, expect, test } from "bun:test";
import { holdsOnlyOn, sweepWeek, type Day, type Rule } from "../src/index.ts";

const weekendsOnly: Rule = (date) => date.getDay() === 0 || date.getDay() === 6;
const mondayOnly: Rule = (date) => date.getDay() === 1;
const never: Rule = () => false;

describe("sweepWeek", () => {
  test("splits the week into allowed and blocked days in week order", () => {
    expect(sweepWeek(weekendsOnly)).toEqual({
      allowed: ["sun", "sat"],
      blocked: ["mon", "tue", "wed", "thu", "fri"],
    });
  });

  test("passes the time through to each day", () => {
    const seen: string[] = [];
    const rule: Rule = (date) => {
      seen.push(`${date.getDay()}:${date.getHours()}:${date.getMinutes()}`);
      return false;
    };
    expect(sweepWeek(rule, "07:30")).toEqual({
      allowed: [],
      blocked: ["sun", "mon", "tue", "wed", "thu", "fri", "sat"],
    });
    expect(seen).toEqual([
      "0:7:30",
      "1:7:30",
      "2:7:30",
      "3:7:30",
      "4:7:30",
      "5:7:30",
      "6:7:30",
    ]);
  });
});

describe("holdsOnlyOn", () => {
  test("passes when the rule holds on exactly the expected days", () => {
    const result = holdsOnlyOn(weekendsOnly, ["sat", "sun"]);
    expect(result.pass).toBe(true);
    expect(result.allowed).toEqual(["sun", "sat"]);
    expect(result.expected).toEqual(["sun", "sat"]);
    expect(result.message).toBe("");
  });

  test("sorts expected days into week order and reports a mismatch", () => {
    const result = holdsOnlyOn(mondayOnly, ["sat", "sun"] as Day[]);
    expect(result.pass).toBe(false);
    expect(result.allowed).toEqual(["mon"]);
    expect(result.expected).toEqual(["sun", "sat"]);
    expect(result.message).toBe(
      "expected rule to hold only on [sun, sat], but it held on [mon]",
    );
  });

  test("treats duplicate expected days as one day", () => {
    const result = holdsOnlyOn(never, ["fri", "fri", "mon"]);
    expect(result.expected).toEqual(["mon", "fri"]);
    expect(result.allowed).toEqual([]);
    expect(result.message).toBe("expected rule to hold only on [mon, fri], but it held on []");
  });

  test("forwards time to the rule", () => {
    const morningOnly: Rule = (date) => date.getHours() < 12;
    expect(holdsOnlyOn(morningOnly, ["sun", "mon", "tue", "wed", "thu", "fri", "sat"], "09:00").pass).toBe(
      true,
    );
    expect(holdsOnlyOn(morningOnly, [], "15:00").pass).toBe(true);
  });
});
