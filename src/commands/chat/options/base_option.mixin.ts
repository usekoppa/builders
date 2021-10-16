import {
  APIApplicationCommandArgumentOptions,
  APIApplicationCommandOptionBase,
  APIApplicationCommandOptionChoice,
  APIApplicationCommandSubCommandOptions,
  APIChannel,
  APIGuildMember,
  APIRole,
  APIUser,
} from "discord-api-types";

import { NameAndDescription } from "../name_and_description.mixin";

export enum OptionType {
  String = 3,
  Integer = 4,
  Boolean = 5,
  User = 6,
  Channel = 7,
  Role = 8,
  Mentionable = 9,
  Number = 10,
}

export interface OptionArgumentValues {
  [OptionType.String]: string;
  [OptionType.Integer]: number;
  [OptionType.Boolean]: boolean;
  [OptionType.User]: APIUser;
  [OptionType.Channel]: APIChannel;
  [OptionType.Role]: APIRole;
  [OptionType.Mentionable]: APIUser | APIChannel | APIRole;
  [OptionType.Number]: number;
}

export abstract class BaseOption<
  Name extends string,
  IsRequired extends boolean = true,
  Type extends OptionType = OptionType,
  Value extends OptionArgumentValues[Type] = OptionArgumentValues[Type],
  ChoiceAdded extends boolean = false
> extends NameAndDescription {
  readonly required = true as IsRequired;
  readonly choices: APIApplicationCommandOptionChoice[] | undefined = void 0;

  constructor(public readonly type: Type) {
    super();
  }

  setName<NewName extends string>(name: NewName) {
    this._setName(name);
    return this as unknown as BaseOption<
      NewName,
      IsRequired,
      Type,
      Value,
      ChoiceAdded
    >;
  }

  setDescription(description: string) {
    this._setDescription(description);
    return this as unknown as BaseOption<
      Name,
      IsRequired,
      Type,
      Value,
      ChoiceAdded
    >;
  }

  setRequired<NewIsRequired extends boolean>(required: NewIsRequired) {
    Reflect.set(this, "required", required);
    return this as unknown as BaseOption<
      Name,
      NewIsRequired,
      Type,
      Value,
      ChoiceAdded
    >;
  }

  protected addChoice<
    NewValue extends OptionArgumentValues[Type] & (string | number)
  >(name: string, value: NewValue) {
    if (typeof this.choices === "undefined") Reflect.set(this, "choices", []);
    this.#verifyChoiceAmount(this.choices!.length + 1);
    this.choices!.push({ name, value });
    return this as unknown as BaseOption<
      Name,
      IsRequired,
      Type,
      ChoiceAdded extends true ? Value | NewValue : NewValue,
      true
    >;
  }

  toJSON() {
    const data: ChoiceAdded extends true
      ? APIApplicationCommandArgumentOptions
      : APIApplicationCommandOptionBase = {
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
}
