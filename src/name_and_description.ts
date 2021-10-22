import { StringValidator } from "./string_validator";

export interface NameAndDescription {
  readonly name: string;
  readonly description: string;

  setName(name: string): unknown;
  setDescription(description: string): unknown;
}

export function validateName(noun = "command/options/menu", name: unknown) {
  noun = `${noun} name`;
  const validator = new StringValidator(noun, name);
  validator.meetsLength(32);
  validator.hasNoSymbols();
  validator.isLowercase();
}

export function validateDescription(
  noun = "command/option",
  description: unknown
) {
  noun = `${noun} description`;
  const validator = new StringValidator(noun, description);
  validator.meetsLength(100);
}
