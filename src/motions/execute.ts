import { commands } from "vscode";
import { VimMotion } from "./vim-motion";

export const executeMotions = async (motions: VimMotion[]): Promise<void> => {
  let lastCommand: Thenable<unknown> = Promise.resolve();

  for (const motion of motions) {
    lastCommand = commands.executeCommand("cursorMove", {
      to: motion.direction,
      value: motion.lines,
    });
  }

  await lastCommand;
};
