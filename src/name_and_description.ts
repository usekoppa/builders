import { StringValidator } from "./string_validator";

export interface NameAndDescription {
  readonly name: string;
  readonly description: string;

  setName(name: string): unknown;
  setDescription(description: string): unknown;
}

export function validateName(name: unknown) {
  const validator = new StringValidator("name", name);
  validator.meetsLength(32);
  validator.hasNoSymbols();
  validator.isLowercase();
}

export function validateDescription(description: unknown) {
  const validator = new StringValidator("description", description);
  validator.meetsLength(100);
}
