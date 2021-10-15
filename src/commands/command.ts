import { ApplicationCommandData } from "discord.js";
import { Snowflake } from "discord-api-types";

import { OptionsBuilder } from "./options/options_builder.mixin";
import { Subcommand } from "./options/subcommands/subcommand";
import { SubcommandGroup } from "./options/subcommands/subcommand_group";
import { BaseCommand } from "./base_command.mixin";
import { CommandManager } from "./manager";

interface IncompleteCommandWithSubcommands extends Command {
  readonly executor: undefined;
  readonly options: (Subcommand | SubcommandGroup)[];
  hasSubcommands(): true;
}

export type CommandWithSubcommands = Omit<
  IncompleteCommandWithSubcommands,
  Exclude<keyof OptionsBuilder, "options">
>;

export class Command<Arguments = {}> extends BaseCommand<Arguments> {
  readonly defaultPermission: boolean = true;

  readonly guilds: Snowflake[] = [];

  #hasSubcommands: false = false;

  constructor(private manager: CommandManager) {
    super();
  }

  setGuilds(guildId: Snowflake) {
    this.guilds.push();
    this.#update();
    return this;
  }

  addGuild(guildId: Snowflake) {
    this.guilds.push(guildId);
    this.#update();
    return this;
  }

  removeGuild(guildId: Snowflake) {
    const idx = this.guilds.findIndex(id => id === guildId);
    if (typeof idx !== "undefined") {
      this.guilds.splice(idx, 1);
      this.#update();
    }

    return this;
  }

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
    } as unknown as ApplicationCommandData;
  }

  #setAsCommandWithSubcommands() {
    Reflect.set(this, "hasSubcommands", true);
    return this as unknown as CommandWithSubcommands;
  }

  #update() {
    if (this.manager.registered) this.manager.updateCommand(this);
  }
}
