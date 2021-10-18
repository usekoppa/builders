import { APIApplicationCommandOptionChoice } from "discord-api-types";

import { Options } from "../api/options";
import { JSONifiable } from "../JSONifiable";
import { validateDescription, validateName } from "../name_and_description";

import { Option } from "./option";
import { ResolvedOptions } from "./resolved_options";

export class OptionWithChoices<
    Type extends Options.ChoiceType = Options.ChoiceType,
    Name extends string = string,
    IsRequired extends boolean = boolean,
    Value extends ResolvedOptions[Type] = never
  >
  extends Option<Type, Name, IsRequired>
  implements JSONifiable<Options.Outgoing.Choice>
{
  readonly choices?: APIApplicationCommandOptionChoice[];

  setName<NewName extends string>(name: NewName) {
    validateName(name);
    Reflect.set(this, "name", name);
    return this as unknown as OptionWithChoices<
      Type,
      NewName,
      IsRequired,
      Value
    >;
  }

  setDescription(description: string) {
    validateDescription(description);
    Reflect.set(this, "description", description);
    return this;
  }

  setRequired<NewIsRequired extends boolean>(required: NewIsRequired) {
    Reflect.set(this, "required", required);
    return this as unknown as OptionWithChoices<
      Type,
      Name,
      NewIsRequired,
      Value
    >;
  }

  addChoice<Choice extends ResolvedOptions[Type]>(name: string, value: Choice) {
    if (typeof this.choices === "undefined") Reflect.set(this, "choices", []);
    this.choices!.push({ name, value });
    return this as unknown as OptionWithChoices<
      Type,
      Name,
      IsRequired,
      Value | Choice
    >;
  }

  toJSON() {
    const data = super.toJSON() as Options.Outgoing.Choice;
    if (typeof this.choices !== "undefined") data.choices = this.choices;
    return data;
  }
}
