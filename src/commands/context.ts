import { CommandInteraction } from "discord.js";

import { BaseCommand } from "./base_command.mixin";

export interface CommandContext<Arguments = {}> {
  args: Arguments;
}

export function createCommandContext<Arguments = {}>(
  interaction: CommandInteraction,
  command: BaseCommand<Arguments>
) {
  const args = command.getInteractionArguments(interaction);
  const ctx: Readonly<CommandContext<Arguments>> = Object.freeze({ args });

  return ctx;
}
