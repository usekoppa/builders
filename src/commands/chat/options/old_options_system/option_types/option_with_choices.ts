import {
  APIApplicationCommandArgumentOptions,
  APIApplicationCommandOptionChoice,
  ApplicationCommandOptionType,
} from "discord-api-types";

import { NameAndDescription } from "../../../name_and_description.mixin";

import { ToAPIApplicationCommandOptions } from "../../to_api_option";

export type OptionWithChoicesTypes =
  | ApplicationCommandOptionType.String
  | ApplicationCommandOptionType.Integer
  | ApplicationCommandOptionType.Number;

export class OptionWithChoices<
    OptionType extends OptionWithChoicesTypes,
    ChoicesType extends string | number,
    Name extends string = string,
    IsRequired extends boolean = true,
    ChoiceValues extends string | number = ChoicesType
  >
  extends NameAndDescription
  implements ToAPIApplicationCommandOptions
{
  readonly name!: Name;
  readonly description!: string;
  readonly required = true as IsRequired;
  readonly choices: APIApplicationCommandOptionChoice[] | undefined = void 0!;

  constructor(public readonly type: OptionType) {
    super();
  }

  setName<NewName extends string>(name: NewName) {
    this._setName(name);
    return this as unknown as OptionWithChoices<
      OptionType,
      ChoicesType,
      NewName,
      IsRequired,
      ChoiceValues
    >;
  }

  setDescription(description: string) {
    this._setDescription(description);
    return this as unknown as OptionWithChoices<
      OptionType,
      ChoicesType,
      Name,
      IsRequired,
      ChoiceValues
    >;
  }

  setRequired<NewIsRequired extends boolean>(required: NewIsRequired) {
    Reflect.set(this, "required", required);
    return this as unknown as OptionWithChoices<
      OptionType,
      ChoicesType,
      Name,
      NewIsRequired,
      ChoiceValues
    >;
  }

  addChoice<ChoiceValue extends ChoicesType>(name: string, value: ChoiceValue) {
    if (typeof this.choices === "undefined") Reflect.set(this, "choices", []);
    this.#verifyChoiceAmount(this.choices!.length + 1);
    this.choices!.push({ name, value });
    return this as unknown as OptionWithChoices<
      OptionType,
      ChoicesType,
      Name,
      IsRequired,
      ChoiceValues | ChoiceValue
    >;
  }

  toJSON() {
    const data: APIApplicationCommandArgumentOptions = {
      type: this.type,
      name: this.name,
      description: this.description,
      required: this.required,
    };

    if (typeof this.choices !== "undefined") {
      this.#verifyChoiceAmount();
      data.choices = this.choices;
    }

    return data;
  }

  #verifyChoiceAmount(choicesLength = this.choices?.length ?? 0) {
    if (choicesLength > 25) {
      throw new TypeError("A maximum of 25 choices is allowed for an option");
    }
  }

  static createOptionWithChoicesWithAPIData() {}
}
