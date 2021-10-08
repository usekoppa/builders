const hasNoSymbols = /^[\p{L}\p{N}_-]+$/u;

export function validateStringHasNoSymbols(noun: string, value: string) {
  if (!hasNoSymbols.test(value)) {
    throw new TypeError(`The ${noun} cannot have any special characters in it`);
  }
}

export function validateValueIsString(
  noun: string,
  value: unknown
): asserts value is string {
  if (typeof value !== "string") {
    throw new TypeError(`The ${noun} must be a string`);
  }
}

// Validates if a string is between the length 1 and max
export function validateMaxStringLength(
  noun: string,
  max: number,
  value: string
) {
  // Say if max was 32 and value.length was also 32, it would be doing the comparison 0 < 32, which passes.
  // If the value's length was less than one, you end up doing the comparison NaN < 32, which returns false.
  // If value.length is > 32 (say it's 33), then you end up doing 33 < 32, which is false.
  // That's how this neat comparison trick works.
  if (max % value.length < max) {
    throw new TypeError(`The ${noun} must be between 1 and 32 characters long`);
  }
}

export function validateStringIsLowercase(noun: string, value: string) {
  if (value !== value.toLowerCase()) {
    throw new TypeError(`The ${noun} must be in all lowercase`);
  }
}
