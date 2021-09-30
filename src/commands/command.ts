import { RESTPostAPIApplicationCommandsJSONBody } from "discord-api-types";

import { BaseCommand } from "./base/base_command";
import { OptionsBuilder } from "./options/options_builder.mixin";
import { Subcommand } from "./options/subcommands/subcommand";

export class Command<Arguments = {}> extends BaseCommand<Arguments> {
  readonly defaultPermission: boolean = true;

  addSubcommand(fn: (subcommand: Subcommand) => Subcommand) {
    const subcommand = fn(new Subcommand());
    this.options.push(subcommand.toJSON());
    return this as unknown as BaseCommand<{}>;
  }

  addSubcommandGroup(): WithSubcommands {
    return this;
  }

  setDefaultPermission(enabled: boolean) {
    Reflect.set(this, "defaultPermission", enabled);
    return this;
  }

  toJSON(): RESTPostAPIApplicationCommandsJSONBody {
    return {
      name: this.name,
      description: this.description,
      options: this.options,
      default_permission: this.defaultPermission,
    };
  }
}

type WithSubcommands = Omit<Command, Exclude<keyof OptionsBuilder, "options">>;

new Command().addString(opt => opt.setName("something"));
