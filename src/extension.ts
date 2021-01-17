import { some } from "fp-ts/lib/Option";
import * as vscode from "vscode";
import {
  createRootDisposer,
  HierarchicalDisposer,
  withExistingDisposer,
} from "./hierarchical-disposer";
import { Highlighter } from "./highlight";
import { processVimMotionInput } from "./input";
import { enableRelativeLines } from "./relative-lines";
import { enableScrollPadding } from "./scroll-padding";

export function activate(context: vscode.ExtensionContext) {
  console.log("vim-motions extension is now active");
  const destinationCursorDecoration = vscode.window.createTextEditorDecorationType(
    {
      backgroundColor: new vscode.ThemeColor("editor.selectionBackground"),
    },
  );

  const disposable = vscode.commands.registerCommand(
    "vim-motions.execute",
    () =>
      withExistingDisposer(
        createRootDisposer(context.subscriptions),
        async (disposer) => {
          const activeTextEditor = vscode.window.activeTextEditor;
          if (!activeTextEditor) {
            vscode.window.showErrorMessage(
              "Please open a file to execute a vim motion",
            );
            return;
          }

          const initialSelection = activeTextEditor.selection;

          if (!initialSelection.isEmpty) {
            vscode.window.showErrorMessage(
              "Executing vim motions with an active selection",
            );
            return;
          }

          const highlighter = new Highlighter(
            destinationCursorDecoration,
            activeTextEditor,
          );
          disposer.add(highlighter);
          disposer.add(enableRelativeLines(activeTextEditor));
          disposer.add(await enableScrollPadding(5));

          await processVimMotionInput({
            disposer: new HierarchicalDisposer(some(disposer)),
            editor: activeTextEditor,
            highlighter,
          });
        },
      ),
  );

  context.subscriptions.push(disposable, destinationCursorDecoration);
}
