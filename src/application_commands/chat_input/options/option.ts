import { Commands } from "../../../api";
import { Description, validateDescription } from "../../../description";
import { JSONifiable } from "../../../JSONifiable";
import { Name as IName, validateName } from "../../../name";

export class Option<
  Type extends
    | Commands.ChatInput.Options.DataType
    | Commands.ChatInput.Options.Type.SubcommandGroup =
    | Commands.ChatInput.Options.DataType
    | Commands.ChatInput.Options.Type.SubcommandGroup,
  Name extends string = string,
  IsRequired extends boolean = boolean
> implements
    IName,
    Description,
    JSONifiable<Commands.ChatInput.Options.Outgoing.DataOption>
{
  readonly name!: Name;
  readonly description!: string;

  /**
   * Whether or not the user is required to supply an option for this argument.
   */
  readonly required?: IsRequired;

  constructor(public readonly type: Type) {}

  setName<NewName extends string>(name: NewName) {
    validateName(name);
    Reflect.set(this, "name", name);
    return this as unknown as Option<Type, NewName, IsRequired>;
  }

  setDescription(description: string) {
    validateDescription(description);
    Reflect.set(this, "description", description);
    return this;
  }

  /**
   * Sets whether or not an option is required.
   * @see {@link Option.required} for more information.
   *
   * @param required - Whether or not the option is required.
   * @returns `this` with additional type information.
   */
  setRequired<NewIsRequired extends boolean>(required: NewIsRequired) {
    Reflect.set(this, "required", required);
    return this as unknown as Option<Type, Name, NewIsRequired>;
  }

  toJSON() {
    validateName(this.name);
    validateDescription(this.description);

    return {
      type: this.type,
      name: this.name,
      description: this.description,
      required: this.required,
    } as Commands.ChatInput.Options.Outgoing.DataOption;
  }
}
