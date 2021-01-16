import { Either, left, right } from "fp-ts/lib/Either";

export interface VimMotion {
  direction: "up" | "down";
  lines: number;
}

const vimMotionRegexp = /(\d*)(j|k)/;
export function parseVimMotion(s: string): Either<Error, VimMotion> {
  const match = s.trim().match(vimMotionRegexp);
  if (match === null) {
    return left(new Error("Could not match a vim motion"));
  }

  const direction = match[match.length - 1] === "j" ? "down" : "up";

  let lines = 1;
  if (match.length === 3) {
    // User provided a number
    lines = parseInt(match[1], 10);

    if (Number.isNaN(lines)) {
      return left(new Error(`Invalid number of lines provided: ${lines}`));
    }
  }

  return right({
    direction,
    lines,
  });
}
