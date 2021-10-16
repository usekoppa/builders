import {
  APIApplicationCommandOptionChoice,
  APIChannel,
  APIChatInputApplicationCommandInteractionDataResolved,
  APIRole,
  APIUser,
} from "discord-api-types";

import { Options } from "../../../api_types/options";
import { NameAndDescription } from "../name_and_description.mixin";

import { Subcommand } from "./subcommand";

export interface OptionArgumentValues {
  [Options.Type.Subcommand]: unknown; // The arguments.
  [Options.Type.SubcommandGroup]: {
    subcommand: Subcommand;
    options: Options.Incoming.Subcommand;
  };

  [Options.Type.String]: string;
  [Options.Type.Integer]: number;
  [Options.Type.Boolean]: boolean;
  [Options.Type.User]: APIUser;
  [Options.Type.Channel]: APIChannel;
  [Options.Type.Role]: APIRole;
  [Options.Type.Mentionable]: APIUser | APIChannel | APIRole;
  [Options.Type.Number]: number;
}

export abstract class Option<
  Type extends Options.Type = Options.Type,
  Name extends string = string,
  IsRequired extends boolean = true,
  Value extends OptionArgumentValues[Type] = OptionArgumentValues[Type],
  ChoiceAdded extends boolean = false
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

  protected addChoice<
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

  abstract resolve(
    option: Options.Incoming.Option,
    resolved: APIChatInputApplicationCommandInteractionDataResolved
  ): Value | undefined;

  abstract toJSON(): Options.Outgoing.Option;

  protected static verifyChoiceAmount(amount: number) {
    if (amount > 25) {
      throw new TypeError("A maximum of 25 choices is allowed for an option");
    }
  }
}
