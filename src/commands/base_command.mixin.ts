import { mix } from "ts-mixer";

import { OptionsBuilder } from "./options/options_builder.mixin";
import { NameAndDescription } from "./name_and_desc.mixin";

@mix(NameAndDescription, OptionsBuilder)
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
    OptionsBuilder<Arguments> {}
