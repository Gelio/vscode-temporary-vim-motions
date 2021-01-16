import { deepStrictEqual, ok } from "assert";
import { isLeft, right } from "fp-ts/lib/Either";
import { parseVimMotion, VimMotion } from "./vim-motion";

describe("parseVimMotion", () => {
  describe("single motion", () => {
    interface TestCase {
      description: string;
      input: string;
      expectedMotion: VimMotion;
    }

    const cases: TestCase[] = [
      {
        description: "single letter down",
        input: "j",
        expectedMotion: {
          direction: "down",
          lines: 1,
        },
      },
      {
        description: "single letter up",
        input: "k",
        expectedMotion: {
          direction: "up",
          lines: 1,
        },
      },
      {
        description: "single digit lines up",
        input: "7k",
        expectedMotion: {
          direction: "up",
          lines: 7,
        },
      },
      {
        description: "multiple digit lines up",
        input: "70k",
        expectedMotion: {
          direction: "up",
          lines: 70,
        },
      },
      {
        description: "with trailing whitespace",
        input: "70k    ",
        expectedMotion: {
          direction: "up",
          lines: 70,
        },
      },
    ];

    cases.forEach(({ description, expectedMotion: motion, input }) => {
      it(`should parse ${description} (${input})`, () => {
        deepStrictEqual(parseVimMotion(input), right(motion));
      });
    });
  });

  describe("invalid motions", () => {
    interface TestCase {
      description: string;
      input: string;
    }

    const cases: TestCase[] = [
      {
        description: "empty input",
        input: "",
      },
      {
        description: "unsupported motion",
        input: "gg",
      },
      {
        description: "negative number of lines",
        input: "-5j",
      },
      {
        description: "missing direction",
        input: "5",
      },
      {
        description: "floating point number",
        input: "5.1j",
      },
      {
        description: "with trailing incorrect characters",
        input: "5j incorrect",
      },
    ];

    cases.forEach(({ description, input }) => {
      it(`should reject ${description} (${input})`, () => {
        const result = parseVimMotion(input);
        ok(isLeft(result));
      });
    });
  });
});
