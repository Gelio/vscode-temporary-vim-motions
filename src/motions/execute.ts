import { commands } from "vscode";
import { WordBoundaryVariant } from "./parsers";
import { VimMotion } from "./vim-motion";

export const executeMotions = async (motions: VimMotion[]): Promise<void> => {
  let lastCommand: Thenable<unknown> = Promise.resolve();

  for (const motion of motions) {
    lastCommand = (() => {
      switch (motion.type) {
        case "basic":
          return commands.executeCommand("cursorMove", {
            to: motion.direction,
            value: motion.lines,
          });
        case "start-end-line":
          return commands.executeCommand(
            "cursor" + (motion.variant === "end" ? "End" : "Home"),
          );
        case "word-boundary":
          const commandsForVariants: Record<WordBoundaryVariant, string> = {
            [WordBoundaryVariant.back]: "cursorWordLeft",
            [WordBoundaryVariant.end]: "cursorWordEndRight",
            [WordBoundaryVariant.word]: "cursorWordRight",
          };
          const command = commandsForVariants[motion.variant];

          return Array.from({ length: motion.times }).reduce<Thenable<unknown>>(
            () => commands.executeCommand(command),
            Promise.resolve(),
          );
      }
    })();
  }

  await lastCommand;
};
