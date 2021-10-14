import { REST } from "@discordjs/rest";
import { ApplicationCommandData, CommandInteraction } from "discord.js";
import { Routes, Snowflake } from "discord-api-types/v9";

import { Subcommand } from "./options/subcommands/subcommand";
import { SubcommandGroup } from "./options/subcommands/subcommand_group";
import { ToAPIApplicationCommandOptions } from "./options/to_api_option";
import { BaseCommand } from "./base_command.mixin";
import { Command, CommandWithSubcommands } from "./command";
import { createCommandContext } from "./context";

export class CommandManager {
  readonly commands: Command[] = [];

  #rest: REST;

  constructor(private clientId: Snowflake, token: string) {
    this.#rest = new REST({ version: "9" }).setToken(token);
  }

  addCommand(fn: (command: Command) => Command) {
    const command = fn(new Command());
    this.commands.push(command);
    return this;
  }

  handleInteraction(interaction: CommandInteraction) {
    const command = this.commands.find(
      cmd => cmd.name === interaction.commandName
    );

    if (typeof command === "undefined") return;

    const ctx = createCommandContext(interaction, command);
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
}
