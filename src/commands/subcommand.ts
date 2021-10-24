import { Commands } from "../api/commands";

import { Command } from "./command";

export type Subcommand<Arguments = {}> = Omit<
  Command<Arguments, true>,
  "addSubcommand" | "addSubcommandGroup" | "type"
> & {
  type: Commands.ChatInput.Options.Type.Subcommand;
};
