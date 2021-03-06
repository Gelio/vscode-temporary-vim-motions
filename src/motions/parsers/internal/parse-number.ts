import { left, orElse, right } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { isNone, none, some } from "fp-ts/lib/Option";
import { MotionParser } from "../../shared";

const numberRegexp = /^\d+/;
export const parseNumber: MotionParser<number> = (input) => {
  const matches = input.match(numberRegexp);
  if (matches === null) {
    return left(none);
  }

  const rawNumber = matches[0];
  const parsedNumber = parseInt(rawNumber, 10);
  if (Number.isNaN(parsedNumber)) {
    return left(some(new Error(`Invalid number: ${rawNumber}`)));
  }

  return right({
    motion: parsedNumber,
    unmatchedInput: input.slice(rawNumber.length),
  });
};

export const parseOptionalNumber: MotionParser<number> = (input) =>
  pipe(
    parseNumber(input),
    orElse((e) =>
      isNone(e)
        ? right({ motion: 1, unmatchedInput: input })
        : left(some(e.value)),
    ),
  );
