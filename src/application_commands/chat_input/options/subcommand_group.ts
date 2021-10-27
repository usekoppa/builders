import { Commands } from "../../../api";
import {
  getSubcommandFromInput,
  SubcommandBuilderInput,
} from "../builder_input";

import { getOptionKey } from "./get_option_key";
import { Option } from "./option";
import { Subcommand } from "./subcommand";

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

  setName<NewName extends string>(name: NewName) {
    super.setName(name);
    return this as unknown as SubcommandGroup &
      Option<Commands.ChatInput.Options.Type.SubcommandGroup, NewName>;
  }

  /**
   * Adds a subcommand to the subcommand group.
   *
   * @param input - The input that resolves to a subcommand
   * @returns `this`
   */
  addSubcommand(input: SubcommandBuilderInput) {
    const option = getSubcommandFromInput(input);
    this.options.set(getOptionKey(option), option);
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
