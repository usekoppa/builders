import {
  APIApplicationCommandOptionChoice,
  APIChatInputApplicationCommandInteractionDataResolved,
} from "discord-api-types";

import { Options } from "../../../api_types/options";
import { NameAndDescription } from "../name_and_description.mixin";

import { OptionArgumentValues } from "./option_argument_values";

export const kResolve = Symbol("option.resolve");

export abstract class Option<
  Type extends Options.Type = Options.Type,
  Name extends string = string,
  IsRequired extends boolean = boolean,
  Value extends OptionArgumentValues[Type] = OptionArgumentValues[Type],
  ChoiceAdded extends boolean = boolean
> extends NameAndDescription {
  protected readonly required = true as IsRequired;
  protected readonly choices?: APIApplicationCommandOptionChoice[];

  constructor(public readonly type: Type) {
    super();
  }

  setName<NewName extends string>(name: NewName) {
    this._setName(name);
    return this as unknown as Option<
      Type,
      NewName,
      IsRequired,
      Value,
      ChoiceAdded
    >;
  }

  setDescription(description: string) {
    this._setDescription(description);
    return this as unknown as Option<
      Type,
      Name,
      IsRequired,
      Value,
      ChoiceAdded
    >;
  }

  protected setRequired<NewIsRequired extends boolean>(
    required: NewIsRequired
  ) {
    Reflect.set(this, "required", required);
    return this as unknown as Option<
      Type,
      Name,
      NewIsRequired,
      Value,
      ChoiceAdded
    >;
  }

  protected _addChoice<
    NewValue extends OptionArgumentValues[Type] & (string | number)
  >(name: string, value: NewValue) {
    if (typeof this.choices === "undefined") Reflect.set(this, "choices", []);
    Option.verifyChoiceAmount(this.choices!.length + 1);
    this.choices!.push({ name, value });
    return this as unknown as Option<
      Type,
      Name,
      IsRequired,
      ChoiceAdded extends true ? Value | NewValue : NewValue,
      true
    >;
  }

  protected abstract resolve(
    option: Options.Incoming.Option,
    resolved: APIChatInputApplicationCommandInteractionDataResolved
  ): Value | undefined;

  abstract toJSON(): Options.Outgoing.Option;

  static resolve(
    option: Option,
    raw: Options.Incoming.Option,
    resolved: APIChatInputApplicationCommandInteractionDataResolved
  ) {
    return option.resolve(raw, resolved);
  }

  protected static verifyChoiceAmount(amount: number) {
    if (amount > 25) {
      throw new TypeError("A maximum of 25 choices is allowed for an option");
    }
  }
}
