import { mix } from "ts-mixer";

import { Executable } from "../../executable.mixin";

import { NameAndDescription } from "./name_and_description.mixin";

@mix(NameAndDescription, Executable)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export abstract class BaseChatInputCommand<Arguments = {}> {
  setName(name: string) {
    return this._setName(name);
  }

  setDescription(description: string) {
    return this._setDescription(description);
  }
}

export interface BaseChatInputCommand<Arguments>
  extends NameAndDescription,
    Executable<Arguments> {}
