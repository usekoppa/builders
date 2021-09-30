export class NameAndDescription {
  readonly name!: string;
  readonly description!: string;

  setName(name: string) {
    Reflect.set(this, "name", name);
    return this;
  }

  setDescription(description: string) {
    Reflect.set(this, "description", description);
    return this;
  }
}
