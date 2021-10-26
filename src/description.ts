import { StringValidator } from "./string_validator";

export interface Description {
  readonly description: string;

  setDescription(description: string): unknown;
}

export function validateDescription(description: unknown) {
  const validator = new StringValidator("description", description);
  validator.meetsLength(100);
}
