import { getOrElse, isLeft, map } from "fp-ts/lib/Either";
import { constNull, pipe } from "fp-ts/lib/function";
import * as vscode from "vscode";
import { enableRelativeLines } from "./relative-lines";
import { parseVimMotion } from "./vim-motion";

export function activate(context: vscode.ExtensionContext) {
  console.log("vim-motions extension is now active");

  const disposable = vscode.commands.registerCommand(
    "vim-motions.execute",
    async () => {
      const activeTextEditor = vscode.window.activeTextEditor;
      if (!activeTextEditor) {
        vscode.window.showErrorMessage(
          "Please open a file to execute a vim motion",
        );
        return;
      }
      const restoreLineNumbers = enableRelativeLines(activeTextEditor);
      const result = await vscode.window.showInputBox({
        prompt: "Enter a vim motion",
        placeHolder: "For example: 10j",
        validateInput: (s) =>
          pipe(
            s,
            parseVimMotion,
            map(constNull),
            getOrElse<Error, string | null>((e) => e.message),
          ),
      });

      restoreLineNumbers();

      if (!result) {
        return;
      }

      const vimMotion = parseVimMotion(result);
      if (isLeft(vimMotion)) {
        throw new Error(
          `Internal error, input validation is not working properly: ${vimMotion.left}`,
        );
      }

      console.log("Moving", vimMotion.right);
      vscode.commands.executeCommand("cursorMove", {
        to: vimMotion.right.direction,
        value: vimMotion.right.lines,
      });
    },
  );

  context.subscriptions.push(disposable);
}
