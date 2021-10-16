import { Name } from "../../name.mixin";
import {
  validateMaxStringLength,
  validateValueIsString,
} from "../../string_validators";

export abstract class NameAndDescription extends Name {
  readonly description!: string;

  abstract setDescription(description: string): NameAndDescription & unknown;

  protected _setDescription(description: string) {
    validateDescription(description);
    Reflect.set(this, "description", description);
    return this;
  }
}

function validateDescription(description: unknown) {
  const noun = "command's description";

  validateValueIsString(noun, description);

  validateMaxStringLength(noun, 100, description);
}
