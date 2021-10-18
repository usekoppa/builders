import { Subcommand } from "./options/subcommand";

export abstract class SubcommandBuilder {
  readonly subcommands: Subcommand[] = [];

  addSubcommand(input: Subcommand | ((subcommand: Subcommand) => Subcommand)) {
    const subcommand =
      input instanceof Subcommand ? input : input(new Subcommand());
    this.subcommands.push(subcommand);
    return this;
  }
}
