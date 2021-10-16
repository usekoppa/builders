import { Options } from "../../../api_types/options";

import { Option, OptionArgumentValues } from "./option.mixin";

type NewDataOption<
  Type extends Options.DataType,
  Name extends string,
  IsRequired extends boolean
> = DataOption<Type, Name, IsRequired> & Option<Type, Name, IsRequired>;

export class DataOption<
  Type extends Options.DataType = Options.DataType,
  Name extends string = string,
  IsRequired extends boolean = true
> extends Option<Type, Name, IsRequired> {
  readonly required = super.required;

  setName<NewName extends string>(name: NewName) {
    super.setName(name);
    return this as unknown as NewDataOption<Type, NewName, IsRequired>;
  }

  setDescription(description: string) {
    super.setDescription(description);
    return this as unknown as NewDataOption<Type, Name, IsRequired>;
  }

  setRequired<NewIsRequired extends boolean>(required: NewIsRequired) {
    super.setRequired(required);
    return this as unknown as NewDataOption<Type, Name, NewIsRequired>;
  }

  resolve(option: Options.Incoming.DataOption) {
    return option.value as OptionArgumentValues[Type];
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
