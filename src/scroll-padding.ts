import { ConfigurationTarget, Disposable, workspace } from "vscode";

const settingName = "cursorSurroundingLines";

export const enableScrollPadding = async (
  offsetLines: number,
): Promise<Disposable> => {
  const config = workspace.getConfiguration("editor");
  const initialPadding = config.inspect(settingName)?.globalValue;

  await config.update(settingName, offsetLines, ConfigurationTarget.Global);

  return {
    dispose() {
      config.update(settingName, initialPadding, ConfigurationTarget.Global);
    },
  };
};
