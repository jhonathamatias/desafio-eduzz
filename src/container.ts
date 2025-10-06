type Factory<T> = () => T;

class DependencyContainer {
  private static instance: DependencyContainer;
  private singletons = new Map<string, unknown>();
  private factories = new Map<string, Factory<unknown>>();

  public static getInstance(): DependencyContainer {
    if (!DependencyContainer.instance) {
      DependencyContainer.instance = new DependencyContainer();
    }

    return DependencyContainer.instance;
  }

  public register<T>(key: string, factory: Factory<T>): void {
    this.factories.set(key, factory);
  }

  public resolve<T>(key: string): T {
    if (!this.factories.has(key)) {
      throw new Error(`Dependency "${key}" is not registered.`);
    }

    if (!this.singletons.has(key)) {
      const instance = this.factories.get(key)!();
      this.singletons.set(key, instance);
    }

    return this.singletons.get(key) as T;
  }

  public reset(key?: string) {
    if (key) {
      this.singletons.delete(key);
      return;
    }

    this.singletons.clear();
  }
}

export const container = DependencyContainer.getInstance();
