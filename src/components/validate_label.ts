import { StringValidator } from "../string_validator";

export function validateLabel(label: unknown): asserts label is string {
  const validator = new StringValidator("label", label);
  validator.meetsLength(80);
}
