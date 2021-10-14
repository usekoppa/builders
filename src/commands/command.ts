import { OptionsBuilder } from "./options/options_builder.mixin";
import { Subcommand } from "./options/subcommands/subcommand";
import { SubcommandGroup } from "./options/subcommands/subcommand_group";
import { BaseCommand } from "./base_command.mixin";

interface __CommandWithSubcommands extends Command {
  readonly executor: undefined;
  readonly options: (Subcommand | SubcommandGroup)[];
  hasSubcommands(): true;
}

export type CommandWithSubcommands = Omit<
  __CommandWithSubcommands,
  Exclude<keyof OptionsBuilder, "options">
>;

export class Command<Arguments = {}> extends BaseCommand<Arguments> {
  readonly defaultPermission: boolean = true;

  #hasSubcommands: false = false;

  hasSubcommands(): this is CommandWithSubcommands {
    return this.#hasSubcommands;
  }

  addSubcommand(fn: (subcommand: Subcommand) => Subcommand) {
    const subcommand = fn(new Subcommand());
    this.options.push(subcommand);
    return this.#setAsCommandWithSubcommands();
  }

  addSubcommandGroup(
    fn: (subcommandGroup: SubcommandGroup) => SubcommandGroup
  ) {
    const subcommandGroup = fn(new SubcommandGroup());
    this.options.push(subcommandGroup);
    return this.#setAsCommandWithSubcommands();
  }

  setDefaultPermission(enabled: boolean) {
    Reflect.set(this, "defaultPermission", enabled);
    return this;
  }

  toJSON() {
    return {
      name: this.name,
      description: this.description,
      options: this.options.map(option => option.toJSON()),
      default_permission: this.defaultPermission,
    };
  }

  #setAsCommandWithSubcommands() {
    Reflect.set(this, "hasSubcommands", true);
    return this as unknown as CommandWithSubcommands;
  }
}
