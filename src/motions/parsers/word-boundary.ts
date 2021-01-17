import { chain, left, right } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { none } from "fp-ts/lib/Option";
import { MotionParser } from "../shared";
import { parseOptionalNumber } from "./internal";

export enum WordBoundaryVariant {
  word = "w",
  back = "b",
  end = "e",
}

export interface WordBoundaryMotion {
  type: "word-boundary";
  variant: WordBoundaryVariant;
  times: number;
}

export const parseWordBoundaryMotion: MotionParser<WordBoundaryMotion> = (
  input,
) =>
  pipe(
    parseOptionalNumber(input),
    chain(({ motion: times, unmatchedInput }) => {
      const letter = unmatchedInput[0];
      if (!Object.values(WordBoundaryVariant).includes(letter as any)) {
        return left(none);
      }

      const motion: WordBoundaryMotion = {
        type: "word-boundary",
        variant: letter as WordBoundaryVariant,
        times,
      };

      return right({
        motion,
        unmatchedInput: unmatchedInput.slice(1),
      });
    }),
  );
