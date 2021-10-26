import { Commands } from "../../api";

import { BaseContextMenu } from "./base_context_menu";

export class UserContextMenu extends BaseContextMenu<Commands.Type.UserContextMenu> {
  constructor() {
    super(Commands.Type.UserContextMenu);
  }
}
