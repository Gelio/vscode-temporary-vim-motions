import { isSome, none, Option, some } from "fp-ts/lib/Option";
import { Disposable, ExtensionContext } from "vscode";

export class HierarchicalDisposer implements Disposable {
  private readonly disposables = new Set<Disposable>();

  constructor(private parent: Option<HierarchicalDisposer>) {
    if (isSome(parent)) {
      parent.value.add(this);
    }
  }

  add(disposable: Disposable) {
    this.disposables.add(disposable);
  }

  remove(disposable: Disposable) {
    this.disposables.delete(disposable);
  }

  dispose() {
    if (isSome(this.parent)) {
      this.parent.value.remove(this);
    }

    this.disposables.forEach((d) => d.dispose());
  }
}

export async function withExistingDisposer<T>(
  disposer: HierarchicalDisposer,
  fn: (disposer: HierarchicalDisposer) => T | PromiseLike<T>,
): Promise<T> {
  try {
    return await fn(disposer);
  } finally {
    disposer.dispose();
  }
}

export async function withChildDisposer<T>(
  parentDisposer: HierarchicalDisposer,
  fn: (disposer: HierarchicalDisposer) => T | PromiseLike<T>,
): Promise<T> {
  return withExistingDisposer(
    new HierarchicalDisposer(some(parentDisposer)),
    fn,
  );
}

export function createRootDisposer(
  subscriptions: ExtensionContext["subscriptions"],
): HierarchicalDisposer {
  const disposer = new HierarchicalDisposer(none);
  subscriptions.push(disposer);

  disposer.add({
    dispose() {
      const index = subscriptions.indexOf(disposer);
      if (index === -1) {
        throw new Error(
          "Could not remove root disposer from subscriptions. It was not registered",
        );
      }

      subscriptions.splice(index, 1);
    },
  });

  return disposer;
}
