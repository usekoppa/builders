import { StringValidator } from "./string_validator";

export interface Name {
  readonly name: string;

  setName(name: string): unknown;
}

export function validateName(name: unknown) {
  const validator = new StringValidator("name", name);
  validator.meetsLength(32);
  validator.hasNoSymbols();
  validator.isLowercase();
}
