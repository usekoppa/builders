import { mix } from "ts-mixer";

import { Executable } from "../executable.mixin";

import { OptionsBuilder } from "./options/options_builder.mixin";
import { NameAndDescription } from "./name_and_description.mixin";

@mix(NameAndDescription, OptionsBuilder, Executable)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export abstract class BaseCommand<Arguments = {}> {
  setName(name: string) {
    return this._setName(name);
  }

  setDescription(description: string) {
    return this._setDescription(description);
  }
}

export interface BaseCommand<Arguments>
  extends NameAndDescription,
    Executable<Arguments>,
    OptionsBuilder<Arguments> {}
