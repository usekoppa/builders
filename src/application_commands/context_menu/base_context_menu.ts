import { Commands } from "../../api";
import { JSONifiable } from "../../JSONifiable";
import { Name, validateName } from "../../name";

export abstract class BaseContextMenu<Type extends Commands.ContextMenuType>
  implements
    Name,
    JSONifiable<Commands.ContextMenu.Outgoing.ContextMenu & { type: Type }>
{
  readonly name!: string;
  readonly defaultPermission?: boolean;

  protected constructor(public readonly type: Type) {}

  setName(name: string) {
    validateName(name);
    Reflect.set(this, "name", name);
    return this;
  }

  setDefaultPermission(defaultPermission: boolean) {
    Reflect.set(this, "defaultPermission", defaultPermission);
    return this;
  }

  toJSON() {
    validateName(this.name);
    const data: Record<string, unknown> = {
      type: this.type,
      name: this.name,
    };

    if (typeof this.defaultPermission !== "undefined") {
      data.default_permission = this.defaultPermission;
    }

    return data as Commands.ContextMenu.Outgoing.ContextMenu & { type: Type };
  }
}
