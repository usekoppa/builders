import { Options } from "../../../api_types/options";

import { Option } from "./option.mixin";
import { Subcommand } from "./subcommand";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class SubcommandGroup<Name extends string = string> extends Option<
  Options.Type.SubcommandGroup,
  Name,
  false
> {
  readonly subcommands: Subcommand[] = [];

  addSubcommand(input: Subcommand | ((subcommand: Subcommand) => Subcommand)) {
    const subcommand =
      input instanceof Subcommand ? input : input(new Subcommand());
    this.subcommands.push(subcommand);
    return this;
  }

  resolve(option: Options.Incoming.SubcommandGroup) {
    const subcommandOption = option.options[0] as
      | Options.Incoming.Subcommand
      | undefined;

    if (subcommandOption?.type == Options.Type.Subcommand) {
      const subcommand = this.subcommands.find(
        subcmd => subcmd.name === subcommandOption.name
      );

      if (typeof subcommand === "undefined") return;

      return { subcommand, options: subcommandOption };
    }
  }

  toJSON() {
    return {
      type: this.type,
      name: this.name,
      description: this.description,
      options: this.subcommands.map(subcmd => subcmd.toJSON()),
    };
  }
}
