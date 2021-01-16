import { isLeft } from "fp-ts/lib/Either";
import { none, some } from "fp-ts/lib/Option";
import {
  commands,
  Disposable,
  InputBox,
  Selection,
  TextEditor,
  window,
} from "vscode";
import {
  HierarchicalDisposer,
  withChildDisposer,
} from "./hierarchical-disposer";
import { Highlighter } from "./highlight";
import { parseVimMotion } from "./vim-motion";

export async function processVimMotionInput({
  disposer: parentDisposer,
  editor,
  highlighter,
  initialSelection,
}: {
  disposer: HierarchicalDisposer;
  editor: TextEditor;
  initialSelection: Selection;
  highlighter: Highlighter;
}) {
  return withChildDisposer(parentDisposer, (disposer) => {
    const input = new VimMotionInput({
      editor,
      highlighter,
      initialSelection,
    });
    disposer.add(input);

    return input.show();
  });
}

class VimMotionInput implements Disposable {
  private readonly inputBox = window.createInputBox();
  private readonly highlighter: Highlighter;
  private readonly restoreSelection: () => void;
  private readonly donePromise: Promise<boolean>;

  public dispose: Disposable["dispose"];

  constructor({
    editor,
    highlighter,
    initialSelection,
  }: {
    editor: TextEditor;
    initialSelection: Selection;
    highlighter: Highlighter;
  }) {
    const disposer = new HierarchicalDisposer(none);
    this.dispose = disposer.dispose.bind(disposer);
    disposer.add(this.inputBox);
    this.inputBox.prompt = "Enter a vim motion";
    this.inputBox.placeholder = "For example: 10j";

    disposer.add(this.inputBox.onDidChangeValue(this.onInputValueChange));

    this.highlighter = highlighter;

    this.restoreSelection = () => {
      editor.selection = initialSelection;
      this.highlighter.highlight();
    };

    this.donePromise = new Promise<boolean>((resolve) => {
      let accepted = false;

      disposer.add(
        this.inputBox.onDidHide(() => {
          if (!accepted) {
            this.restoreSelection();
          }
          resolve(accepted);
        }),
      );
      disposer.add(
        this.inputBox.onDidAccept(() => {
          accepted = true;
          this.inputBox.hide();
        }),
      );
    });
  }

  async show() {
    this.inputBox.show();

    return this.donePromise;
  }

  private onInputValueChange = async (s: string) => {
    const result = parseVimMotion(s);
    this.restoreSelection();

    if (isLeft(result)) {
      this.inputBox.validationMessage = result.left.message;
      return;
    }

    this.inputBox.validationMessage = undefined;
    await commands.executeCommand("cursorMove", {
      to: result.right.direction,
      value: result.right.lines,
    });
    this.highlighter.highlight();
  };
}