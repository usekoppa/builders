import {
  APIApplicationCommandOption,
  ApplicationCommandOptionType,
} from "discord-api-types";

import { BaseCommand } from "../base/base_command";

import { CommandOptionType, Option } from "./option";

type AddOptionArgument<
  Type extends CommandOptionType,
  Name extends string,
  IsRequired extends boolean
> = (option: Option<Type>) => Option<Type, Name, IsRequired>;

type ArgumentMember<
  ArgumentType,
  Name extends string,
  IsRequired extends boolean
> = Record<Name, ArgumentType | (IsRequired extends true ? never : undefined)>;

export abstract class OptionsBuilder<Arguments = {}> {
  readonly options: APIApplicationCommandOption[] = [];

  addString<Name extends string, IsRequired extends boolean>(
    fn: AddOptionArgument<ApplicationCommandOptionType.String, Name, IsRequired>
  ) {
    const option = fn(new Option(ApplicationCommandOptionType.String));
    this.options.push(option.toJSON());

    return this as unknown as BaseCommand<
      Arguments & ArgumentMember<string, Name, IsRequired>
    >;
  }
}
