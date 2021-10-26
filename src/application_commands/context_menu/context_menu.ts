import { Commands } from "../../api";
import { JSONifiable } from "../../JSONifiable";
import { Name } from "../../name";
import { ApplicationCommand } from "../application_command";

/**
 * A context menu of any type.
 */
export abstract class ContextMenu<Type extends Commands.ContextMenuType>
  extends ApplicationCommand
  implements
    Name,
    JSONifiable<Commands.ContextMenu.Outgoing.ContextMenu & { type: Type }>
{
  protected constructor(public readonly type: Type) {
    super();
  }

  toJSON() {
    const data: Record<string, unknown> = {
      type: this.type,
      ...super._toJSON(),
    };

    return data as Commands.ContextMenu.Outgoing.ContextMenu & { type: Type };
  }
}
