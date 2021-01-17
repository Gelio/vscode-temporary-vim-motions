import { chain, left, right } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { none } from "fp-ts/lib/Option";
import { MotionParser } from "../shared";
import { parseOptionalNumber } from "./internal";

export interface FindCharacterMotion {
  type: "find-character";
  character: string;
  times: number;
}

export const parseFindCharacterMotion: MotionParser<FindCharacterMotion> = (
  input,
) =>
  pipe(
    parseOptionalNumber(input),
    chain(({ motion: times, unmatchedInput }) => {
      if (unmatchedInput.length < 2 || unmatchedInput[0] !== "f") {
        return left(none);
      }
      const character = unmatchedInput[1];

      const motion: FindCharacterMotion = {
        type: "find-character",
        character,
        times,
      };

      return right({
        motion,
        unmatchedInput: unmatchedInput.slice(2),
      });
    }),
  );
