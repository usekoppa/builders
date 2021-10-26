import { Commands } from "../../api";

import { Command } from "./command";
import { Option } from "./option";
import { Subcommand } from "./subcommand";
import { SubcommandBuilderInput } from "./subcommand_builder_input";

/**
 * A subcommand group option.
 */
export class SubcommandGroup extends Option<Commands.ChatInput.Options.Type.SubcommandGroup> {
  readonly options = new Map<symbol, Subcommand>();
  readonly required: undefined;

  constructor() {
    super(Commands.ChatInput.Options.Type.SubcommandGroup);

    this.setRequired = () => {
      throw new Error("Subcommand groups can't be set as required");
    };
  }

  /**
   * Set's the name of the subcommand group
   * @param name The name for the subcommand group
   * @returns {this} Returns itself with the addition of type data for the name.
   */
  setName<NewName extends string>(name: NewName) {
    super.setName(name);
    return this as unknown as SubcommandGroup &
      Option<Commands.ChatInput.Options.Type.SubcommandGroup, NewName>;
  }

  /**
   * Adds a subcommand to the subcommand group.
   * @param input {SubcommandBuilderInput} The input that resolves to a subcommand
   * @returns {this}
   */
  addSubcommand(input: SubcommandBuilderInput) {
    const option = getSubcommandFromInput(input);
    this.options.set(Command.getOptionKey(option), option);
    return this;
  }

  toJSON() {
    const data = super.toJSON();
    delete data.required;

    (
      data as unknown as Commands.ChatInput.Options.Outgoing.SubcommandGroup
    ).options = [...this.options.values()].map(opt => opt.toJSON());

    return data;
  }
}

export function getSubcommandFromInput(input: SubcommandBuilderInput) {
  return input instanceof Command
    ? (input as Subcommand)
    : (input as Exclude<SubcommandBuilderInput, Subcommand>)(
        new Command(true) as unknown as Subcommand
      );
}
