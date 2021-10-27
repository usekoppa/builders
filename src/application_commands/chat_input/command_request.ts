import { Commands } from "../../api";

import { Command } from "./command";
import { Subcommand, SubcommandGroup } from "./options";

export class CommandRequest<Arguments = {}> {
  readonly subcommandGroup?: SubcommandGroup;
  readonly arguments?: Arguments;

  constructor(
    interaction: Commands.ChatInput.Incoming.Interaction,
    command: Command<Arguments>
  );
  constructor(
    interaction: Commands.ChatInput.Incoming.Interaction,
    command: Command,
    subcommand: Subcommand<Arguments>
  );
  constructor(
    interaction: Commands.ChatInput.Incoming.Interaction,
    command: Command,
    subcommandGroup: SubcommandGroup,
    subcommand: Subcommand<Arguments>
  );
  constructor(
    public readonly interaction: Commands.ChatInput.Incoming.Interaction,
    public readonly command: Command<Arguments>,
    subcommandGroupOrSubcommand?: SubcommandGroup | Subcommand<Arguments>,
    public readonly subcommand?: Subcommand<Arguments>
  ) {
    if (subcommandGroupOrSubcommand instanceof SubcommandGroup) {
      this.subcommandGroup = subcommandGroupOrSubcommand;
    } else {
      this.subcommand = subcommandGroupOrSubcommand;
    }
  }
}
