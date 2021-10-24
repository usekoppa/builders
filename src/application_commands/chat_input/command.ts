import { Commands } from "../../api/commands";
import {
  Executable,
  Executor,
  kCreateContext,
  kExecute,
} from "../../executable";
import { JSONifiable } from "../../JSONifiable";
import {
  NameAndDescription,
  validateDescription,
  validateName,
} from "../../name_and_description";

import { ChannelOption } from "./channel_option";
import { Option, OptionArgument } from "./option";
import { OptionWithChoices } from "./option_with_choices";
import { Subcommand } from "./subcommand";
import {
  getSubcommandFromInput,
  SubcommandBuilderInput,
  SubcommandGroup,
} from "./subcommand_group";

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

export class Command<Arguments = {}, IsSubcommand extends boolean = false>
  implements
    NameAndDescription,
    Executable<CommandContext<Arguments>>,
    JSONifiable<
      IsSubcommand extends true
        ? Commands.ChatInput.Options.Outgoing.Subcommand
        : Commands.ChatInput.Outgoing.Command
    >
{
  readonly name!: string;
  readonly description!: string;
  readonly defaultPermission?: boolean;
  readonly options?: Map<symbol, Option | Subcommand>;

  readonly [kExecute]?: Executor<CommandContext<Arguments>>;

  protected readonly type = this.isSubcommand
    ? Commands.ChatInput.Options.Type.Subcommand
    : void 0;

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

  setExecutor(executor: Executor<CommandContext<Arguments>>) {
    Reflect.set(this, kExecute, executor);
    return this;
  }

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
    validateName(this.name);
    validateDescription(this.description);

    const data: Record<string, unknown> = {
      type: this.isSubcommand
        ? Commands.ChatInput.Options.Type.Subcommand
        : Commands.Type.ChatInput,
      name: this.name,
      description: this.description,
    };

    if (typeof this.options !== "undefined" && this.options.size !== 0) {
      data.options = [...this.options.values()];
    }

    if (!this.isSubcommand && typeof this.defaultPermission !== "undefined") {
      data.default_permission = this.defaultPermission;
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

        const subcmd = group.options.get(Command.getOptionKey(subcmdData));
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

  protected getOption(option: { name: string; type: number }) {
    return this.options?.get(Command.getOptionKey(option));
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
    this.options!.set(Command.getOptionKey(option), option);
  }

  #addOptionsIfUndefined() {
    if (typeof this.options === "undefined") {
      Reflect.set(this, "options", new Map());
    }
  }

  static getOptionKey(
    option: {
      name: string;
      type: number;
    },
    isCommand = false
  ) {
    return Symbol.for(
      `name=${option.name},type=${isCommand ? "command" : option.type}`
    );
  }
}
