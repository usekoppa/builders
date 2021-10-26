import { Commands } from "../../api";

import { Command } from "./command";

/**
 * A subcommand option.
 */
export type Subcommand<Arguments = {}> = Omit<
  Command<Arguments, true>,
  "addSubcommand" | "addSubcommandGroup" | "type"
> & {
  type: Commands.ChatInput.Options.Type.Subcommand;
};
