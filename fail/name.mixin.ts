import {
  validateMaxStringLength,
  validateStringHasNoSymbols,
  validateStringIsLowercase,
  validateValueIsString,
} from "./string_validators";

export abstract class Name {
  readonly name!: string;

  abstract setName(name: string): Name & unknown;

  protected _setName(name: string) {
    validateName(name);
    Reflect.set(this, "name", name);
    return this;
  }
}

function validateName(name: unknown) {
  const noun = "command/menu name";

  validateValueIsString(noun, name);

  validateMaxStringLength(noun, 32, name);

  validateStringHasNoSymbols(noun, name);

  validateStringIsLowercase(noun, name);
}
