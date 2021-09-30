import {
  APIApplicationCommandOption,
  ApplicationCommandOptionType,
} from "discord-api-types";

import { NameAndDescription } from "../../base/name_and_desc.mixin";
import { ToAPIApplicationCommandOptions } from "../to_api_option";

import { Subcommand } from "./subcommand";

export class SubcommandGroup
  extends NameAndDescription
  implements ToAPIApplicationCommandOptions
{
  readonly options: APIApplicationCommandOption[] = [];

  addSubcommand(fn: (subcommand: Subcommand) => Subcommand) {
    const subcommand = fn(new Subcommand());
    this.options.push(subcommand.toJSON());
    return this;
  }

  toJSON() {
    return {
      type: ApplicationCommandOptionType.SubcommandGroup,
      name: this.name,
      description: this.description,
      options: this.options,
    };
  }
}
