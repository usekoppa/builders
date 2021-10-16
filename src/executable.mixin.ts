import { Executor } from "./executor";

export abstract class Executable<Arguments = {}> {
  readonly executor?: Executor;

  setExecutor(executor: Executor<Arguments>) {
    Reflect.set(this, "executor", executor);
    return this;
  }
}
