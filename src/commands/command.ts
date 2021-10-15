import {
  APIApplicationCommand,
  ApplicationCommandOptionType,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  Snowflake,
} from "discord-api-types";

import { Option } from "./options/option";
import { OptionWithChoices } from "./options/option_with_choices";
import { OptionsBuilder } from "./options/options_builder.mixin";
import { Subcommand } from "./options/subcommands/subcommand";
import { SubcommandGroup } from "./options/subcommands/subcommand_group";
import { ToAPIApplicationCommandOptions } from "./options/to_api_option";
import { BaseCommand } from "./base_command.mixin";
import { CommandManager } from "./manager";
import { NameAndDescription } from "./name_and_description.mixin";

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

  #localGuilds = new Set<Snowflake>();
  #cachedGuilds = new Set<Snowflake>();

  #hasSubcommands: false = false;

  constructor(private manager: CommandManager) {
    super();
  }

  get guilds() {
    return this.#cachedGuilds;
  }

  setGuilds(guilds: Snowflake[]) {
    this.#localGuilds = new Set(guilds);
    if (this.manager.registered) {
      this.#cachedGuilds = new Set([
        ...this.#cachedGuilds,
        ...this.#localGuilds,
      ]);
    }

    return this;
  }

  addGuild(guildId: Snowflake) {
    this.#localGuilds.add(guildId);
    this.#cachedGuilds.add(guildId);
    return this;
  }

  removeGuild(guildId: Snowflake) {
    this.#localGuilds.delete(guildId);
    this.#cachedGuilds.delete(guildId);
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

  toJSON(): RESTPostAPIChatInputApplicationCommandsJSONBody {
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

  static createCommandWithAPIData(
    manager: CommandManager,
    data: APIApplicationCommand,
    guilds?: Snowflake[]
  ) {
    const command = new Command(manager);
    command.setName(data.name);
    command.setDescription(data.description);
    if (typeof guilds !== "undefined") command.setGuilds(guilds);

    const options = data.options?.map(rawOption => {
      let option: NameAndDescription & ToAPIApplicationCommandOptions;

      if (
        rawOption.type === ApplicationCommandOptionType.String ||
        rawOption.type === ApplicationCommandOptionType.Integer ||
        rawOption.type === ApplicationCommandOptionType.Number
      ) {
        const optionWithChoices = new OptionWithChoices(rawOption.type);
        Reflect.set(optionWithChoices, "choices", rawOption.choices);
      }
    });

    Reflect.set(command, "options", options);
  }
}
