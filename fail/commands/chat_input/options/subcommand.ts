import { mix } from "ts-mixer";

import { Options } from "../../../api_types/options";
import { Executable } from "../../../executable.mixin";

import { DataOption } from "./data_option";
import { Option } from "./option.mixin";
import { OptionWithChoices } from "./option_with_choices";
import {
  BuilderInput,
  OptionArgument,
  OptionsBuilder,
} from "./options_builder.mixin";

@mix(Executable, OptionsBuilder)
export class Subcommand<Arguments = {}> extends Option<
  Options.Type.Subcommand,
  string,
  false
> {
  readonly options: Option<Options.DataType>[] = [];

  constructor() {
    super(Options.Type.Subcommand);
  }

  addBooleanOption(input: BuilderInput<DataOption<Options.Type.Boolean>>) {
    const option = this.addOption(DataOption, Options.Type.Boolean, input);
    return this as unknown as Subcommand<
      Arguments & OptionArgument<typeof option>
    >;
  }

  addIntegerOption(
    input: BuilderInput<OptionWithChoices<Options.Type.Integer>>
  ) {
    const option = this.addOption(
      OptionWithChoices,
      Options.Type.Integer,
      input
    );

    return this as unknown as Subcommand<
      Arguments & OptionArgument<typeof option>
    >;
  }

  addMentionableOption(
    input: BuilderInput<DataOption<Options.Type.Mentionable>>
  ) {
    const option = this.addOption(DataOption, Options.Type.Mentionable, input);
    return this as unknown as Subcommand<
      Arguments & OptionArgument<typeof option>
    >;
  }

  addNumberOption(input: BuilderInput<OptionWithChoices<Options.Type.Number>>) {
    const option = this.addOption(
      OptionWithChoices,
      Options.Type.Number,
      input
    );
    return this as unknown as Subcommand<
      Arguments & OptionArgument<typeof option>
    >;
  }

  addRoleOption(input: BuilderInput<DataOption<Options.Type.Role>>) {
    const option = this.addOption(DataOption, Options.Type.Role, input);

    return this as unknown as Subcommand<
      Arguments & OptionArgument<typeof option>
    >;
  }

  addStringOption(input: BuilderInput<OptionWithChoices<Options.Type.String>>) {
    const option = this.addOption(
      OptionWithChoices,
      Options.Type.String,
      input
    );

    return this as unknown as Subcommand<
      Arguments & OptionArgument<typeof option>
    >;
  }

  addUserOption(input: BuilderInput<DataOption<Options.Type.User>>) {
    const option = this.addOption(DataOption, Options.Type.User, input);

    return this as unknown as Subcommand<
      Arguments & OptionArgument<typeof option>
    >;
  }

  resolve(_option: Options.Incoming.Subcommand) {
    // return this.getArguments(option.options);
  }

  toJSON() {
    return {
      type: this.type,
      name: this.name,
      description: this.description,
      options: this.options.map(option => option.toJSON()),
    } as Options.Outgoing.Subcommand;
  }
}

export interface Subcommand<Arguments = {}>
  extends Option<Options.Type.Subcommand, string, false>,
    OptionsBuilder,
    Executable<Arguments> {}
