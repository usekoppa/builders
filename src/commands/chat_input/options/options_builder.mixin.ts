import { Options } from "../../../api_types/options";

import { DataOption } from "./data_option";
import { Option } from "./option.mixin";
import { OptionWithChoices } from "./option_with_choices";

type OptionArgument<InputOption> = InputOption extends Option<
  Options.Type,
  infer Name,
  infer IsRequired,
  infer Value
>
  ? Record<Name, Value | (IsRequired extends true ? never : undefined)>
  : never;

type BuilderInput<InputOption extends Option = Option> =
  | InputOption
  | ((option: InputOption) => InputOption);

export abstract class OptionsBuilder<Arguments = {}> {
  readonly options: Option[] = [];

  addBooleanOption(input: BuilderInput<DataOption<Options.Type.Boolean>>) {
    return this.#addOption(DataOption, Options.Type.Boolean, input);
  }

  addIntegerOption(
    input: BuilderInput<OptionWithChoices<Options.Type.Integer>>
  ) {
    return this.#addOption(OptionWithChoices, Options.Type.Integer, input);
  }

  addMentionableOption(
    input: BuilderInput<DataOption<Options.Type.Mentionable>>
  ) {
    return this.#addOption(DataOption, Options.Type.Mentionable, input);
  }

  addNumberOption(input: BuilderInput<OptionWithChoices<Options.Type.Number>>) {
    return this.#addOption(OptionWithChoices, Options.Type.Number, input);
  }

  addRoleOption(input: BuilderInput<DataOption<Options.Type.Role>>) {
    return this.#addOption(DataOption, Options.Type.Role, input);
  }

  addStringOption(input: BuilderInput<OptionWithChoices<Options.Type.String>>) {
    return this.#addOption(OptionWithChoices, Options.Type.String, input);
  }

  addUserOption(input: BuilderInput<DataOption<Options.Type.User>>) {
    return this.#addOption(DataOption, Options.Type.User, input);
  }

  #addOption<Type extends Options.Type, InputOption extends Option<Type>>(
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

    return this as unknown as OptionsBuilder<
      Arguments & OptionArgument<typeof option>
    >;
  }
}
