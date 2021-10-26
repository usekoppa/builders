/**
 * An interface that can be turned into a JSON representation of itself
 *
 * @typeParam APIData - The JSON representation of the implementer.
 */
export interface JSONifiable<APIData> {
  /**
   * Produces a plain object that functions as
   * a JSON representation of the current object.
   */
  toJSON(): APIData;
}
