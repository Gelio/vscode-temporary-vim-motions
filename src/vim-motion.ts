import { Either, isLeft, left, right } from "fp-ts/lib/Either";

export interface VimMotion {
  direction: "up" | "down";
  lines: number;
}

export function parseVimMotions(s: string): Either<Error, VimMotion[]> {
  if (s.length === 0) {
    return left(new Error("Empty vim motion"));
  }

  let leftoverInput = s;
  const motions: VimMotion[] = [];

  while (leftoverInput.length > 0) {
    const result = parseVimMotion(leftoverInput);

    if (isLeft(result)) {
      return left(result.left);
    }

    motions.push(result.right.motion);
    leftoverInput = leftoverInput.slice(result.right.length);
  }

  return right(motions);
}

interface MotionParseResult {
  motion: VimMotion;
  length: number;
}

const vimMotionRegexp = /^(\d*)(j|k)/;
function parseVimMotion(s: string): Either<Error, MotionParseResult> {
  const match = s.match(vimMotionRegexp);
  if (match === null) {
    return left(new Error("Could not match a vim motion"));
  }

  const direction = match[2] === "j" ? "down" : "up";

  let lines = 1;
  if (match[1] !== "") {
    // User provided a number
    lines = parseInt(match[1], 10);

    if (Number.isNaN(lines)) {
      return left(new Error(`Invalid number of lines provided: ${lines}`));
    }
  }

  return right({
    motion: {
      direction,
      lines,
    },
    length: match[0].length,
  });
}
