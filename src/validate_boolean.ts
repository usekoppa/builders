export function validateBoolean(
  noun: string,
  value: unknown
): asserts value is boolean {
  if (typeof value !== "boolean") {
    throw new Error(`Expected a boolean for ${noun}`);
  }
}
