import { ApplicationCommandOptionType } from "discord-api-types";

import { Options } from "../../../api_types/options";

import { DataOption } from "./data_option";
import { Option } from "./option.mixin";

type AddOptionFn<
  Type extends Options.DataType,
  Name extends string,
  IsRequired extends boolean
> = (option: Option<Type>) => Option<Type, Name, IsRequired>;

type AddOptionWithChoiceFn<
  OptionType extends OptionWithChoicesTypes,
  ChoicesType extends string | number,
  Name extends string,
  IsRequired extends boolean,
  ChoiceValues extends ChoicesType
> = (
  option: OptionWithChoices<OptionType, ChoicesType>
) => OptionWithChoices<OptionType, ChoicesType, Name, IsRequired, ChoiceValues>;

type Argument<
  ArgumentType,
  Name extends string,
  IsRequired extends boolean
> = Record<Name, ArgumentType | (IsRequired extends true ? never : undefined)>;

export abstract class OptionsBuilder<Parent extends any, Arguments = {}> {
  readonly options: DataOption[] = [];

  addBooleanOption<Name extends string, IsRequired extends boolean>(
    fn: AddOptionFn<Options.Type.Boolean, Name, IsRequired>
  ) {
    const option = fn(new DataOption(Options.Type.Boolean));
    this.#addOption(option);
    return this as unknown as OptionsBuilder<
      Parent,
      Arguments & Argument<boolean, Name, IsRequired>
    > &
      Parent;
  }

  addIntegerOption<
    Name extends string,
    IsRequired extends boolean,
    ChoiceValues extends number
  >(
    fn: AddOptionWithChoiceFn<
      ApplicationCommandOptionType.Integer,
      number,
      Name,
      IsRequired,
      ChoiceValues
    >
  ) {
    const option = fn(
      new OptionWithChoices(ApplicationCommandOptionType.Integer)
    );

    this.#addOption(option, "Integer");
    return this as unknown as OptionsBuilder<
      Parent,
      Arguments & Argument<ChoiceValues, Name, IsRequired>
    > &
      Parent;
  }

  addMemberOption<Name extends string, IsRequired extends boolean>(
    fn: AddOptionFn<ApplicationCommandOptionType.User, Name, IsRequired>
  ) {
    const option = fn(new Option(ApplicationCommandOptionType.User));
    this.#addOption(option, "Member");
    return this as unknown as OptionsBuilder<
      Parent,
      Arguments & Argument<ResolvedMember, Name, IsRequired>
    > &
      Parent;
  }

  addMentionableOption<Name extends string, IsRequired extends boolean>(
    fn: AddOptionFn<ApplicationCommandOptionType.Mentionable, Name, IsRequired>
  ) {
    const option = fn(new Option(ApplicationCommandOptionType.Mentionable));
    this.#addOption(option, "Mentionable");
    return this as unknown as OptionsBuilder<
      Arguments & Argument<ResolvedMentionable, Name, IsRequired>
    >;
  }

  addNumberOption<
    Name extends string,
    IsRequired extends boolean,
    ChoiceValues extends number
  >(
    fn: AddOptionWithChoiceFn<
      ApplicationCommandOptionType.Number,
      number,
      Name,
      IsRequired,
      ChoiceValues
    >
  ) {
    const option = fn(
      new OptionWithChoices(ApplicationCommandOptionType.Number)
    );

    this.#addOption(option, "Number");
    this.options.push(option);
    return this as unknown as OptionsBuilder<
      Arguments & Argument<ChoiceValues, Name, IsRequired>
    >;
  }

  addRoleOption<Name extends string, IsRequired extends boolean>(
    fn: AddOptionFn<ApplicationCommandOptionType.Role, Name, IsRequired>
  ) {
    const option = fn(new Option(ApplicationCommandOptionType.Role));
    this.#addOption(option, "Role");
    return this as unknown as OptionsBuilder<
      Arguments & Argument<ResolvedRole, Name, IsRequired>
    >;
  }

  addStringOption<
    Name extends string,
    IsRequired extends boolean,
    ChoiceValues extends string
  >(
    fn: AddOptionWithChoiceFn<
      ApplicationCommandOptionType.String,
      string,
      Name,
      IsRequired,
      ChoiceValues
    >
  ) {
    const option = fn(
      new OptionWithChoices(ApplicationCommandOptionType.String)
    );

    this.#addOption(option, "String");
    return this as unknown as OptionsBuilder<
      Arguments & Argument<ChoiceValues, Name, IsRequired>
    >;
  }

  addUserOption<Name extends string, IsRequired extends boolean>(
    fn: AddOptionFn<ApplicationCommandOptionType.User, Name, IsRequired>
  ) {
    const option = fn(new Option(ApplicationCommandOptionType.User));
    this.#addOption(option, "User");
    return this as unknown as OptionsBuilder<
      Arguments & Argument<ResolvedUser, Name, IsRequired>
    >;
  }

  getInteractionArguments(interaction: CommandInteraction) {
    return this.resolver.getInteractionArguments(
      interaction
    ) as Readonly<Arguments>;
  }

  #addOption(option: DataOption) {
    this.options[option.required ? "unshift" : "push"](option);
    this.resolver.addOption(option.name, option.required, resolver);
  }

  protected getArguments(options: Options.Incoming.DataOption[]) {
    const args = new Proxy(
      {},
      {
        get(_, property) {},
      }
    ) as Arguments;
  }
}
