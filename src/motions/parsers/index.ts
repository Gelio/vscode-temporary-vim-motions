import { MotionParser } from "../shared";
import { BasicMotion, parseBasicMotion } from "./basic";
import { FindCharacterMotion, parseFindCharacterMotion } from "./character";
import {
  parseStartEndOfFileMotion,
  StartEndOfFileMotion,
} from "./start-end-of-file";
import {
  StartEndOfLineMotion,
  parseStartEndOfLineMotion,
} from "./start-end-of-line";
import { WordBoundaryMotion, parseWordBoundaryMotion } from "./word-boundary";

export type VimMotion =
  | BasicMotion
  | StartEndOfLineMotion
  | WordBoundaryMotion
  | FindCharacterMotion
  | StartEndOfFileMotion;

export const parsers: MotionParser<VimMotion>[] = [
  parseBasicMotion,
  parseStartEndOfLineMotion,
  parseWordBoundaryMotion,
  parseFindCharacterMotion,
  parseStartEndOfFileMotion,
];
