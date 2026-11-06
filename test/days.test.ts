import { describe, expect, test } from "bun:test";
import {
  DAYS,
  friday,
  monday,
  onDay,
  saturday,
  sunday,
  thursday,
  tuesday,
  wednesday,
} from "../src/index.ts";

const helpers = [sunday, monday, tuesday, wednesday, thursday, friday, saturday] as const;

describe("onDay", () => {
  test("uses the reference Sunday of 1 November 2026 at 12:00 by default", () => {
    const date = onDay("sun");
    expect(date.getFullYear()).toBe(2026);
    expect(date.getMonth()).toBe(10);
    expect(date.getDate()).toBe(1);
    expect(date.getDay()).toBe(0);
    expect(date.getHours()).toBe(12);
    expect(date.getMinutes()).toBe(0);
    expect(date.getSeconds()).toBe(0);
    expect(date.getMilliseconds()).toBe(0);
  });

  test("offsets each day from that Sunday in week order", () => {
    DAYS.forEach((day, index) => {
      const date = onDay(day);
      expect(date.getDay()).toBe(index);
      expect(date.getDate()).toBe(1 + index);
    });
  });

  test("applies an HH:mm time", () => {
    const date = onDay("wed", "09:05");
    expect(date.getDay()).toBe(3);
    expect(date.getHours()).toBe(9);
    expect(date.getMinutes()).toBe(5);
  });

  test("rejects a time that is not HH:mm", () => {
    expect(() => onDay("mon", "9:00")).toThrow('Invalid time "9:00". Expected "HH:mm".');
    expect(() => onDay("mon", "24:00")).toThrow('Invalid time "24:00". Expected "HH:mm".');
  });
});

describe("day helpers", () => {
  test("sunday through saturday match onDay", () => {
    helpers.forEach((helper, index) => {
      const day = DAYS[index]!;
      expect(helper().getTime()).toBe(onDay(day).getTime());
      expect(helper("18:45").getTime()).toBe(onDay(day, "18:45").getTime());
    });
  });
});
