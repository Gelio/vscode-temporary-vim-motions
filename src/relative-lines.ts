import { TextEditor, TextEditorLineNumbersStyle } from "vscode";

export const enableRelativeLines = (editor: TextEditor) => {
  const initialValue = editor.options.lineNumbers;

  editor.options.lineNumbers = TextEditorLineNumbersStyle.Relative;

  return function restore() {
    editor.options.lineNumbers = initialValue;
  };
};
