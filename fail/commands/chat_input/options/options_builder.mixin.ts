import { Options } from "../../../api_types/options";

import { DataOption } from "./data_option";
import { Option } from "./option.mixin";
import { OptionWithChoices } from "./option_with_choices";

export type OptionArgument<InputOption> = InputOption extends Option<
  Options.Type,
  infer Name,
  infer IsRequired,
  infer Value
>
  ? Record<Name, Value | (IsRequired extends true ? never : undefined)>
  : never;

export type BuilderInput<InputOption extends Option = Option> =
  | InputOption
  | ((option: InputOption) => InputOption);

export abstract class OptionsBuilder {
  readonly options: Option[] = [];

  abstract addBooleanOption(
    input: BuilderInput<DataOption<Options.Type.Boolean>>
  ): unknown;

  abstract addIntegerOption(
    input: BuilderInput<OptionWithChoices<Options.Type.Integer>>
  ): unknown;

  abstract addMentionableOption(
    input: BuilderInput<DataOption<Options.Type.Mentionable>>
  ): unknown;

  abstract addNumberOption(
    input: BuilderInput<OptionWithChoices<Options.Type.Number>>
  ): unknown;

  abstract addRoleOption(
    input: BuilderInput<DataOption<Options.Type.Role>>
  ): unknown;

  abstract addStringOption(
    input: BuilderInput<OptionWithChoices<Options.Type.String>>
  ): unknown;

  abstract addUserOption(
    input: BuilderInput<DataOption<Options.Type.User>>
  ): unknown;

  protected addOption<
    Type extends Options.Type,
    InputOption extends Option<Type>
  >(
    NewOption: { new (type: Type): InputOption & unknown },
    type: Type,
    input: BuilderInput<InputOption>
  ) {
    const option = input instanceof Option ? input : input(new NewOption(type));

    this.options[
      (option as unknown as DataOption | OptionWithChoices).required
        ? "unshift"
        : "push"
    ](option);

    return option;
  }
}
