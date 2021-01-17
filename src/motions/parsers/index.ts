import { MotionParser } from "../shared";
import { BasicMotion, parseBasicMotion } from "./basic";
import { FindCharacterMotion, parseFindCharacterMotion } from "./character";
import {
  StartEndOfLineMotion,
  parseStartEndOfLineMotion,
} from "./start-end-of-line";
import { WordBoundaryMotion, parseWordBoundaryMotion } from "./word-boundary";

export type VimMotion =
  | BasicMotion
  | StartEndOfLineMotion
  | WordBoundaryMotion
  | FindCharacterMotion;

export const parsers: MotionParser<VimMotion>[] = [
  parseBasicMotion,
  parseStartEndOfLineMotion,
  parseWordBoundaryMotion,
  parseFindCharacterMotion,
];
