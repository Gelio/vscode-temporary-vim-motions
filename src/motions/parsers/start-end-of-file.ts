import { left, right } from "fp-ts/lib/Either";
import { none } from "fp-ts/lib/Option";
import { MotionParser } from "../shared";

export interface StartEndOfFileMotion {
  type: "start-end-file";
  variant: "start" | "end";
}

export const parseStartEndOfFileMotion: MotionParser<StartEndOfFileMotion> = (
  s,
) => {
  if (s.length === 0) {
    return left(none);
  }

  const parsingResult = (() => {
    if (s.slice(0, 2) === "gg") {
      return ["start", s.slice(2)] as const;
    } else if (s[0] === "G") {
      return ["end", s.slice(1)] as const;
    }

    return undefined;
  })();

  if (!parsingResult) {
    return left(none);
  }

  const motion: StartEndOfFileMotion = {
    type: "start-end-file",
    variant: parsingResult[0],
  };

  return right({
    motion,
    unmatchedInput: parsingResult[1],
  });
};
