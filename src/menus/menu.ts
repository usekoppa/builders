import {
  ApplicationCommandType,
  RESTPostAPIContextMenuApplicationCommandsJSONBody,
} from "discord-api-types";

import { Name } from "../name.mixin";

export class Menu extends Name {
  readonly name!: string;

  constructor(
    public readonly type:
      | ApplicationCommandType.Message
      | ApplicationCommandType.User
  ) {
    super();
  }

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
