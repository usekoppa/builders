import { Commands } from "../api/commands";
import { JSONifiable } from "../JSONifiable";
import { validateName } from "../name_and_description";

export abstract class BaseMenu<Type extends Commands.ContextMenuType>
  implements
    JSONifiable<Commands.ContextMenu.Outgoing.ContextMenu & { type: Type }>
{
  readonly name!: string;

  protected constructor(public readonly type: Type) {}

  setName(name: string) {
    validateName("menu", name);
    Reflect.set(this, "name", name);
    return this;
  }

  toJSON() {
    validateName("menu", this.name);
    return {
      type: this.type,
      name: this.name,
    };
  }
}
