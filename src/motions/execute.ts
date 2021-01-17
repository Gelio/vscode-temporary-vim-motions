import { commands } from "vscode";
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
      }
    })();
  }

  await lastCommand;
};
