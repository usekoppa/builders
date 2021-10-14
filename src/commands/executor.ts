import { CommandContext } from "./context";

export type Executor<Arguments = {}> = (ctx: CommandContext<Arguments>) => void;
