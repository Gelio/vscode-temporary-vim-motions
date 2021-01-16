import { isLeft, left, right } from "fp-ts/lib/Either";
import { isSome, none } from "fp-ts/lib/Option";
import { BasicMotion, parseBasicMotion } from "./basic";
import { MotionParser } from "./shared";

// TODO: add other motion types and parses
export type VimMotion = BasicMotion;

const parsers: MotionParser<VimMotion>[] = [parseBasicMotion];

export const parseVimMotions: MotionParser<VimMotion[]> = (s: string) => {
  let leftoverInput = s;
  let parsedLength = 0;
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
        leftoverInput = leftoverInput.slice(result.right.length);
        parsedLength += result.right.length;
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
    length: parsedLength,
  });
};
