import { Commands } from "../../api";

import { ContextMenu } from "./context_menu";

/**
 * A user context menu.
 */
export class UserContextMenu extends ContextMenu<Commands.Type.UserContextMenu> {
  constructor() {
    super(Commands.Type.UserContextMenu);
  }
}
