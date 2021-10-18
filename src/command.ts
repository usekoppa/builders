import {
  APIApplicationCommandOptionChoice,
  ChannelType,
} from "discord-api-types";

import { Commands } from "./api/commands";
import { Options } from "./api/options";
import { ResolvedOptions } from "./resolved_options";
import {
  validateMaxStringLength,
  validateStringHasNoSymbols,
  validateStringIsLowercase,
  validateValueIsString,
} from "./string_validator";
import { Subcommand } from "./subcommand";

export interface JSONifiable<APIData> {
  toJSON(): APIData;
}

export interface NameAndDescription {
  readonly name: string;
  readonly description: string;

  setName(name: string): unknown;
  setDescription(description: string): unknown;
}

function validateName(name: unknown) {
  const noun = "command/options/menu name";

  validateValueIsString(noun, name);

  validateMaxStringLength(noun, 32, name);

  validateStringHasNoSymbols(noun, name);

  validateStringIsLowercase(noun, name);
}

function validateDescription(description: unknown) {
  const noun = "command/option description";

  validateValueIsString(noun, description);

  validateMaxStringLength(noun, 100, description);
}

export type OptionArgument<InputOption> = InputOption extends SubcommandGroup
  ? never
  : InputOption extends Option<infer Type, infer Name, infer IsRequired>
  ? Record<
      Name,
      ResolvedOptions[Type] | (IsRequired extends true ? never : undefined)
    >
  : InputOption extends OptionWithChoices<
      Options.ChoiceType,
      infer Name,
      infer IsRequired,
      infer Value
    >
  ? Record<Name, Value | (IsRequired extends true ? never : undefined)>
  : never;

export class Option<
  Type extends Options.DataType | Options.Type.SubcommandGroup =
    | Options.DataType
    | Options.Type.SubcommandGroup,
  Name extends string = string,
  IsRequired extends boolean = boolean
