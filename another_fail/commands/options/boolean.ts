import { mix } from "ts-mixer";

import { Options } from "../../api/options";
import { Option, PolymorphicOption } from "../option";

@mix(Option)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class BooleanOption<Name extends string, IsRequired extends boolean> {
  constructor();
  constructor(
    public readonly type: Options.Type.Boolean = Options.Type.Boolean
  ) {}
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface BooleanOption<Name, IsRequired>
  extends PolymorphicOption<Options.Type.Boolean, Name, IsRequired> {}
