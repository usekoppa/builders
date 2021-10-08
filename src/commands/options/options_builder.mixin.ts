import { CommandInteractionOptionResolver } from "discord.js";
import { ApplicationCommandOptionType } from "discord-api-types";

import { BaseCommand } from "../base_command.mixin";

import { AnyOption } from "./any_option";
import type { ReducedCommandOptionTypes } from "./option";
import { Option } from "./option";
import {
  OptionWithChoices,
  OptionWithChoicesTypes,
} from "./option_with_choices";
import type {
  ResolvedMember,
  ResolvedMentionable,
  ResolvedRole,
  ResolvedUser,
} from "./resolved_option_types";
import { ToAPIApplicationCommandOptions } from "./to_api_option";

type AddOptionFn<
  OptionType extends ReducedCommandOptionTypes,
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

type Argument<
  ArgumentType,
  Name extends string,
  IsRequired extends boolean
> = Record<Name, ArgumentType | (IsRequired extends true ? never : undefined)>;

export abstract class OptionsBuilder<Arguments = {}> {
  readonly options: ToAPIApplicationCommandOptions[] = [];

  addBooleanOption<Name extends string, IsRequired extends boolean>(
    fn: AddOptionFn<ApplicationCommandOptionType.Boolean, Name, IsRequired>
  ) {
    const option = fn(new Option(ApplicationCommandOptionType.Boolean));
    this.#addOption(option, "getBoolean");
    return this as unknown as BaseCommand<
      Arguments & Argument<boolean, Name, IsRequired>
    >;
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

    this.#addOption(option, "getInteger");
    return this as unknown as BaseCommand<
      Arguments & Argument<ChoiceValues, Name, IsRequired>
    >;
  }

  addMemberOption<Name extends string, IsRequired extends boolean>(
    fn: AddOptionFn<ApplicationCommandOptionType.User, Name, IsRequired>
  ) {
    const option = fn(new Option(ApplicationCommandOptionType.User));
    this.#addOption(option, "getMember");
    return this as unknown as BaseCommand<
      Arguments & Argument<ResolvedMember, Name, IsRequired>
    >;
  }

  addMentionableOption<Name extends string, IsRequired extends boolean>(
    fn: AddOptionFn<ApplicationCommandOptionType.Mentionable, Name, IsRequired>
  ) {
    const option = fn(new Option(ApplicationCommandOptionType.Mentionable));
    this.#addOption(option, "getMentionable");
    return this as unknown as BaseCommand<
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

    this.#addOption(option, "getNumber");
    this.options.push(option);
    return this as unknown as BaseCommand<
      Arguments & Argument<ChoiceValues, Name, IsRequired>
    >;
  }

  addRoleOption<Name extends string, IsRequired extends boolean>(
    fn: AddOptionFn<ApplicationCommandOptionType.Role, Name, IsRequired>
  ) {
    const option = fn(new Option(ApplicationCommandOptionType.Role));
    this.#addOption(option, "getRole");
    return this as unknown as BaseCommand<
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

    this.#addOption(option, "getString");
    return this as unknown as BaseCommand<
      Arguments & Argument<ChoiceValues, Name, IsRequired>
    >;
  }

  addUserOption<Name extends string, IsRequired extends boolean>(
    fn: AddOptionFn<ApplicationCommandOptionType.User, Name, IsRequired>
  ) {
    const option = fn(new Option(ApplicationCommandOptionType.User));
    this.#addOption(option, "getUser");
    return this as unknown as BaseCommand<
      Arguments & Argument<ResolvedUser, Name, IsRequired>
    >;
  }

  #addOption(
    option: AnyOption,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    resolverName: keyof CommandInteractionOptionResolver // TODO: Add a processing stack to resolve arguments.
  ) {
    this.options.push(option);
  }
}
