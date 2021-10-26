import { StringValidator } from "./string_validator";

/**
 * An object that has a name you can set.
 */
export interface Name {
  /**
   * The name.
   */
  readonly name: string;

  /**
   * Set's the name
   * @param name The name
   */
  setName(name: string): unknown;
}

export function validateName(name: unknown) {
  const validator = new StringValidator("name", name);
  validator.meetsLength(32);
  validator.hasNoSymbols();
  validator.isLowercase();
}
