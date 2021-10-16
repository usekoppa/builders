import type { ApplicationCommandOptionType } from "discord-api-types";

import { NameAndDescription } from "../src/commands/chat_input/name_and_description.mixin";

import {
  APICommandOption,
  ToAPIApplicationCommandOptions,
} from "./to_api_option";

export type ReducedCommandOptionTypes = Exclude<
  ApplicationCommandOptionType,
  | ApplicationCommandOptionType.Subcommand
  | ApplicationCommandOptionType.SubcommandGroup
>;

export abstract class BaseOption<
    OptionType extends ReducedCommandOptionTypes,
    Name extends string = string,
    // It's named IsRequired instead of Required to prevent interference with the builtin utility type.
    IsRequired extends boolean = true
  >
  extends NameAndDescription
  implements ToAPIApplicationCommandOptions
{
  readonly name!: Name;
  readonly description!: string;
  readonly required = true as IsRequired;

  constructor(public readonly type: OptionType) {
    super();
  }

  abstract setName<NewName extends string>(
    name: NewName
  ): BaseOption<OptionType, NewName, IsRequired> & this;

  abstract setDescription(
    description: string
  ): BaseOption<OptionType, Name, IsRequired> & unknown;

  abstract setRequired<NewRequired extends boolean>(
    required: NewRequired
  ): BaseOption<OptionType, Name, NewRequired> & unknown;

  protected _setOptionName<NewName extends string>(name: NewName) {
    this._setName(name);
    return this as unknown as BaseOption<OptionType, NewName, IsRequired>;
  }

  protected _setOptionDescription(description: string) {
    super._setDescription(description);
    return this as unknown as BaseOption<OptionType, Name, IsRequired>;
  }

  protected _setOptionRequired<NewRequired extends boolean>(
    required: NewRequired
  ) {
    validateRequired(required);
    Reflect.set(this, "required", required);
    return this as unknown as BaseOption<OptionType, Name, NewRequired>;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected _setName(_name: string) {
    throw new Error("Please use _setOptionName instead");
    return this;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected _setDescription(_description: string) {
    throw new Error("Please use _setOptionDescription instead");
    return this;
  }

  toJSON(): APICommandOption {
    return {
      type: this.type as unknown as ApplicationCommandOptionType,
      name: this.name,
      description: this.description,
      required: this.required,
    };
  }
}

function validateRequired(required: unknown): asserts required is boolean {
  if (typeof required !== "boolean") {
    throw new TypeError("Required must be a boolean");
  }
}
