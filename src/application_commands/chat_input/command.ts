import { Commands } from "../../api";
import { Description, validateDescription } from "../../description";
import {
  Executable,
  Executor,
  kCreateContext,
  kExecute,
} from "../../execution/executable";
import type { JSONifiable } from "../../JSONifiable";
import { ApplicationCommand } from "../application_command";

import {
  BuilderInput,
  getOptionFromInput,
  getSubcommandFromInput,
  SubcommandBuilderInput,
} from "./builder_input";
import {
  BasicOption,
  ChannelOption,
  getOptionKey,
  Option,
  OptionArgument,
  OptionWithChoices,
  Subcommand,
  SubcommandGroup,
} from "./options";

/**
 * A chat input command.
 *
 * @typeParam Arguments - The type data of the arguments that will be received on an interaction.
 * @typeParam IsSubcommand - Whether or not the command is a subcommand.
 */
export class Command<Arguments = {}, IsSubcommand extends boolean = false>
  extends ApplicationCommand
  implements
    Description,
    Executable<CommandContext<Arguments>>,
    JSONifiable<
      IsSubcommand extends true
        ? Commands.ChatInput.Options.Outgoing.Subcommand
        : Commands.ChatInput.Outgoing.Command
    >
{
  /**
   * The command's description.
   */
  readonly description!: string;

  /**
   * The options for the command
   */
  readonly options?: Map<symbol, Option | Subcommand>;

  /**
   * The executor for the command.
   *
   * @internal
   */
  readonly [kExecute]?: Executor<CommandContext<Arguments>>;

  protected readonly type = this.isSubcommand
    ? Commands.ChatInput.Options.Type.Subcommand
    : void 0;

  #hasSubcommandChildren = false;

  constructor(
    public readonly isSubcommand: IsSubcommand = false as IsSubcommand
  ) {
    super();
  }

  /**
   * Set's the command's description.
   *
   * @param description - The command's description.
   * @returns `this`
   */
  setDescription(description: string) {
    validateDescription(description);
    Reflect.set(this, "description", description);
    return this;
  }

  /**
   * Set's the executor for the command.
   *
   * @param executor - The command's execution handler.
   * @returns `this`
   */
  setExecutor(executor: Executor<CommandContext<Arguments>>) {
    Reflect.set(this, kExecute, executor);
    return this;
  }

  /**
   * Adds a boolean option to the command.
   *
   * @param input - An option or callback that returns an option.
   * @returns Itself with extra type information.
   */
  addBooleanOption(
    input: BuilderInput<Option<Commands.ChatInput.Options.Type.Boolean>>
  ) {
    return this.#addOption(
      Option,
      Commands.ChatInput.Options.Type.Boolean,
      input
    );
  }

  /**
   * Adds an integer option to the command.
   *
   * @param input - An option or callback that returns an option.
   * @returns Itself with extra type information.
   */
  addIntegerOption(
    input: BuilderInput<
      OptionWithChoices<Commands.ChatInput.Options.Type.Integer>
    >
  ) {
    return this.#addOption(
      OptionWithChoices,
      Commands.ChatInput.Options.Type.Integer,
      input
    );
  }

  /**
   * Adds a mentionable option to the command.
   *
   * @param input - An option or callback that returns an option.
   * @returns `this` with extra type information.
   */
  addMentionableOption(
    input: BuilderInput<Option<Commands.ChatInput.Options.Type.Mentionable>>
  ) {
    return this.#addOption(
      Option,
      Commands.ChatInput.Options.Type.Mentionable,
      input
    );
  }

  /**
   * Adds a number option to the command.
   *
   * @param input - An option or callback that returns an option.
   * @returns `this` with extra type information.
   */
  addNumberOption(
    input: BuilderInput<
      OptionWithChoices<Commands.ChatInput.Options.Type.Number>
    >
  ) {
    return this.#addOption(
      OptionWithChoices,
      Commands.ChatInput.Options.Type.Number,
      input
    );
  }

  /**
   * Adds a role option to the command.
   *
   * @param input - An option or callback that returns an option.
   * @returns `this` with extra type information.
   */
  addRoleOption(
    input: BuilderInput<Option<Commands.ChatInput.Options.Type.Role>>
  ) {
    return this.#addOption(Option, Commands.ChatInput.Options.Type.Role, input);
  }

  /**
   * Adds a string option to the command.
   *
   * @param input - An option or callback that returns an option.
   * @returns `this` with extra type information.
   */
  addStringOption(
    input: BuilderInput<
      OptionWithChoices<Commands.ChatInput.Options.Type.String>
    >
  ) {
    return this.#addOption(
      OptionWithChoices,
      Commands.ChatInput.Options.Type.String,
      input
    );
  }

  /**
   * Adds a user option to the command.
   *
   * @param input - An option or callback that returns an option.
   * @returns `this` with extra type information.
   */
  addUserOption(
    input: BuilderInput<Option<Commands.ChatInput.Options.Type.User>>
  ) {
    return this.#addOption(Option, Commands.ChatInput.Options.Type.User, input);
  }

  /**
   * Adds a channel option to the command.
   *
   * @param input - An option or callback that returns an option.
   * @returns `this` with extra type information.
   */
  addChannelOption(input: BuilderInput<ChannelOption>) {
    return this.#addOption(
      ChannelOption,
      Commands.ChatInput.Options.Type.Channel,
      input
    );
  }

  /**
   * Adds a subcommand group to the command.
   *
   * @param input - A subcommand group or callback that returns a subcommand group.
   * @returns `this` with extra type information.
   */
  addSubcommandGroup(input: BuilderInput<SubcommandGroup>) {
    if (this.isSubcommand) {
      throw new Error("You can not add a subcommand group to a subcommand");
    }

    this.#addOption(
      SubcommandGroup,
      Commands.ChatInput.Options.Type.SubcommandGroup,
      input
    );

    this.#hasSubcommandChildren = true;
    return this as unknown as SubcommandGroupParent;
  }

  /**
   * Adds a subcommand to the command.
   *
   * @param input - A subcommand or callback that returns a subcommand.
   * @returns `this` with extra type information.
   */
  addSubcommand(input: SubcommandBuilderInput) {
    const option = getSubcommandFromInput(input);
    this.#setOption(option);
    this.#hasSubcommandChildren = true;
    return this as unknown as SubcommandParent;
  }

  toJSON() {
    validateDescription(this.description);
    const data: Record<string, unknown> = {
      type: this.isSubcommand
        ? Commands.ChatInput.Options.Type.Subcommand
        : Commands.Type.ChatInput,
      description: this.description,
      ...super._toJSON(),
    };

    if (this.isSubcommand) delete data.default_permission;
    if (typeof this.options !== "undefined" && this.options.size !== 0) {
      data.options = [...this.options.values()];
    }

    return data as unknown as IsSubcommand extends true
      ? Commands.ChatInput.Options.Outgoing.Subcommand
      : Commands.ChatInput.Outgoing.Command;
  }

  [kCreateContext](interaction: Commands.ChatInput.Incoming.Interaction) {
    if (typeof this.options === "undefined" || this.options.size === 0) {
      return Object.freeze({ cmd: void 0, args: {} as Arguments });
    }

    /* Process subcommands and subcommand groups. */

    let cmdData = interaction.data as
      | Commands.ChatInput.Incoming.Command
      | Commands.ChatInput.Options.Incoming.Subcommand;

    let cmd = this.getOption(cmdData) as Command | Subcommand;

    let optionsData =
      cmdData.options as unknown as Commands.ChatInput.Options.Incoming.DataOption[];

    const subcmdGroupData = optionsData?.[0] as unknown as
      | Commands.ChatInput.Options.Incoming.SubcommandGroup
      | undefined;

    if (typeof subcmdGroupData !== "undefined") {
      const group = this.getOption(subcmdGroupData) as SubcommandGroup;

      if (typeof group !== "undefined") {
        const subcmdData = subcmdGroupData.options[0];

        // You can't have a subcommand group without a subcommand, this data is corrupt.
        if (typeof subcmdData === "undefined") return;

        const subcmd = group.options.get(getOptionKey(subcmdData));
        const subcmdOptionsData = subcmdData?.options;
        if (typeof subcmdOptionsData !== "undefined") {
          optionsData = subcmdOptionsData;
          cmdData = subcmdData;
          cmd = subcmd as Subcommand;
        }
      }
    }

    /* Gather arguments */

    const args: Record<string, unknown> = {};
    for (const optionData of optionsData) {
      const option = (cmd as Command).getOption(optionData) as Option;
      if (
        typeof option.required === "undefined" &&
        (typeof optionData.value !== "undefined" || optionData.value !== null)
      ) {
        return;
      }

      // I hate null, I prefer undefined any day.
      args[option.name] = optionData.value ?? void 0;
    }

    return { cmd, args } as unknown as CommandContext<Arguments>;
  }

  /**
   * Gets an option instance that's associated with this command.
   *
   * @param option - The name and type of option.
   * @returns An option.
   */
  protected getOption(option: BasicOption) {
    return this.options?.get(getOptionKey(option));
  }

  #addOption<
    Type extends
      | Commands.ChatInput.Options.DataType
      | Commands.ChatInput.Options.Type.SubcommandGroup,
    InputOption extends Option<Type>
  >(
    NewOption: { new (type: Type): InputOption & unknown },
    type: Type,
    input: BuilderInput<InputOption & unknown>
  ) {
    if (
      this.#hasSubcommandChildren &&
      type !== Commands.ChatInput.Options.Type.SubcommandGroup
    ) {
      throw new Error(
        "Commands cannot have regular options if they have subcommands or subcommand groups"
      );
    }

    const option = getOptionFromInput(NewOption, type, input);
    this.#setOption(option);

    return this as unknown as CommandReturnType<
      Arguments & OptionArgument<InputOption>,
      IsSubcommand
    >;
  }

  #setOption(option: Option | Subcommand) {
    this.#addOptionsIfUndefined();
    this.options!.set(getOptionKey(option), option);
  }

  #addOptionsIfUndefined() {
    if (typeof this.options === "undefined") {
      Reflect.set(this, "options", new Map());
    }
  }
}

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

export interface CommandContext<Arguments = {}> {
  cmd?: Command<Arguments> | Subcommand<Arguments>;
  args: Arguments;
}
