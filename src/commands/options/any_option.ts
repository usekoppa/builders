import type { Option, ReducedCommandOptionTypes } from "./option";
import type {
  OptionWithChoices,
  OptionWithChoicesTypes,
} from "./option_with_choices";

export type AnyOption =
  | Option<ReducedCommandOptionTypes, string, boolean>
  | OptionWithChoices<OptionWithChoicesTypes, string | number, string, boolean>;
