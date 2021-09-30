import { APIApplicationCommandSubCommandOptions, ApplicationCommandOptionType } from "discord-api-types";
import { BaseCommand } from "../../base/base_command";
import { ToAPIApplicationCommandOptions } from "../to_api_option";

export class Subcommand<Arguments = {}> extends BaseCommand<Arguments> implements ToAPIApplicationCommandOptions {
  toJSON(): APIApplicationCommandSubCommandOptions {
    return {
      type: ApplicationCommandOptionType.Subcommand,
      name: this.name,
      description: this.description,
      options: this.options,
    }
  }
}