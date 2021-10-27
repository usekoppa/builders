import { Commands } from "../../../api";

import { Option } from "./option";
import { OptionWithChoices } from "./option_with_choices";
import { ResolvedOptions } from "./resolved_options";
import { SubcommandGroup } from "./subcommand_group";

/**
 * Creates a record with the name and the exact type of the argument a user could supply for an option.
 */

export type OptionArgument<InputOption> = InputOption extends SubcommandGroup
  ? never
  : InputOption extends Option<infer Type, infer Name, infer IsRequired>
  ? Record<
      Name,
      ResolvedOptions[Type] | (IsRequired extends true ? never : undefined)
    >
  : InputOption extends OptionWithChoices<
      Commands.ChatInput.Options.ChoiceType,
      infer Name,
      infer IsRequired,
      infer Value
    >
  ? Record<Name, Value | (IsRequired extends true ? never : undefined)>
  : never;
