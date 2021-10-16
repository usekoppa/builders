import {
  validateMaxStringLength,
  validateValueIsString,
} from "../../string_validators";

export abstract class Description {
  readonly description!: string;

  abstract setDescription(description: string): Description & unknown;

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
