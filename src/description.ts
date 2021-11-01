import { StringValidator } from "./string_validator";

/**
 * An object that has a description that you can set.
 */
export interface Description {
  /**
   * The description
   */
  readonly description: string;

  /**
   * Sets the description.
   *
   * @param description - The description.
   */
  setDescription(description: string): unknown;
}

export function validateDescription(description: unknown) {
  const validator = new StringValidator("description", description);
  validator.withinLength(100);
}
