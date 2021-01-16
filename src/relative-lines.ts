import { Disposable, TextEditor, TextEditorLineNumbersStyle } from "vscode";

export const enableRelativeLines = (editor: TextEditor): Disposable => {
  const initialValue = editor.options.lineNumbers;

  editor.options.lineNumbers = TextEditorLineNumbersStyle.Relative;

  return {
    dispose() {
      editor.options.lineNumbers = initialValue;
    },
  };
};
