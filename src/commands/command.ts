import { RESTPostAPIApplicationCommandsJSONBody } from "discord-api-types";

import { BaseCommand } from "./base/base_command";
import { Subcommand } from "./options/subcommands/subcommand";
import { SubcommandGroup } from "./options/subcommands/subcommand_group";

export type CommandWithSubcommands = BaseCommand;

export class Command<Arguments = {}> extends BaseCommand<Arguments> {
  readonly defaultPermission: boolean = true;

  addSubcommand(fn: (subcommand: Subcommand) => Subcommand) {
    const subcommand = fn(new Subcommand());
    this.options.push(subcommand.toJSON());
    return this as unknown as CommandWithSubcommands;
  }

  addSubcommandGroup(
    fn: (subcommandGroup: SubcommandGroup) => SubcommandGroup
  ) {
    const subcommandGroup = fn(new SubcommandGroup());
    this.options.push(subcommandGroup.toJSON());
    return this as unknown as CommandWithSubcommands;
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
