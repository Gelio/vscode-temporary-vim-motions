import { isLeft, left, right } from "fp-ts/lib/Either";
import { isSome, none } from "fp-ts/lib/Option";
import { parsers, VimMotion } from "./parsers";
import { MotionParser } from "./shared";

export const parseVimMotions: MotionParser<VimMotion[]> = (s: string) => {
  let leftoverInput = s;
  const motions: VimMotion[] = [];

  while (leftoverInput.length > 0) {
    let noMatches = true;

    for (const parser of parsers) {
      const result = parser(leftoverInput);

      if (isLeft(result)) {
        if (isSome(result.left)) {
          return result;
        }
      } else {
        noMatches = false;
        motions.push(result.right.motion);
        leftoverInput = result.right.unmatchedInput;
        break;
      }
    }

    if (noMatches) {
      break;
    }
  }

  if (motions.length === 0) {
    return left(none);
  }

  return right({
    motion: motions,
    unmatchedInput: leftoverInput,
  });
};
