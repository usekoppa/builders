import { mix } from "ts-mixer";

import { Options } from "../api/options";

import { Option, PolymorphicOption } from "./option";

@mix(Option)
export class Subcommand {
  readonly options: Option<Options.DataType>[] = [];

  constructor();
  constructor(
    public readonly type: Options.Type.Subcommand = Options.Type.Subcommand
  ) {}

  resolve() {}
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Subcommand
  extends PolymorphicOption<Options.Type.Subcommand> {}
