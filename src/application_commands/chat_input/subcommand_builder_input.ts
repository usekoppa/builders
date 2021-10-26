import { Subcommand } from "./subcommand";

/**
 * A callback that returns the command that was provided in it's parameters
 * @callback SubcommandBuilderInput~inputCallback
 * @param subcommand {Subcommand}
 * @returns {Subcommand} The subcommand from the parameters.
 */

/**
 * Either a subcommand or a callback that returns the subcommand provided.
 * @typedef {SubcommandBuilderInput~inputCallback|Subcommand} SubcommandBuilderInput
 */
export type SubcommandBuilderInput =
  | Subcommand
  | ((subcommand: Subcommand) => Subcommand);
