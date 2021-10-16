import {
  ApplicationCommandType,
  RESTPostAPIContextMenuApplicationCommandsJSONBody,
} from "discord-api-types";
import { mix } from "ts-mixer";

import { Executable } from "../../executable.mixin";
import { Name } from "../../name.mixin";

@mix(Name, Executable)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class Menu<Arguments = {}> {
  readonly name!: string;

  constructor(
    public readonly type:
      | ApplicationCommandType.Message
      | ApplicationCommandType.User
  ) {}

  setName(name: string) {
    return this._setName(name);
  }

  toJSON(): RESTPostAPIContextMenuApplicationCommandsJSONBody {
    return {
      type: this.type,
      name: this.name,
    };
  }
}

export interface Menu<Arguments = {}> extends Name, Executable<Arguments> {}
