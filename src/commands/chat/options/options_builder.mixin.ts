import { CommandInteraction } from "discord.js";
import { ApplicationCommandOptionType } from "discord-api-types";

import { BaseCommand } from "../base_command.mixin";

import { AnyOption } from "./old_options_system/any_option";
import type { ReducedCommandOptionTypes } from "./old_options_system/option_types/general_option";
import { Option } from "./old_options_system/option_types/general_option";
import {
  OptionWithChoices,
  OptionWithChoicesTypes,
} from "./old_options_system/option_types/option_with_choices";
import {
  InteractionArgumentsResolver,
  Resolver,
} from "./interaction_arguments_resolver";
import type {
  ResolvedMember,
  ResolvedMentionable,
  ResolvedRole,
  ResolvedUser,
} from "./resolved_options";
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

  protected resolver = new InteractionArgumentsResolver();

  addBooleanOption<Name extends string, IsRequired extends boolean>(
    fn: AddOptionFn<ApplicationCommandOptionType.Boolean, Name, IsRequired>
  ) {
    const option = fn(new Option(ApplicationCommandOptionType.Boolean));
    this.#addOption(option, "Boolean");
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

    this.#addOption(option, "Integer");
    return this as unknown as BaseCommand<
      Arguments & Argument<ChoiceValues, Name, IsRequired>
    >;
  }

  addMemberOption<Name extends string, IsRequired extends boolean>(
    fn: AddOptionFn<ApplicationCommandOptionType.User, Name, IsRequired>
  ) {
    const option = fn(new Option(ApplicationCommandOptionType.User));
    this.#addOption(option, "Member");
    return this as unknown as BaseCommand<
      Arguments & Argument<ResolvedMember, Name, IsRequired>
    >;
  }

  addMentionableOption<Name extends string, IsRequired extends boolean>(
    fn: AddOptionFn<ApplicationCommandOptionType.Mentionable, Name, IsRequired>
  ) {
    const option = fn(new Option(ApplicationCommandOptionType.Mentionable));
    this.#addOption(option, "Mentionable");
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

    this.#addOption(option, "Number");
    this.options.push(option);
    return this as unknown as BaseCommand<
      Arguments & Argument<ChoiceValues, Name, IsRequired>
    >;
  }

  addRoleOption<Name extends string, IsRequired extends boolean>(
    fn: AddOptionFn<ApplicationCommandOptionType.Role, Name, IsRequired>
  ) {
    const option = fn(new Option(ApplicationCommandOptionType.Role));
    this.#addOption(option, "Role");
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

    this.#addOption(option, "String");
    return this as unknown as BaseCommand<
      Arguments & Argument<ChoiceValues, Name, IsRequired>
    >;
  }

  addUserOption<Name extends string, IsRequired extends boolean>(
    fn: AddOptionFn<ApplicationCommandOptionType.User, Name, IsRequired>
  ) {
    const option = fn(new Option(ApplicationCommandOptionType.User));
    this.#addOption(option, "User");
    return this as unknown as BaseCommand<
      Arguments & Argument<ResolvedUser, Name, IsRequired>
    >;
  }

  getInteractionArguments(interaction: CommandInteraction) {
    return this.resolver.getInteractionArguments(
      interaction
    ) as Readonly<Arguments>;
  }

  #addOption(option: AnyOption, resolver: Resolver) {
    this.options.push(option);
    this.resolver.addOption(option.name, option.required, resolver);
  }
}
