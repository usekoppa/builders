import type {
  Option,
  ReducedCommandOptionTypes,
} from "./option_types/general_option";
import type {
  OptionWithChoices,
  OptionWithChoicesTypes,
} from "./option_types/option_with_choices";

export type AnyOption =
  | Option<ReducedCommandOptionTypes, string, boolean>
  | OptionWithChoices<OptionWithChoicesTypes, string | number, string, boolean>;
