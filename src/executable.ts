import { Interactions } from "./api/interactions";

export const kExecute = Symbol(
  "discord-interactions-framework.executable.execute"
);

export const kCreateContext = Symbol(
  "discord-interactions-framework.executable.createContext"
);

export type Executor<Context extends unknown> = (
  ctx: Context
) => Promise<void> | void;

export interface Executable<Context extends unknown = unknown> {
  [kCreateContext](
    interaction: Interactions.Incoming.Interaction
  ): Promise<Context | undefined> | Context | undefined;

  readonly [kExecute]?: Executor<Context>;

  setExecutor(executor: Executor<Context>): this;
}

export async function execute(
  executable: Executable,
  interaction: Interactions.Incoming.Interaction
) {
  if (typeof executable[kExecute] !== "undefined") {
    const ctx = await executable[kCreateContext](interaction);
    if (typeof ctx === "undefined") return;
    await executable[kExecute]?.(ctx);
  }
}
