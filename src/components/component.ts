import { Components } from "../api/components";
import { JSONifiable } from "../JSONifiable";

/**
 * The base component.
 */
export abstract class Component<Type extends Components.Type = Components.Type>
  implements JSONifiable<Components.Component & { type: Type }>
{
  constructor(public readonly type: Type) {}

  abstract toJSON(): Components.Component & { type: Type };
}
