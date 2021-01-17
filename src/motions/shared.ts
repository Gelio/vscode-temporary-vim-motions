import { Either } from "fp-ts/lib/Either";
import { Option } from "fp-ts/lib/Option";

export interface MotionParseResult<M> {
  motion: M;
  unmatchedInput: string;
}

/**
 * Tries to parse input. Returns Right when it was matched.
 * Returns left when it could not be matched.
 *
 * When some other parser can match the string, should return None.
 * When no other parser can match this string, should return Some<Error>.
 */
export type MotionParser<M> = (
  input: string,
) => Either<Option<Error>, MotionParseResult<M>>;
