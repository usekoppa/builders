import { StringValidator } from "../string_validator";

/**
 * Validates that a label fits the format that Discord requires.
 *
 * @param label - The label for use in the component or option.
 * @throws {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError | TypeError}
 * Throws if the label is greater than 80 characters long or is empty.
 */
export function validateLabel(label: unknown): asserts label is string {
  const validator = new StringValidator("label", label);
  validator.meetsLength(80);
}
