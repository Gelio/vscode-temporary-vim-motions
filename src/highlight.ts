import {
  Disposable,
  Range,
  TextEditor,
  TextEditorDecorationType,
} from "vscode";

export class Highlighter implements Disposable {
  constructor(
    private decoration: TextEditorDecorationType,
    private editor: TextEditor,
  ) {}

  dispose() {
    this.editor.setDecorations(this.decoration, []);
  }

  highlight() {
    this.editor.setDecorations(this.decoration, [
      getSingleCharacterWideRange(this.editor.selection),
    ]);
  }
}

function getSingleCharacterWideRange(range: Range): Range {
  return range.with(
    undefined,
    range.start.with(undefined, range.start.character + 1),
  );
}
