import { BaseOption, ReducedCommandOptionTypes } from "../base_option.mixin";
import { OptionWithChoices } from "./option_with_choices";

export class GeneralOption<
  OptionType extends ReducedCommandOptionTypes,
  Name extends string,
  IsRequired extends boolean
> extends OptionWithChoices<OptionType, Name, IsRequired> {
  setName<NewName extends string>(name: NewName) {
    return this._setOptionName(name);
  }
  setDescription(description: string) {
    return this._setOptionDescription(description);
  }

  setRequired<NewRequired extends boolean>(required: NewRequired) {
    return this._setOptionRequired(required);
  }
}
