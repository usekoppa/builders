import { APIApplicationCommandOptionChoice } from "discord-api-types";

import { Commands } from "../../../api";
import { JSONifiable } from "../../../JSONifiable";

import { Option } from "./option";
import { ResolvedOptions } from "./resolved_options";

/**
 * An option with choices.
 *
 * @typeParam Type - The type of option.
 *                   @see {@link Commands.ChatInput.Options.ChoiceType} for a list of compatible types.
 * @typeParam Name - The name of the option.
 * @typeParam IsRequired - Whether or not the option is required.
 * @typeParam Value - All the possible values that the choice a user supplies will be resolved to.
 */
export class OptionWithChoices<
    Type extends Commands.ChatInput.Options.ChoiceType = Commands.ChatInput.Options.ChoiceType,
    Name extends string = string,
    IsRequired extends boolean = boolean,
    Value extends ResolvedOptions[Type] = never
  >
  extends Option<Type, Name, IsRequired>
  implements JSONifiable<Commands.ChatInput.Options.Outgoing.Choice>
{
  /**
   * The choices that the user may enter as the argument for this option.
   */
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

  /**
   * Adds a choice that the user can select to the option.
   * @see {@link OptionWithChoices.choices} for more detailed type information.
   *
   * @param name - The display name of the choice.
   * @param value - The argument value of the choice that the gateway supplies.
   * @returns `this` with additional type information.
   */
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
