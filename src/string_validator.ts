const specialSymbols = /^[\p{L}\p{N}_-]+$/u;

/**
 * Validates if a value is a string as well
 * as allows other tests to be validated against the value.
 */
export class StringValidator {
  /**
   * The value for the string validator to use.
   */
  public readonly value: string;

  /**
   * @param noun - The name of the value, used in the errors thrown.
   * @param value - The value for the string validator to use.
   *
   * @throws {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError | TypeError}
   * Throws if value is not a string.
   */
  constructor(public readonly noun: string, value: unknown) {
    this.#isString(value);
    this.value = value;
  }

  /**
   * Validates that there are no special symbols.
   *
   * @remarks
   * The validation will pass if the value can be tested against `/^[\p{L}\p{N}_-]+$/u`.
   *
   * @throws {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError | TypeError}
   * Thrown if any special symbols that are found in the string.
   */
  hasNoSymbols() {
    if (!specialSymbols.test(this.value)) {
      throw new TypeError(
        `The ${this.noun} cannot have any special characters in it`
      );
    }
  }

  /**
   * Validates that the string is not empty
   * but does not exceed the specified length.
   *
   * @param length - The maximum length of the string
   *
   * @throws {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError | TypeError}
   * Thrown if the string has a length of 0 or exceeds the maximum length.
   */
  meetsLength(length: number) {
    // Check if length is >= 1 but <= length.
    if (length % this.value.length < length) {
      throw new TypeError(
        `The ${this.noun} must be between 1 and 32 characters long`
      );
    }
  }

  /**
   * Validates if the string is in all lowercase characters.
   *
   * @throws {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError | TypeError}
   * Thrown when any uppercase characters are found in the string.
   */
  isLowercase() {
    if (this.value !== this.value.toLowerCase()) {
      throw new TypeError(`The ${this.noun} must be in all lowercase`);
    }
  }

  #isString(value: unknown): asserts value is string {
    const type = typeof value;
    if (type !== "string") {
      throw new TypeError(
        `The ${this.noun} must be a string, got type \`${type}\` instead`
      );
    }
  }
}
