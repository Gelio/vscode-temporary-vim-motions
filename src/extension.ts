import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  console.log("vim-motions extension is now active");

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  const disposable = vscode.commands.registerCommand(
    "vim-motions.helloWorld",
    () => {
      // The code you place here will be executed every time your command is executed

      // Display a message box to the user
      vscode.window.showInformationMessage("Hello World from vim-motions!");
    },
  );

  context.subscriptions.push(disposable);
}
