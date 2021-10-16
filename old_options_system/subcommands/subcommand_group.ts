import { ApplicationCommandOptionType } from "discord-api-types";

import { NameAndDescription } from "../../src/commands/chat_input/name_and_description.mixin";
import { ToAPIApplicationCommandOptions } from "../to_api_option";

import { Subcommand } from "./subcommand";

export class SubcommandGroup
  extends NameAndDescription
  implements ToAPIApplicationCommandOptions
{
  readonly options: ToAPIApplicationCommandOptions[] = [];

  setName(name: string) {
    return this._setName(name);
  }

  setDescription(description: string) {
    return this._setDescription(description);
  }

  addSubcommand(fn: (subcommand: Subcommand) => Subcommand) {
    const subcommand = fn(new Subcommand());
    this.options.push(subcommand);
    return this;
  }

  toJSON() {
    return {
      type: ApplicationCommandOptionType.SubcommandGroup,
      name: this.name,
      description: this.description,
      options: this.options.map(option => option.toJSON()),
    };
  }
}
