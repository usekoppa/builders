import { Commands } from "../api/commands";

import { Command } from "./command";
import { Option } from "./option";
import { Subcommand } from "./subcommand";

export type SubcommandBuilderInput =
  | Subcommand
  | ((subcommand: Subcommand) => Subcommand);

export class SubcommandGroup extends Option<Commands.ChatInput.Options.Type.SubcommandGroup> {
  readonly options: Subcommand[] = [];
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

  addSubcommand(input: SubcommandBuilderInput) {
    const option = getSubcommandFromInput(input);
    this.options.push(option);
    return this;
  }

  toJSON() {
    const data = super.toJSON();
    delete data.required;

    (
      data as unknown as Commands.ChatInput.Options.Outgoing.SubcommandGroup
    ).options = this.options.map(opt => opt.toJSON());

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
