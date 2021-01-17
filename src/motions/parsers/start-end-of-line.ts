import { left, right } from "fp-ts/lib/Either";
import { none } from "fp-ts/lib/Option";
import { MotionParser } from "../shared";

export interface StartEndOfLineMotion {
  type: "start-end-line";
  variant: "start" | "end";
}

export const parseStartEndOfLineMotion: MotionParser<StartEndOfLineMotion> = (
  s,
) => {
  if (s.length === 0) {
    return left(none);
  }

  const variant = (() => {
    switch (s[0]) {
      case "$":
        return "end";
      case "^":
        return "start";
      default:
        return undefined;
    }
  })();

  if (!variant) {
    return left(none);
  }

  const motion: StartEndOfLineMotion = {
    type: "start-end-line",
    variant,
  };

  return right({
    motion,
    unmatchedInput: s.slice(1),
  });
};
