import { window, workspace } from "vscode";

export const enableRelativeLines = async () => {
  const config = workspace.getConfiguration(
    "editor",
    window.activeTextEditor?.document.uri,
  );
  const initialLineNumbersConfiguration = config.inspect("lineNumbers")!;
  await config.update("lineNumbers", "relative", true);

  return function restore() {
    return config.update(
      "lineNumbers",
      initialLineNumbersConfiguration.globalValue,
      true,
    );
  };
};
