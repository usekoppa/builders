import { ApplicationCommandType } from "discord-api-types";
import { mix } from "ts-mixer";

import { ApplicationCommand } from "../application_command.mixin";

import { OptionsBuilder } from "./options/options_builder.mixin";
import { Description } from "./description.mixin";
import { SubcommandBuilder } from "./sub_commands_builder.mixin";

@mix(SubcommandBuilder, Description, OptionsBuilder)
export class ChatInputCommand<
  Arguments = {}
> extends ApplicationCommand<Arguments> {
  readonly defaultPermission: boolean = true;

  constructor() {
    super(ApplicationCommandType.ChatInput);
  }

  setDescription(description: string) {
    return this._setDescription(description);
  }

  setDefaultPermission(defaultPermission: boolean) {
    Reflect.set(this, "defaultPermission", defaultPermission);
    return this;
  }

  toJSON() {
    return {
      type: this.type as ApplicationCommandType.ChatInput,
      name: this.name,
      description: this.description,
      options: [...this.subcommands, ...this.options].map(opt => opt.toJSON()),
      default_permission: this.defaultPermission,
    };
  }
}

export interface ChatInputCommand<Arguments = {}>
  extends SubcommandBuilder,
    ApplicationCommand<Arguments>,
    Description,
    OptionsBuilder<Arguments> {}
