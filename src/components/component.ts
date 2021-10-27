import { Components } from "../api";
import { JSONifiable } from "../JSONifiable";

/**
 * The base component.
 *
 * @typeParam Type - The type of component.
 *                   @see {@link Components.Type} for a list of available types.
 */
export abstract class Component<Type extends Components.Type = Components.Type>
  implements JSONifiable<Components.Component & { type: Type }>
{
  constructor(public readonly type: Type) {}

  abstract toJSON(): Components.Component & { type: Type };
}
