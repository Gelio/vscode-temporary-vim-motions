import { deepStrictEqual, ok } from "assert";
import { isLeft, isRight } from "fp-ts/lib/Either";
import { VimMotion } from "./parsers";
import { parseVimMotions } from "./vim-motion";

describe("parseVimMotions", () => {
  describe("valid motions", () => {
    interface TestCase {
      description: string;
      input: string;
      expectedMotions: VimMotion[];
      unmatchedInput?: string;
    }

    const cases: TestCase[] = [
      {
        description: "two motions without numbers",
        input: "jj",
        expectedMotions: [
          {
            type: "basic",
            direction: "down",
            lines: 1,
          },
          {
            type: "basic",
            direction: "down",
            lines: 1,
          },
        ],
      },
      {
        description: "two motions with numbers",
        input: "2k3j",
        expectedMotions: [
          {
            type: "basic",
            direction: "up",
            lines: 2,
          },
          {
            type: "basic",
            direction: "down",
            lines: 3,
          },
        ],
      },
      {
        description: "five motions",
        input: "2k3jj10j2k",
        expectedMotions: [
          {
            type: "basic",
            direction: "up",
            lines: 2,
          },
          {
            type: "basic",
            direction: "down",
            lines: 3,
          },
          {
            type: "basic",
            direction: "down",
            lines: 1,
          },
          {
            type: "basic",
            direction: "down",
            lines: 10,
          },
          {
            type: "basic",
            direction: "up",
            lines: 2,
          },
        ],
      },
    ];

    cases.forEach(
      ({ description, expectedMotions, input, unmatchedInput = "" }) => {
        it(`should parse ${description} (${input})`, () => {
          const result = parseVimMotions(input);
          ok(isRight(result));

          deepStrictEqual(result.right.unmatchedInput, unmatchedInput);
          deepStrictEqual(result.right.motion, expectedMotions);
        });
      },
    );
  });

  describe("invalid motions", () => {
    interface TestCase {
      description: string;
      input: string;
    }

    const cases: TestCase[] = [
      {
        description: "random word",
        input: "random word",
      },
      {
        description: "unsupported motion",
        input: "gg",
      },
    ];

    cases.forEach(({ description, input }) => {
      it(`should not parse ${description} (${input})`, () => {
        const result = parseVimMotions(input);
        ok(isLeft(result));
      });
    });
  });
});
