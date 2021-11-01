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
   * Sets the name.
   *
   * @param name - The name.
   */
  setName(name: string): unknown;
}

/**
 * Validates that the name complies with API specifications.
 *
 * @remarks
 * The name must be no greater than 32 characters long.
 *
 * @throws {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError | TypeError}
 * Thrown if any special symbols that are found in the string.
 */
export function validateName(name: unknown) {
  const validator = new StringValidator("name", name);
  validator.withinLength(32);
  validator.hasNoSymbols();
  validator.isLowercase();
}
