import { Mixin } from "ts-mixer";

import { Name } from "../../name.mixin";

import { Description } from "./description.mixin";

export abstract class NameAndDescription extends Mixin(Name, Description) {}
