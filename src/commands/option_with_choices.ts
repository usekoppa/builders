import { APIApplicationCommandOptionChoice } from "discord-api-types";

import { Commands } from "../api/commands";
import { JSONifiable } from "../JSONifiable";

import { Option } from "./option";
import { ResolvedOptions } from "./resolved_options";

export class OptionWithChoices<
    Type extends Commands.ChatInput.Options.ChoiceType = Commands.ChatInput.Options.ChoiceType,
    Name extends string = string,
    IsRequired extends boolean = boolean,
    Value extends ResolvedOptions[Type] = never
  >
  extends Option<Type, Name, IsRequired>
  implements JSONifiable<Commands.ChatInput.Options.Outgoing.Choice>
{
  readonly choices?: APIApplicationCommandOptionChoice[];

  setName<NewName extends string>(name: NewName) {
    super.setName(name);
    return this as unknown as OptionWithChoices<
      Type,
      NewName,
      IsRequired,
      Value
    >;
  }

  setRequired<NewIsRequired extends boolean>(required: NewIsRequired) {
    super.setRequired(required);
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
    const data = super.toJSON() as Commands.ChatInput.Options.Outgoing.Choice;
    if (typeof this.choices !== "undefined") data.choices = this.choices;
    return data;
  }
}
