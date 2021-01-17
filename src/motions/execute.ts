import { commands, TextEditor } from "vscode";
import { VimMotion } from "./parsers";
import { WordBoundaryVariant } from "./parsers/word-boundary";

export const executeMotions = (editor: TextEditor) => async (
  motions: VimMotion[],
): Promise<void> => {
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

        case "find-character":
          const currentLine = editor.selection.active;
          const lineText = editor.document.lineAt(currentLine.line).text;
          const initialCharacterIndex = currentLine.character;
          let destinationCharacterIndex = initialCharacterIndex;

          for (let i = 0; i < motion.times; i++) {
            const nextIndex = lineText.indexOf(
              motion.character,
              destinationCharacterIndex + 1,
            );

            if (nextIndex === -1) {
              console.log(
                `Could not find character ${motion.character} times ${motion.times}`,
              );
              return Promise.resolve();
            }

            destinationCharacterIndex = nextIndex;
          }

          return commands.executeCommand("cursorMove", {
            to: "right",
            value: destinationCharacterIndex - initialCharacterIndex,
          });
      }
    })();
  }

  await lastCommand;
};
