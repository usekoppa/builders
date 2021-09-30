import {
  APIApplicationCommandOption,
  ApplicationCommandOptionType,
  Snowflake,
} from "discord-api-types";

import { BaseCommand } from "../base/base_command";

import { CommandOptionType, Option } from "./option";
import {
  OptionWithChoices,
  OptionWithChoicesTypes,
} from "./option_with_choices";

type AddOptionFn<
  OptionType extends CommandOptionType,
  Name extends string,
  IsRequired extends boolean
> = (option: Option<OptionType>) => Option<OptionType, Name, IsRequired>;

type AddOptionWithChoiceFn<
  OptionType extends OptionWithChoicesTypes,
  ChoicesType extends string | number,
  Name extends string,
  IsRequired extends boolean,
  ChoiceValues extends ChoicesType
> = (
  option: OptionWithChoices<OptionType, ChoicesType>
) => OptionWithChoices<OptionType, ChoicesType, Name, IsRequired, ChoiceValues>;

type ArgumentMember<
  ArgumentType,
  Name extends string,
  IsRequired extends boolean
> = Record<Name, ArgumentType | (IsRequired extends true ? never : undefined)>;

export abstract class OptionsBuilder<Arguments = {}> {
  readonly options: APIApplicationCommandOption[] = [];

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

    this.options.push(option.toJSON());
    return this as unknown as BaseCommand<
      Arguments & ArgumentMember<ChoiceValues, Name, IsRequired>
    >;
  }

  addUserOption<Name extends string, IsRequired extends boolean>(
    fn: AddOptionFn<ApplicationCommandOptionType.User, Name, IsRequired>
  ) {
    const option = fn(new Option(ApplicationCommandOptionType.User));
    this.options.push(option);
    return this as unknown as BaseCommand<
      Arguments & ArgumentMember<Snowflake, Name, IsRequired>
    >;
  }
}
