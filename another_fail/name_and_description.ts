// This is a documentation type, it doesn't actually do anything.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ExtensionOfThis = any;

export interface NameAndDescription<Name extends string> {
  readonly name: Name;
  readonly description: string;

  setName(name: string): ExtensionOfThis;
  setDescription(name: string): this;
}
