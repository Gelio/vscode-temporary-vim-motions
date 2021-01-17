import { isLeft } from "fp-ts/lib/Either";
import { isSome, none } from "fp-ts/lib/Option";
import { Disposable, TextEditor, window } from "vscode";
import {
  HierarchicalDisposer,
  withChildDisposer,
} from "./hierarchical-disposer";
import { Highlighter } from "./highlight";
import { parseVimMotions } from "./motions";
import { executeMotions } from "./motions/execute";
import { VimMotion } from "./motions/parsers";

export async function processVimMotionInput({
  disposer: parentDisposer,
  editor,
  highlighter,
}: {
  disposer: HierarchicalDisposer;
  editor: TextEditor;
  highlighter: Highlighter;
}) {
  return withChildDisposer(parentDisposer, (disposer) => {
    const input = new VimMotionInput({
      executeMotions: executeMotions(editor),
      highlighter,
    });
    disposer.add(input);

    return input.show();
  });
}

class VimMotionInput implements Disposable {
  private readonly inputBox = window.createInputBox();
  private readonly highlighter: Highlighter;
  private readonly donePromise: Promise<boolean>;
  private readonly executeMotions: (motions: VimMotion[]) => Promise<void>;

  public dispose: Disposable["dispose"];

  constructor({
    executeMotions,
    highlighter,
  }: {
    executeMotions: (motions: VimMotion[]) => Promise<void>;
    highlighter: Highlighter;
  }) {
    const disposer = new HierarchicalDisposer(none);
    this.dispose = disposer.dispose.bind(disposer);
    disposer.add(this.inputBox);
    this.inputBox.prompt = "Enter a vim motion";
    this.inputBox.placeholder = "For example: 10j";

    disposer.add(this.inputBox.onDidChangeValue(this.onInputValueChange));

    this.highlighter = highlighter;
    this.executeMotions = executeMotions;

    this.donePromise = new Promise<boolean>((resolve) => {
      let accepted = false;

      disposer.add(
        this.inputBox.onDidHide(() => {
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
    await this.parseAndExecuteMotions(s.trim());
    this.highlighter.highlight();
  };

  private parseAndExecuteMotions = async (input: string) => {
    const result = parseVimMotions(input);
    this.inputBox.validationMessage = undefined;
    this.highlighter.highlight();

    if (isLeft(result)) {
      if (isSome(result.left)) {
        this.inputBox.validationMessage = result.left.value.message;
      }

      return;
    }

    await this.executeMotions(result.right.motion);
    this.inputBox.value = result.right.unmatchedInput;
  };
}
