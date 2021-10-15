import { CommandContext } from "./commands/context";

export type Executor<Arguments = {}> = (
  ctx: CommandContext<Arguments>
) => Promise<void> | void;
