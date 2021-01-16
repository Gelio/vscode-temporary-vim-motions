import { deepStrictEqual, ok } from "assert";
import { isLeft, right } from "fp-ts/lib/Either";
import { parseVimMotions, VimMotion } from "./vim-motion";

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
        description: "single letter left",
        input: "h",
        expectedMotion: {
          direction: "left",
          lines: 1,
        },
      },
      {
        description: "single letter right",
        input: "l",
        expectedMotion: {
          direction: "right",
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
    ];

    cases.forEach(({ description, expectedMotion, input }) => {
      it(`should parse ${description} (${input})`, () => {
        deepStrictEqual(parseVimMotions(input), right([expectedMotion]));
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
        description: "with trailing whitespace",
        input: "5j     ",
      },
      {
        description: "with trailing incorrect characters",
        input: "5j incorrect",
      },
    ];

    cases.forEach(({ description, input }) => {
      it(`should reject ${description} (${input})`, () => {
        const result = parseVimMotions(input);
        ok(isLeft(result));
      });
    });
  });

  describe("multiple motions", () => {
    interface TestCase {
      description: string;
      input: string;
      expectedMotions: VimMotion[];
    }

    const cases: TestCase[] = [
      {
        description: "two motions without numbers",
        input: "jj",
        expectedMotions: [
          {
            direction: "down",
            lines: 1,
          },
          {
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
            direction: "up",
            lines: 2,
          },
          {
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
            direction: "up",
            lines: 2,
          },
          {
            direction: "down",
            lines: 3,
          },
          {
            direction: "down",
            lines: 1,
          },
          {
            direction: "down",
            lines: 10,
          },
          {
            direction: "up",
            lines: 2,
          },
        ],
      },
    ];

    cases.forEach(({ description, expectedMotions, input }) => {
      it(`should parse ${description} (${input})`, () => {
        deepStrictEqual(parseVimMotions(input), right(expectedMotions));
      });
    });
  });
});
