import {
  validateMaxStringLength,
  validateStringHasNoSymbols,
  validateStringIsLowercase,
  validateValueIsString,
} from "./commands/string_validator";

export interface NameAndDescription {
  readonly name: string;
  readonly description: string;

  setName(name: string): unknown;
  setDescription(description: string): unknown;
}

export function validateName(name: unknown) {
  const noun = "command/options/menu name";

  validateValueIsString(noun, name);

  validateMaxStringLength(noun, 32, name);

  validateStringHasNoSymbols(noun, name);

  validateStringIsLowercase(noun, name);
}

export function validateDescription(description: unknown) {
  const noun = "command/option description";

  validateValueIsString(noun, description);

  validateMaxStringLength(noun, 100, description);
}
