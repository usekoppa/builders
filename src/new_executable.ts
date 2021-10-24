// import { Interactions } from "./api/interactions";

// export const kExecute = Symbol(
//   "discord-interactions-framework.executable.execute"
// );

// export const kCreateRequest = Symbol(
//   "discord-interactions-framework.executable.createRequest"
// );

// export type Executor<Request extends unknown, Response extends unknown> = (
//   ctx: Context
// ) => Promise<void> | void;

// export interface Executable<
//   Request extends unknown = unknown,
//   Response extends unknown = unknown
// > {
//   [kCreateRequest](
//     interaction: Interactions.Incoming.Interaction
//   ): Promise<Context | undefined> | Context | undefined;

//   readonly [kExecute]?: Executor<Context>;

//   setExecutor(executor: Executor<Context>): this;
// }

// export async function execute(
//   executable: Executable,
//   interaction: Interactions.Incoming.Interaction
// ) {
//   if (typeof executable[kExecute] !== "undefined") {
//     const ctx = await executable[kCreateContext](interaction);
//     if (typeof ctx === "undefined") return;
//     await executable[kExecute]?.(ctx);
//   }
// }
