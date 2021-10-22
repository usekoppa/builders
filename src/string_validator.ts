const hasNoSymbols = /^[\p{L}\p{N}_-]+$/u;

export class StringValidator {
  public readonly value: string;

  constructor(public readonly noun: string, value: unknown) {
    this.#isString(value);
    this.value = value;
  }

  hasNoSymbols() {
    if (!hasNoSymbols.test(this.value)) {
      throw new TypeError(
        `The ${this.noun} cannot have any special characters in it`
      );
    }
  }

  // Validates if a string is between the length 1 and max
  meetsLength(max: number) {
    // Say if max was 32 and value.length was also 32, it would be doing the comparison 0 < 32, which passes.
    // If the value's length was less than one, you end up doing the comparison NaN < 32, which returns false.
    // If value.length is > 32 (say it's 33), then you end up doing 33 < 32, which is false.
    // That's how this neat comparison trick works.
    if (max % this.value.length < max) {
      throw new TypeError(
        `The ${this.noun} must be between 1 and 32 characters long`
      );
    }
  }

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
