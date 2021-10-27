/**
 * Validates if the provided `value` is a boolean.
 *
 * @param noun - The name of the value to use in the error message if the validation fails
 * @param value - The value to validate whether or not it is a boolean.
 *
 * @throws {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError | TypeError}
 * Throws if the value is not a boolean.
 */
export function validateValueIsBoolean(
  noun: string,
  value: unknown
): asserts value is boolean {
  if (typeof value !== "boolean") {
    throw new Error(`Expected a boolean for ${noun}`);
  }
}
