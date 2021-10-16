import { CommandContext } from "./context";

export type Executor<Arguments = {}> = (
  ctx: CommandContext<Arguments>
) => Promise<void> | void;
