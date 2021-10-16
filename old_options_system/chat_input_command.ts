import {
  APIApplicationCommand,
  ApplicationCommandOptionType,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  Snowflake,
} from "discord-api-types";

import { BaseChatInputCommand } from "../src/commands/chat_input/base.mixin";
import { ChatInputCommandManager } from "../src/commands/chat_input/manager.mixin";
import { NameAndDescription } from "../src/commands/chat_input/name_and_description.mixin";
import { OptionsBuilder } from "../src/commands/chat_input/options/options_builder.mixin";

import { Subcommand } from "./subcommands/subcommand";
import { SubcommandGroup } from "./subcommands/subcommand_group";
import { ToAPIApplicationCommandOptions } from "./to_api_option";

interface IncompleteChatInputCommandWithSubcommands extends ChatInputCommand {
  readonly executor: undefined;
  readonly options: (Subcommand | SubcommandGroup)[];
  hasSubcommands(): true;
}

export type ChatInputCommandWithSubcommands = Omit<
  IncompleteChatInputCommandWithSubcommands,
  Exclude<keyof OptionsBuilder, "options">
>;

export class ChatInputCommand<
  Arguments = {}
> extends BaseChatInputCommand<Arguments> {
  readonly defaultPermission: boolean = true;

  #hasSubcommands: false = false;

  constructor(private manager: ChatInputCommandManager) {
    super();
  }

  hasSubcommands(): this is ChatInputCommandWithSubcommands {
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

      switch (rawOption.type) {
        case ApplicationCommandOptionType.String:
        case ApplicationCommandOptionType.Integer:
        case ApplicationCommandOptionType.Number:
          const optionWithChoices = new OptionWithChoices(rawOption.type);
          optionWithChoices.setName(rawOption.name);
          Reflect.set(optionWithChoices, "choices", rawOption.choices);
          break;
        case ApplicationCommandOptionType.Subcommand:
          break;
        case ApplicationCommandOptionType.SubcommandGroup:
          break;
        default:
          break;
      }
    });

    Reflect.set(command, "options", options);
  }

  private static manager = ChatCommandManager.getInstance();
}
