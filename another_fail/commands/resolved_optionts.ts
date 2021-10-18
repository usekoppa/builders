import { APIChannel, APIRole, APIUser } from "discord-api-types";

import { Options } from "../api/options";

import { Subcommand } from "./subcommand";

export interface ResolvedOptions {
  [Options.Type.Subcommand]: unknown; // The arguments.
  [Options.Type.SubcommandGroup]: {
    subcommand: Subcommand;
    options: Options.Incoming.Subcommand;
  };

  [Options.Type.String]: string;
  [Options.Type.Integer]: number;
  [Options.Type.Boolean]: boolean;
  [Options.Type.User]: APIUser;
  [Options.Type.Channel]: APIChannel;
  [Options.Type.Role]: APIRole;
  [Options.Type.Mentionable]: APIUser | APIChannel | APIRole;
  [Options.Type.Number]: number;
}
