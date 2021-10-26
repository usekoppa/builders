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

import { ChannelOption } from "./channel_option";
import { BasicOption, getOptionKey } from "./get_option_key";
import { Option, OptionArgument } from "./option";
import { OptionWithChoices } from "./option_with_choices";
import type { Subcommand } from "./subcommand";
import type { SubcommandBuilderInput } from "./subcommand_builder_input";
import { getSubcommandFromInput, SubcommandGroup } from "./subcommand_group";

/**
 * A chat input command.
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
  readonly description!: string;
  readonly options?: Map<symbol, Option | Subcommand>;

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
   * @param {string} description The command's description.
   * @returns {this}
   */
  setDescription(description: string) {
    validateDescription(description);
    Reflect.set(this, "description", description);
    return this;
  }

  /**
   * Set's the executor for the command.
   * @param {Executor} executor The command's execution handler.
   * @returns
   */
  setExecutor(executor: Executor<CommandContext<Arguments>>) {
    Reflect.set(this, kExecute, executor);
    return this;
  }

  /**
   * Adds a boolean option to the command.
   * @param {BuilderInput} input
   * @returns
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

  addMentionableOption(
    input: BuilderInput<Option<Commands.ChatInput.Options.Type.Mentionable>>
  ) {
    return this.#addOption(
      Option,
      Commands.ChatInput.Options.Type.Mentionable,
      input
    );
  }

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

  addRoleOption(
    input: BuilderInput<Option<Commands.ChatInput.Options.Type.Role>>
  ) {
    return this.#addOption(Option, Commands.ChatInput.Options.Type.Role, input);
  }

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

  addUserOption(
    input: BuilderInput<Option<Commands.ChatInput.Options.Type.User>>
  ) {
    return this.#addOption(Option, Commands.ChatInput.Options.Type.User, input);
  }

  addChannelOption(input: BuilderInput<ChannelOption>) {
    return this.#addOption(
      ChannelOption,
      Commands.ChatInput.Options.Type.Channel,
      input
    );
  }

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
   *
   * @param {BasicOption} option
   * @returns
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

    const option = input instanceof Option ? input : input(new NewOption(type));
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

export interface CommandContext<Arguments = {}> {
  cmd?: Command<Arguments> | Subcommand<Arguments>;
  args: Arguments;
}