> implements NameAndDescription, JSONifiable<Options.Outgoing.DataOption>
{
  readonly name!: Name;
  readonly description!: string;
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

  setRequired<NewIsRequired extends boolean>(required: NewIsRequired) {
    Reflect.set(this, "required", required);
    return this as unknown as Option<Type, Name, NewIsRequired>;
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

class OptionWithChoices<
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

export class ChannelOption<
  Name extends string = string,
  IsRequired extends boolean = boolean
> extends Option<Options.Type.Channel, Name, IsRequired> {
  readonly channelTypes?: ChannelType[];

  constructor() {
    super(Options.Type.Channel);
  }

  setName<NewName extends string>(name: NewName) {
    validateName(name);
    Reflect.set(this, "name", name);
    return this as unknown as ChannelOption<NewName, IsRequired>;
  }

  setDescription(description: string) {
    validateDescription(description);
    Reflect.set(this, "description", description);
    return this;
  }

  setRequired<NewIsRequired extends boolean>(required: NewIsRequired) {
    Reflect.set(this, "required", required);
    return this as unknown as ChannelOption<Name, NewIsRequired>;
  }

  setChannelTypes(types: ChannelType[]) {
    Reflect.set(this, "channelTypes", types);
    return this;
  }

  addChannelType(type: ChannelType) {
    if (typeof this.channelTypes === "undefined") {
      Reflect.set(this, "channelTypes", []);
    }

    this.channelTypes!.push(type);
    return this;
  }

  toJSON() {
    const data = super.toJSON() as Options.Outgoing.Channel;
    if (typeof this.channelTypes !== "undefined") {
      data.channel_types = this.channelTypes;
    }

    return data;
  }
}

type SubcommandBuilderInput =
  | Subcommand
  | ((subcommand: Subcommand) => Subcommand);

export class SubcommandGroup extends Option<Options.Type.SubcommandGroup> {
  readonly options: Subcommand[] = [];
  readonly required: undefined;

  constructor() {
    super(Options.Type.SubcommandGroup);

    this.setRequired = () => {
      throw new Error("Subcommand groups can't be set as required");
    };
  }

  addSubcommand(input: SubcommandBuilderInput) {
    const option = getSubcommandFromInput(input);
    this.options.push(option);
    return this;
  }

  toJSON() {
    const data = super.toJSON();
    delete data.required;
    (data as unknown as Options.Outgoing.SubcommandGroup).options =
      this.options.map(opt => opt.toJSON());

    return data;
  }
}

function getSubcommandFromInput(input: SubcommandBuilderInput) {
  return input instanceof Command
    ? (input as Subcommand)
    : (input as Exclude<SubcommandBuilderInput, Subcommand>)(
        new Command(true) as unknown as Subcommand
      );
}

export type BuilderInput<InputOption extends Option = Option> =
  | InputOption
  | ((option: InputOption) => InputOption);

type CommandReturnType<
  Arguments,
  IsSubcommand extends boolean
> = IsSubcommand extends true ? Subcommand<Arguments> : Command<Arguments>;

type BaseCommandParent = Omit<
  Command,
  | "addBooleanOption"
  | "addIntegerOption"
  | "addMentionableOption"
  | "addNumberOption"
  | "addRoleOption"
  | "addStringOption"
  | "addUserOption"
>;

type SubcommandParent = Omit<BaseCommandParent, "addSubcommandGroup">;
type SubcommandGroupParent = Omit<BaseCommandParent, "addSubcommand">;

export class Command<Arguments = {}, IsSubcommand extends boolean = false>
  implements
    NameAndDescription,
    JSONifiable<
      IsSubcommand extends true
        ? Options.Outgoing.Subcommand
        : Commands.ChatInput.Outgoing.Command
    >
{
  readonly name!: string;
  readonly description!: string;
  readonly defaultPermission?: boolean;
  readonly options?: (Option | Subcommand)[];

  #hasSubcommandChildren = false;

  constructor(
    public readonly isSubcommand: IsSubcommand = false as IsSubcommand
  ) {}

  setName(name: string) {
    validateName(name);
    Reflect.set(this, "name", name);
    return this;
  }

  setDescription(description: string) {
    validateDescription(description);
    Reflect.set(this, "description", description);
    return this;
  }

  addBooleanOption(input: BuilderInput<Option<Options.Type.Boolean>>) {
    return this.#addOption(Option, Options.Type.Boolean, input);
  }

  addIntegerOption(
    input: BuilderInput<OptionWithChoices<Options.Type.Integer>>
  ) {
    return this.#addOption(OptionWithChoices, Options.Type.Integer, input);
  }

  addMentionableOption(input: BuilderInput<Option<Options.Type.Mentionable>>) {
    return this.#addOption(Option, Options.Type.Mentionable, input);
  }

  addNumberOption(input: BuilderInput<OptionWithChoices<Options.Type.Number>>) {
    return this.#addOption(OptionWithChoices, Options.Type.Number, input);
  }

  addRoleOption(input: BuilderInput<Option<Options.Type.Role>>) {
    return this.#addOption(Option, Options.Type.Role, input);
  }

  addStringOption(input: BuilderInput<OptionWithChoices<Options.Type.String>>) {
    return this.#addOption(OptionWithChoices, Options.Type.String, input);
  }

  addUserOption(input: BuilderInput<Option<Options.Type.User>>) {
    return this.#addOption(Option, Options.Type.User, input);
  }

  addChannelOption(input: BuilderInput<ChannelOption>) {
    return this.#addOption(ChannelOption, Options.Type.Channel, input);
  }

  addSubcommandGroup(input: BuilderInput<SubcommandGroup>) {
    if (this.isSubcommand) {
      throw new Error("You can not add a subcommand group to a subcommand");
    }

    this.#addOption(SubcommandGroup, Options.Type.SubcommandGroup, input);
    this.#hasSubcommandChildren = true;
    return this as unknown as SubcommandGroupParent;
  }

  addSubcommand(input: SubcommandBuilderInput) {
    this.#addOptionsIfUndefined();
    const option = getSubcommandFromInput(input);
    this.options!.push(option);
    this.#hasSubcommandChildren = true;
    return this as unknown as SubcommandParent;
  }

  toJSON() {
    const data: Record<string, unknown> = {
      type: this.isSubcommand
        ? Options.Type.Subcommand
        : Commands.Type.ChatInput,
      name: this.name,
      description: this.description,
    };

    if (typeof this.options !== "undefined" && this.options.length !== 0) {
      data.options = this.options;
    }

    if (!this.isSubcommand && typeof this.defaultPermission !== "undefined") {
      data.default_permission = this.defaultPermission;
    }

    return data as unknown as IsSubcommand extends true
      ? Options.Outgoing.Subcommand
      : Commands.ChatInput.Outgoing.Command;
  }

  #addOption<
    Type extends Options.DataType | Options.Type.SubcommandGroup,
    InputOption extends Option<Type>
  >(
    NewOption: { new (type: Type): InputOption & unknown },
    type: Type,
    input: BuilderInput<InputOption & unknown>
  ) {
    if (this.#hasSubcommandChildren && type !== Options.Type.SubcommandGroup) {
      throw new Error(
        "Commands cannot have regular options if they have subcommands or subcommand groups"
      );
    }

    const option = input instanceof Option ? input : input(new NewOption(type));
    this.#addOptionsIfUndefined();
    this.options![option.required ? "unshift" : "push"](option);

    return this as unknown as CommandReturnType<
      Arguments & OptionArgument<InputOption>,
      IsSubcommand
    >;
  }

  #addOptionsIfUndefined() {
    if (typeof this.options === "undefined") {
      Reflect.set(this, "options", []);
    }
  }
}
