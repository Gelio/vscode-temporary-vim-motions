import { left, right } from "fp-ts/lib/Either";
import { some } from "fp-ts/lib/Option";
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

const vimMotionRegexp = /^(\d*)(j|k|h|l)/;
export const parseBasicMotion: MotionParser<BasicMotion> = (s) => {
  const match = s.match(vimMotionRegexp);
  if (match === null) {
    // TODO: consider left(none)
    return left(some(new Error("Could not match a vim motion")));
  }

  const letter = match[2] as keyof typeof letterDirectionMapping;

  const direction = letterDirectionMapping[letter];

  let lines = 1;
  if (match[1] !== "") {
    // User provided a number
    lines = parseInt(match[1], 10);

    if (Number.isNaN(lines)) {
      return left(
        some(new Error(`Invalid number of lines provided: ${lines}`)),
      );
    }
  }

  const motion: BasicMotion = {
    type: "basic",
    direction,
    lines,
  };

  return right({
    motion,
    unmatchedInput: s.slice(match[0].length),
  });
};
