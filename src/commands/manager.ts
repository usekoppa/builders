import { REST } from "@discordjs/rest";
import type { CommandInteraction } from "discord.js";
import {
  APIApplicationCommandInteractionData,
  APIChatInputApplicationCommandInteractionData,
  APIChatInputApplicationCommandInteractionDataResolved,
  ApplicationCommandOptionType,
  ApplicationCommandType,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  Routes,
  Snowflake,
} from "discord-api-types";

import { Subcommand } from "./options/subcommands/subcommand";
import { SubcommandGroup } from "./options/subcommands/subcommand_group";
import type { BaseCommand } from "./base_command.mixin";
import { Command } from "./command";
import { createCommandContext } from "./context";

type CommandBuilderFn = (command: Command) => Command;

export class CommandManager {
  readonly commands = new Set<Command>();

  registered = false;

  #rest: REST;

  constructor(private clientId: Snowflake, token: string) {
    this.#rest = new REST({ version: "9" }).setToken(token);
  }

  addCommand(command: Command): this;
  addCommand(fn: CommandBuilderFn): this;
  addCommand(fnOrCommand: Command | CommandBuilderFn) {
    const command =
      fnOrCommand instanceof Command
        ? fnOrCommand
        : fnOrCommand(new Command(this));

    this.commands.add(command);
    return this;
  }

  updateCommand(command: Command): this;
  updateCommand(name: string, fn: CommandBuilderFn): this;
  updateCommand(
    commandOrName: string | Command,
    fn?: (command: Command) => Command
  ) {
    let command: Command;
    if (commandOrName instanceof Command) {
      command = commandOrName;
    } else {
      const possibleCommand = this.findCommand(commandOrName);
      if (typeof possibleCommand === "undefined") {
        throw new Error("Command not found");
      }

      command = fn!(possibleCommand);
    }

    if (this.registered) {
      // TODO: Use the update method.
    }

    return this;
  }

  removeCommand(nameOrCommand: string | Command) {
    let command!: Command;
    if (typeof nameOrCommand === "string") {
      const possibleCommand = this.findCommand(nameOrCommand);
      if (typeof possibleCommand === "undefined") return;
      command = possibleCommand;
    } else {
      command = nameOrCommand;
    }

    this.commands.delete(command);
    return this;
  }

  findCommand(name: string) {
    let command: Command | undefined;
    for (const possibleCommand of this.commands) {
      if (possibleCommand.name === name) {
        command = possibleCommand;
        break;
      }
    }

    return command;
  }

  async handleInteraction(interaction: APIApplicationCommandInteractionData) {
    if (interaction.type === ApplicationCommandType.ChatInput) {
      const rootCommand = this.findCommand(interaction.name);

      if (typeof rootCommand === "undefined") return;

      const command: BaseCommand = rootCommand.hasSubcommands()
        ? CommandManager.searchForSubcommand(
            interaction,
            rootCommand.options
          ) ?? rootCommand
        : rootCommand;

      if (typeof command.executor !== "undefined") {
        const ctx = createCommandContext(interaction, command);
        await command.executor(ctx);
      }
    }
  }

  #overwriteGlobalCommands(
    commands: RESTPostAPIChatInputApplicationCommandsJSONBody[]
  ) {
    return this.#overwriteCommands(this.#routeURI(), commands);
  }

  #overwriteGuildCommands(
    guildID: Snowflake,
    commands: RESTPostAPIChatInputApplicationCommandsJSONBody[]
  ) {
    return this.#overwriteCommands(this.#routeURI(guildID), commands);
  }

  #routeURI(guildID?: Snowflake) {
    if (typeof guildID !== "undefined") {
      return Routes.applicationGuildCommands(this.clientId, guildID);
    } else {
      return Routes.applicationCommands(this.clientId);
    }
  }

  async #overwriteCommands(
    route: `/${string}`,
    commands: RESTPostAPIChatInputApplicationCommandsJSONBody[]
  ) {
    await this.#rest.put(route, { body: commands });
  }

  private static searchForSubcommand(
    interaction: APIChatInputApplicationCommandInteractionData,
    subcommandsOrGroups: Subcommand[] | (Subcommand | SubcommandGroup)[]
  ) {
    const { options } = interaction;

    let subcommand: Subcommand | undefined;
    let group: SubcommandGroup | undefined;

    for (const groupOrSubcommand of subcommandsOrGroups) {
      if (groupOrSubcommand instanceof SubcommandGroup) {
        const potentialGroupName = interaction.options?.find(
          option => option.type === ApplicationCommandOptionType.SubcommandGroup
        );

        group = groupOrSubcommand;
        subcommand = CommandManager.searchForSubcommand(
          interaction,
          group.options as SubcommandGroup[]
        );

        if (typeof subcommand !== "undefined") break;
      }

      if (groupOrSubcommand.name === options.getSubcommand(true)) {
        subcommand = groupOrSubcommand as Subcommand;
      }
    }

    return subcommand;
  }
}
