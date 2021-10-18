import { Command } from "./command";

export type Subcommand<Arguments = {}> = Omit<
  Command<Arguments, true>,
  "addSubcommand" | "addSubcommandGroup"
>;
