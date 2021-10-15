import { REST } from "@discordjs/rest";
import type { ApplicationCommandData, CommandInteraction } from "discord.js";
import { Routes, Snowflake } from "discord-api-types/v9";

import { Subcommand } from "./options/subcommands/subcommand";
import { SubcommandGroup } from "./options/subcommands/subcommand_group";
import type { BaseCommand } from "./base_command.mixin";
import { Command } from "./command";
import { createCommandContext } from "./context";

type CommandBuilderFn = (command: Command) => Command;

export class CommandManager {
  readonly commands: Command[] = [];

  registered = false;

  #rest: REST;

  constructor(private clientId: Snowflake, token: string) {
    this.#rest = new REST({ version: "9" }).setToken(token);
  }

  addCommand(fn: CommandBuilderFn) {
    const command = fn(new Command(this));
    this.commands.push(command);
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
      const possibleCommand = this.#findCommand(commandOrName);
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

  removeCommand(name: string) {
    const idx = this.commands.findIndex(cmd => cmd.name === name);
    this.commands.splice(idx, 1);
    return this;
  }

  async handleInteraction(interaction: CommandInteraction) {
    const rootCommand = this.commands.find(
      cmd => cmd.name === interaction.commandName
    );

    if (typeof rootCommand === "undefined") return;

    const command: BaseCommand = rootCommand.hasSubcommands()
      ? searchForSubcommand(interaction, rootCommand.options) ?? rootCommand
      : rootCommand;

    if (typeof command.executor !== "undefined") {
      const ctx = createCommandContext(interaction, command);

      await command.executor(ctx);
    }
  }

  #registerGlobalCommands(commands: ApplicationCommandData[]) {
    return this.#register(this.#routeURI(), commands);
  }

  #registerGuildCommands(
    guildID: Snowflake,
    commands: ApplicationCommandData[]
  ) {
    return this.#register(this.#routeURI(guildID), commands);
  }

  #routeURI(guildID?: Snowflake) {
    if (typeof guildID !== "undefined") {
      return Routes.applicationGuildCommands(this.clientId, guildID);
    } else {
      return Routes.applicationCommands(this.clientId);
    }
  }

  async #register(route: `/${string}`, commands: ApplicationCommandData[]) {
    await this.#rest.put(route, { body: commands });
  }

  #findCommand(name: string) {
    return this.commands.find(cmd => cmd.name === name);
  }
}

function searchForSubcommand(
  interaction: CommandInteraction,
  subcommandsOrGroups: Subcommand[] | (Subcommand | SubcommandGroup)[]
) {
  const { options } = interaction;

  let subcommand: Subcommand | undefined;
  let group: SubcommandGroup | undefined;

  for (const groupOrSubcommand of subcommandsOrGroups) {
    if (
      groupOrSubcommand instanceof SubcommandGroup &&
      groupOrSubcommand.name === options.getSubcommandGroup(true)
    ) {
      group = groupOrSubcommand;
      subcommand = searchForSubcommand(
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
