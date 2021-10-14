import type { CommandInteractionOption } from "discord.js";

export type ResolvedMentionable = NonNullable<
  CommandInteractionOption["member" | "role" | "user"]
>;

export type ResolvedChannel = NonNullable<CommandInteractionOption["channel"]>;

export type ResolvedRole = NonNullable<CommandInteractionOption["role"]>;

export type ResolvedMessage = NonNullable<CommandInteractionOption["message"]>;

export type ResolvedUser = NonNullable<CommandInteractionOption["user"]>;

export type ResolvedMember = NonNullable<CommandInteractionOption["member"]>;
