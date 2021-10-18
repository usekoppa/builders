import { Options } from "../../../api_types/options";

import { Option } from "./option.mixin";
import { OptionArgumentValues } from "./option_argument_values";

type NewDataOption<
  Type extends Options.DataType,
  Name extends string,
  IsRequired extends boolean,
  Value extends OptionArgumentValues[Type] = OptionArgumentValues[Type],
  ChoiceAdded extends boolean = false
> = DataOption<Type, Name, IsRequired, Value, ChoiceAdded> &
  Option<Type, Name, IsRequired, Value, ChoiceAdded>;

export class DataOption<
  Type extends Options.DataType = Options.DataType,
  Name extends string = string,
  IsRequired extends boolean = boolean,
  Value extends OptionArgumentValues[Type] = OptionArgumentValues[Type],
  ChoiceAdded extends boolean = boolean
> extends Option<Type, Name, IsRequired, Value, ChoiceAdded> {
  readonly required = super.required;

  constructor(public readonly type: Type) {
    super(type);
  }

  setName<NewName extends string>(name: NewName) {
    super.setName(name);
    return this as unknown as NewDataOption<
      Type,
      NewName,
      IsRequired,
      Value,
      ChoiceAdded
    >;
  }

  setDescription(description: string) {
    super.setDescription(description);
    return this as unknown as NewDataOption<
      Type,
      Name,
      IsRequired,
      Value,
      ChoiceAdded
    >;
  }

  setRequired<NewIsRequired extends boolean>(required: NewIsRequired) {
    super.setRequired(required);
    return this as unknown as NewDataOption<
      Type,
      Name,
      NewIsRequired,
      Value,
      ChoiceAdded
    >;
  }

  resolve(option: Options.Incoming.DataOption) {
    return option.value as Value;
  }

  toJSON() {
    return {
      type: this.type,
      name: this.name,
      description: this.description,
      required: this.required,
    } as Options.Outgoing.DataOption;
  }
}
