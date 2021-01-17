import { chain, left, orElse, right } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { isNone, none, Option, some } from "fp-ts/lib/Option";
import { parseNumber } from "./internal";
import { MotionParser } from "./shared";

export interface BasicMotion {
  type: "basic";
  direction: "up" | "down" | "left" | "right";
  lines: number;
}

const letterDirectionMapping = {
  j: "down",
  k: "up",
  h: "left",
  l: "right",
} as const;

export const parseBasicMotion: MotionParser<BasicMotion> = (s) =>
  pipe(
    parseNumber(s),
    orElse((e) =>
      isNone(e) ? right({ motion: 1, unmatchedInput: s }) : left(some(e.value)),
    ),
    chain(({ unmatchedInput, motion: lines }) => {
      const letter = unmatchedInput[0];
      if (!letterDirectionMapping.hasOwnProperty(letter)) {
        return left(none);
      }

      const direction =
        letterDirectionMapping[letter as keyof typeof letterDirectionMapping];

      const motion: BasicMotion = {
        type: "basic",
        direction,
        lines,
      };

      return right({
        motion,
        unmatchedInput: unmatchedInput.slice(1),
      });
    }),
  );
