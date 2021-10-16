import { Options } from "../../../api_types/options";

import { Option, OptionArgumentValues } from "./option.mixin";

type NewOptionWithChoices<
  Type extends Options.ChoiceType,
  Name extends string,
  IsRequired extends boolean,
  Value extends OptionArgumentValues[Type],
  ChoiceAdded extends boolean
> = Option<Type, Name, IsRequired, Value, ChoiceAdded> &
  OptionWithChoices<Type, Name, IsRequired, Value, ChoiceAdded>;

export class OptionWithChoices<
  Type extends Options.ChoiceType = Options.ChoiceType,
  Name extends string = string,
  IsRequired extends boolean = true,
  Value extends OptionArgumentValues[Type] = OptionArgumentValues[Type],
  ChoiceAdded extends boolean = false
> extends Option<Type, Name, IsRequired, Value, ChoiceAdded> {
  readonly choices = super.choices;

  setName<NewName extends string>(name: NewName) {
    super.setName(name);
    return this as unknown as NewOptionWithChoices<
      Type,
      NewName,
      IsRequired,
      Value,
      ChoiceAdded
    >;
  }

  setDescription(description: string) {
    super.setDescription(description);
    return this as unknown as NewOptionWithChoices<
      Type,
      Name,
      IsRequired,
      Value,
      ChoiceAdded
    >;
  }

  setRequired<NewIsRequired extends boolean>(required: NewIsRequired) {
    super.setRequired(required);
    return this as unknown as NewOptionWithChoices<
      Type,
      Name,
      NewIsRequired,
      Value,
      ChoiceAdded
    >;
  }

  addChoice<NewValue extends OptionArgumentValues[Type] & (string | number)>(
    name: string,
    value: NewValue
  ) {
    super.addChoice(name, value);
    return this as unknown as NewOptionWithChoices<
      Type,
      Name,
      IsRequired,
      ChoiceAdded extends true ? Value | NewValue : NewValue,
      true
    >;
  }

  resolve(option: Options.Incoming.ChoiceDataOption) {
    if (option.name === this.name) {
      return this.choices?.find(opt => opt.value === option.value)?.value as
        | Value
        | undefined;
    }
  }

  toJSON() {
    return {
      type: this.type,
      name: this.name,
      description: this.description,
      choices: this.choices,
    };
  }
}
