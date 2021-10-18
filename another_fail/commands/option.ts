import {
  APIApplicationCommandOptionChoice,
  APIChatInputApplicationCommandInteractionDataResolved,
} from "discord-api-types";
import { mix } from "ts-mixer";

import { Options } from "../api/options";
import { NameAndDescription } from "../name_and_description";

import { JSONify } from "./JSONify";
import { ResolvedOptions } from "./resolved_optionts";
import { Subcommand } from "./subcommand";

export const kResolve = Symbol("option.resolve");

// This huge abomination adapts the option to have the right properties on the basis of its type.
export type PolymorphicOption<
  Type extends Options.Type = Options.Type,
  Name extends string = string,
  IsRequired extends boolean = boolean,
  Value extends ResolvedOptions[Type] = ResolvedOptions[Type],
  ChoiceAdded extends boolean = boolean
> = Omit<
  Option<
    Type,
    Name,
    IsRequired,
    Value,
    Type extends Options.ChoiceType ? ChoiceAdded : false
  >,
  Type extends Options.Type.Subcommand | Options.Type.SubcommandGroup
    ?
        | (Type extends Options.Type.Subcommand ? "addSubcommand" : never)
        | "required"
        | "setRequired"
        | "choices"
        | "addChoice"
    :
        | "options"
        | "addSubcommand"
        | (Type extends Options.ChoiceType ? never : "choices" | "addChoice")
>;

export abstract class Option<
  Type extends Options.Type = Options.Type,
  Name extends string = string,
  IsRequired extends boolean = boolean,
  Value extends ResolvedOptions[Type] = ResolvedOptions[Type],
  ChoiceAdded extends boolean = boolean
> implements
    JSONify<Options.Outgoing.Option & { type: Type }>,
    NameAndDescription<Name>
{
  readonly name!: Name;
  readonly description!: string;
  readonly required = true as IsRequired;
  readonly choices?: APIApplicationCommandOptionChoice[];
  readonly options?: Option[];

  constructor(public readonly type: Type) {}

  setName<NewName extends string>(name: NewName) {
    Reflect.set(this, "name", name);
    return this as unknown as PolymorphicOption<
      Type,
      NewName,
      IsRequired,
      Value,
      ChoiceAdded
    >;
  }

  setDescription(description: string) {
    Reflect.set(this, "description", description);
    return this;
  }

  setRequired<NewIsRequired extends boolean>(required: NewIsRequired) {
    Reflect.set(this, "required", required);
    return this as unknown as PolymorphicOption<
      Type,
      Name,
      NewIsRequired,
      Value,
      ChoiceAdded
    >;
  }

  addChoice<NewValue extends ResolvedOptions[Type] & (string | number)>(
    name: string,
    value: NewValue
  ) {
    if (typeof this.choices === "undefined") Reflect.set(this, "choices", []);
    Option.verifyChoiceAmount(this.choices!.length + 1);
    this.choices!.push({ name, value });
    return this as unknown as PolymorphicOption<
      Type,
      Name,
      IsRequired,
      ChoiceAdded extends true ? Value | NewValue : NewValue,
      true
    >;
  }

  addSubcommand(input: Subcommand | ((subcommand: Subcommand) => Subcommand)) {
    if (typeof this.options === "undefined") Reflect.set(this, "options", []);
    const subcommand =
      input instanceof Subcommand ? input : input(new Subcommand());

    this.options!.push(subcommand as unknown as Option);
    return this;
  }

  protected abstract resolve(
    option: Options.Incoming.Option,
    resolved: APIChatInputApplicationCommandInteractionDataResolved
  ): Value | undefined;

  toJSON() {
    const data: Record<string, unknown> = {
      type: this.type,
      name: this.name,
      description: this.description,
    };

    switch (this.type) {
      case Options.Type.SubcommandGroup:
        if (typeof this.options === "undefined") {
          throw new Error("Subcommand group has no subcommands");
        }
      // eslint-disable-next-line no-fallthrough
      case Options.Type.Subcommand:
        data.options = this.options!;
        break;
      case Options.Type.Integer:
      case Options.Type.String:
      case Options.Type.Number:
        if (typeof this.choices !== "undefined") data.choices === this.choices;
      // eslint-disable-next-line no-fallthrough
      default:
        data.required = this.required;
    }

    return data as unknown as Options.Outgoing.Option & { type: Type };
  }

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
