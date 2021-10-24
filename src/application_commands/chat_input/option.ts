import { Commands } from "../../api/commands";
import { JSONifiable } from "../../JSONifiable";
import {
  NameAndDescription,
  validateDescription,
  validateName,
} from "../../name_and_description";

import { OptionWithChoices } from "./option_with_choices";
import { ResolvedOptions } from "./resolved_options";
import { SubcommandGroup } from "./subcommand_group";

export type OptionArgument<InputOption> = InputOption extends SubcommandGroup
  ? never
  : InputOption extends Option<infer Type, infer Name, infer IsRequired>
  ? Record<
      Name,
      ResolvedOptions[Type] | (IsRequired extends true ? never : undefined)
    >
  : InputOption extends OptionWithChoices<
      Commands.ChatInput.Options.ChoiceType,
      infer Name,
      infer IsRequired,
      infer Value
    >
  ? Record<Name, Value | (IsRequired extends true ? never : undefined)>
  : never;

export class Option<
  Type extends
    | Commands.ChatInput.Options.DataType
    | Commands.ChatInput.Options.Type.SubcommandGroup =
    | Commands.ChatInput.Options.DataType
    | Commands.ChatInput.Options.Type.SubcommandGroup,
  Name extends string = string,
  IsRequired extends boolean = boolean
> implements
    NameAndDescription,
    JSONifiable<Commands.ChatInput.Options.Outgoing.DataOption>
{
  readonly name!: Name;
  readonly description!: string;
  readonly required?: IsRequired;

  constructor(public readonly type: Type) {}

  setName<NewName extends string>(name: NewName) {
    validateName("option", name);
    Reflect.set(this, "name", name);
    return this as unknown as Option<Type, NewName, IsRequired>;
  }

  setDescription(description: string) {
    validateDescription("option", description);
    Reflect.set(this, "description", description);
    return this;
  }

  setRequired<NewIsRequired extends boolean>(required: NewIsRequired) {
    Reflect.set(this, "required", required);
    return this as unknown as Option<Type, Name, NewIsRequired>;
  }

  toJSON() {
    validateName("option", this.name);
    validateDescription("option", this.description);

    return {
      type: this.type,
      name: this.name,
      description: this.description,
      required: this.required,
    } as Commands.ChatInput.Options.Outgoing.DataOption;
  }
}
