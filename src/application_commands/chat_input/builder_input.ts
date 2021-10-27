import { Commands } from "../../api";

import { Subcommand } from "./options/subcommand";
import { Command } from "./command";
import { Option } from "./options";

/**
 * Gets the option the user inputted into a builder.
 *
 * @param NewOption - The constructor for the option that is going to be resolved.
 * @param type - The type of command.
 * @param input - Either the option or a callback that returns the option.
 * @returns An option.
 */
export function getOptionFromInput<
  Type extends
    | Commands.ChatInput.Options.DataType
    | Commands.ChatInput.Options.Type.SubcommandGroup,
  InputOption extends Option<Type>
>(
  NewOption: { new (type: Type): InputOption & unknown },
  type: Type,
  input: BuilderInput<InputOption & unknown>
) {
  return input instanceof Option ? input : input(new NewOption(type));
}

/**
 * Gets the subcommand the user inputted into a builder.
 *
 * @param input - Either a subcommand or a callback that returns a subcommand.
 * @returns A subcommand.
 */
export function getSubcommandFromInput(input: SubcommandBuilderInput) {
  return input instanceof Command
    ? (input as Subcommand)
    : (input as Exclude<SubcommandBuilderInput, Subcommand>)(
        new Command(true) as unknown as Subcommand
      );
}

export type SubcommandBuilderInput =
  | Subcommand
  | ((subcommand: Subcommand) => Subcommand);

export type BuilderInput<InputOption extends Option = Option> =
  | InputOption
  | ((option: InputOption) => InputOption);
