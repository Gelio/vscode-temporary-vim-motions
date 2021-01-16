import { deepStrictEqual, ok } from "assert";
import { isLeft, right } from "fp-ts/lib/Either";
import { isNone, isSome } from "fp-ts/lib/Option";
import { BasicMotion, parseBasicMotion } from "./basic";
import { MotionParseResult } from "./shared";

describe("parseBasicMotion", () => {
  interface TestCase {
    description: string;
    input: string;
    expectedResult: MotionParseResult<BasicMotion>;
  }

  const cases: TestCase[] = [
    {
      description: "single letter down",
      input: "j",
      expectedResult: {
        length: 1,
        motion: {
          type: "basic",
          direction: "down",
          lines: 1,
        },
      },
    },
    {
      description: "single letter up",
      input: "k",
      expectedResult: {
        length: 1,
        motion: {
          type: "basic",
          direction: "up",
          lines: 1,
        },
      },
    },
    {
      description: "single letter left",
      input: "h",
      expectedResult: {
        length: 1,
        motion: {
          type: "basic",
          direction: "left",
          lines: 1,
        },
      },
    },
    {
      description: "single letter right",
      input: "l",
      expectedResult: {
        length: 1,
        motion: {
          type: "basic",
          direction: "right",
          lines: 1,
        },
      },
    },
    {
      description: "single digit lines up",
      input: "7k",
      expectedResult: {
        length: 2,
        motion: {
          type: "basic",
          direction: "up",
          lines: 7,
        },
      },
    },
    {
      description: "multiple digit lines up",
      input: "70k",
      expectedResult: {
        length: 3,
        motion: {
          type: "basic",
          direction: "up",
          lines: 70,
        },
      },
    },
    {
      description: "with trailing whitespace",
      input: "5j     ",
      expectedResult: {
        length: 2,
        motion: {
          type: "basic",
          direction: "down",
          lines: 5,
        },
      },
    },
  ];

  cases.forEach(({ description, expectedResult: expectedMotion, input }) => {
    it(`should parse ${description} (${input})`, () => {
      deepStrictEqual(parseBasicMotion(input), right(expectedMotion));
    });
  });
});

describe("unmatched motions", () => {
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
      description: "random word",
      input: "incorrect",
    },
    {
      description: "missing direction",
      input: "5",
    },
  ];

  cases.forEach(({ description, input }) => {
    it(`should not match ${description} (${input})`, () => {
      const result = parseBasicMotion(input);
      ok(isLeft(result));
      ok(isNone(result.left));
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
      description: "negative number of lines",
      input: "-5j",
    },
    {
      description: "floating point number",
      input: "5.1j",
    },
  ];

  cases.forEach(({ description, input }) => {
    it(`should reject ${description} (${input})`, () => {
      const result = parseBasicMotion(input);
      ok(isLeft(result));
    });
  });
});
