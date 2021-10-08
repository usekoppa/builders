import {
  validateMaxStringLength,
  validateStringHasNoSymbols,
  validateStringIsLowercase,
  validateValueIsString,
} from "./validators";

export abstract class NameAndDescription {
  readonly name!: string;
  readonly description!: string;

  abstract setName(name: string): NameAndDescription & unknown;
  abstract setDescription(description: string): NameAndDescription & unknown;

  protected _setName(name: string) {
    validateName(name);
    Reflect.set(this, "name", name);
    return this;
  }

  protected _setDescription(description: string) {
    validateDescription(description);
    Reflect.set(this, "description", description);
    return this;
  }
}

function validateName(name: unknown) {
  const noun = "command name";

  validateValueIsString(noun, name);

  validateMaxStringLength(noun, 32, name);

  validateStringHasNoSymbols(noun, name);

  validateStringIsLowercase(noun, name);
}

function validateDescription(description: unknown) {
  const noun = "command's description";

  validateValueIsString(noun, description);

  validateMaxStringLength(noun, 100, description);
}
