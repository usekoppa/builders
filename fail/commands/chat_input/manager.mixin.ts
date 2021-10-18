// import { REST } from "@discordjs/rest";
// import { /* Routes, */ Snowflake } from "discord-api-types";

// import { Commands } from "../../api_types/commands";

import { ChatInputCommand } from "./command";

type CommandBuilderFn = (command: ChatInputCommand) => ChatInputCommand;

export class ChatInputCommandManager {
  readonly commands = new Set<ChatInputCommand>();

  registered = false;

  // #rest: REST;

  constructor(/* private clientId: Snowflake, token: string */) {
    // this.#rest = new REST({ version: "9" }).setToken(token);
  }

  addCommand(command: ChatInputCommand): this;
  addCommand(fn: CommandBuilderFn): this;
  addCommand(fnOrCommand: ChatInputCommand | CommandBuilderFn) {
    const command =
      fnOrCommand instanceof ChatInputCommand
        ? fnOrCommand
        : fnOrCommand(new ChatInputCommand());

    this.commands.add(command);
    return this;
  }

  // updateCommand(command: ChatInputCommand): this;
  // updateCommand(name: string, fn: CommandBuilderFn): this;
  // updateCommand(
  //   commandOrName: string | ChatInputCommand,
  //   fn?: (command: ChatInputCommand) => ChatInputCommand
  // ) {
  //   let command: ChatInputCommand;
  //   if (commandOrName instanceof ChatInputCommand) {
  //     command = commandOrName;
  //   } else {
  //     const possibleCommand = this.findCommand(commandOrName);
  //     if (typeof possibleCommand === "undefined") {
  //       throw new Error("Command not found");
  //     }

  //     // @ts-ignore
  //     command = fn!(possibleCommand);
  //   }

  //   if (this.registered) {
  //     // TODO: Use the update method.
  //   }

  //   return this;
  // }

  removeCommand(nameOrCommand: string | ChatInputCommand) {
    let command!: ChatInputCommand;
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
    let command: ChatInputCommand | undefined;
    for (const possibleCommand of this.commands) {
      if (possibleCommand.name === name) {
        command = possibleCommand;
        break;
      }
    }

    return command;
  }

  // async handleInteraction(
  //   interaction: Commands.ChatInput.Incoming.Interaction
  // ) {
  //   const rootCommand = this.findCommand(interaction.data.name);

  //   if (typeof rootCommand === "undefined") return;

  //   const command: BaseCommand = rootCommand.hasSubcommands()
  //     ? CommandManager.searchForSubcommand(interaction, rootCommand.options) ??
  //       rootCommand
  //     : rootCommand;

  //   if (typeof command.executor !== "undefined") {
  //     const ctx = createCommandContext(interaction, command);
  //     await command.executor(ctx);
  //   }
  // }

  // #overwriteGlobalCommands(commands: Commands.ChatInput.Outgoing.Command[]) {
  //   return this.#overwriteCommands(this.#routeURI(), commands);
  // }

  // #overwriteGuildCommands(
  //   guildID: Snowflake,
  //   commands: Commands.ChatInput.Outgoing.Command[]
  // ) {
  //   return this.#overwriteCommands(this.#routeURI(guildID), commands);
  // }

  // #routeURI(guildID?: Snowflake) {
  //   if (typeof guildID !== "undefined") {
  //     return Routes.applicationGuildCommands(this.clientId, guildID);
  //   } else {
  //     return Routes.applicationCommands(this.clientId);
  //   }
  // }

  // async #overwriteCommands(
  //   route: `/${string}`,
  //   commands: Commands.Outgoing.ApplicationCommand[]
  // ) {
  //   await this.#rest.put(route, { body: commands });
  // }

  // private static searchForSubcommand(
  //   interaction: APIChatInputApplicationCommandInteractionData,
  //   subcommandsOrGroups: Subcommand[] | (Subcommand | SubcommandGroup)[]
  // ) {
  //   const { options } = interaction;

  //   let subcommand: Subcommand | undefined;
  //   let group: SubcommandGroup | undefined;

  //   for (const groupOrSubcommand of subcommandsOrGroups) {
  //     if (groupOrSubcommand instanceof SubcommandGroup) {
  //       const potentialGroupName = interaction.options?.find(
  //         option => option.type === ApplicationCommandOptionType.SubcommandGroup
  //       );

  //       group = groupOrSubcommand;
  //       subcommand = CommandManager.searchForSubcommand(
  //         interaction,
  //         group.options as SubcommandGroup[]
  //       );

  //       if (typeof subcommand !== "undefined") break;
  //     }

  //     if (groupOrSubcommand.name === options.getSubcommand(true)) {
  //       subcommand = groupOrSubcommand as Subcommand;
  //     }
  //   }

  //   return subcommand;
  // }
}
