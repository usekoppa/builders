import {
  ApplicationCommandType,
  RESTPostAPIContextMenuApplicationCommandsJSONBody,
} from "discord-api-types";

import { ApplicationCommand } from "../application_command.mixin";

export abstract class Menu<
  Arguments = {}
> extends ApplicationCommand<Arguments> {
  constructor(
    public readonly type:
      | ApplicationCommandType.Message
      | ApplicationCommandType.User
  ) {
    super(type);
  }

  toJSON(): RESTPostAPIContextMenuApplicationCommandsJSONBody {
    return {
      type: this.type,
      name: this.name,
    };
  }
}
