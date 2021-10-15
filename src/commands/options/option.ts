import type { ApplicationCommandOptionType } from "discord-api-types";

import { NameAndDescription } from "../name_and_description.mixin";

import {
  APICommandOption,
  ToAPIApplicationCommandOptions,
} from "./to_api_option";

export type ReducedCommandOptionTypes = Exclude<
  ApplicationCommandOptionType,
  | ApplicationCommandOptionType.Subcommand
  | ApplicationCommandOptionType.SubcommandGroup
>;

export class Option<
    OptionType extends ReducedCommandOptionTypes,
    Name extends string = string,
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

  setName<NewName extends string>(name: NewName) {
    this._setName(name);
    return this as unknown as Option<OptionType, NewName, IsRequired>;
  }

  setDescription(description: string) {
    this._setDescription(description);
    return this as unknown as Option<OptionType, Name, IsRequired>;
  }

  setRequired<NewIsRequired extends boolean>(required: NewIsRequired) {
    validateRequired(required);
    Reflect.set(this, "required", required);
    return this as unknown as Option<OptionType, Name, NewIsRequired>;
  }

  // TODO: have a setDefault() function for default values.

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
