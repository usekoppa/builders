import { mix } from "ts-mixer";

import { OptionsBuilder } from "./options/options_builder.mixin";
import { Executor } from "./executor";
import { NameAndDescription } from "./name_and_description.mixin";

@mix(NameAndDescription, OptionsBuilder)
export abstract class BaseCommand<Arguments = {}> {
  readonly executor?: Executor;

  setName(name: string) {
    return this._setName(name);
  }

  setDescription(description: string) {
    return this._setDescription(description);
  }

  setExecutor(executor: Executor<Arguments>) {
    Reflect.set(this, "executor", executor);
    return this;
  }
}

export interface BaseCommand<Arguments>
  extends NameAndDescription,
    OptionsBuilder<Arguments> {}
