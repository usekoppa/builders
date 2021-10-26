import { APIChannel, APIRole, APIUser } from "discord-api-types";

import { Commands } from "../../api";

import { Subcommand } from "./subcommand";

export interface ResolvedOptions {
  [Commands.ChatInput.Options.Type.Subcommand]: unknown; // The arguments.
  [Commands.ChatInput.Options.Type.SubcommandGroup]: {
    subcommand: Subcommand;
    options: Commands.ChatInput.Options.Incoming.Subcommand;
  };

  [Commands.ChatInput.Options.Type.String]: string;
  [Commands.ChatInput.Options.Type.Integer]: number;
  [Commands.ChatInput.Options.Type.Boolean]: boolean;
  [Commands.ChatInput.Options.Type.User]: APIUser;
  [Commands.ChatInput.Options.Type.Channel]: APIChannel;
  [Commands.ChatInput.Options.Type.Role]: APIRole;
  [Commands.ChatInput.Options.Type.Mentionable]: APIUser | APIChannel | APIRole;
  [Commands.ChatInput.Options.Type.Number]: number;
}
