import { Commands } from "../api/commands";
import { Options } from "../api/options";
import { JSONifiable } from "../JSONifiable";
import {
  NameAndDescription,
  validateDescription,
  validateName,
} from "../name_and_description";

import { ChannelOption } from "./channel_option";
import { Option, OptionArgument } from "./option";
import { OptionWithChoices } from "./option_with_choices";
import { Subcommand } from "./subcommand";
import {
  getSubcommandFromInput,
  SubcommandBuilderInput,
  SubcommandGroup,
} from "./subcommand_builder";

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
