import { ApplicationCommandOptionType } from "discord-api-types";

import { BaseCommand } from "../../src/commands/chat_input/base.mixin";
import { ToAPIApplicationCommandOptions } from "../to_api_option";

export class Subcommand<Arguments = {}>
  extends BaseCommand<Arguments>
  implements ToAPIApplicationCommandOptions
{
  toJSON() {
    return {
      type: ApplicationCommandOptionType.Subcommand,
      name: this.name,
      description: this.description,
      options: this.options.map(option => option.toJSON()),
    };
  }
}
