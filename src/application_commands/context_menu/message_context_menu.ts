import { Commands } from "../../api";

import { ContextMenu } from "./context_menu";

/**
 * A message context menu.
 */
export class MessageContextMenu extends ContextMenu<Commands.Type.MessageContextMenu> {
  constructor() {
    super(Commands.Type.MessageContextMenu);
  }
}
