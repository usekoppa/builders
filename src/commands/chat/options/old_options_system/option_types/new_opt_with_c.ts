import { ApplicationCommandOptionType } from "discord-api-types";

import { BaseOption } from "../base_option.mixin";

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
> extends BaseOption<OptionType, Name, IsRequired> {
  // @ts-expect-error The fuck
  setName<NewName extends string>(name: NewName) {
    return this._setOptionName<NewName>(name) as unknown as OptionWithChoices<
      OptionType,
      ChoicesType,
      NewName,
      IsRequired,
      ChoiceValues
    >;
  }

  setDescription(description: string) {
    return this._setOptionDescription(
      description
    ) as unknown as OptionWithChoices<
      OptionType,
      ChoicesType,
      Name,
      IsRequired,
      ChoiceValues
    >;
  }

  setRequired<NewRequired extends boolean>(required: NewRequired) {
    return this._setOptionRequired(required) as unknown as OptionWithChoices<
      OptionType,
      ChoicesType,
      Name,
      IsRequired,
      ChoiceValues
    >;
  }
}

const opt: BaseOption<ApplicationCommandOptionType.String, "A", true> =
  new OptionWithChoices<ApplicationCommandOptionType.String, string, "A", true>(
    ApplicationCommandOptionType.String
  );
