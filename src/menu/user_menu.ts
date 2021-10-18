import { Commands } from "../api/commands";

import { BaseMenu } from "./base_menu";

export class UserMenu extends BaseMenu<Commands.Type.UserContextMenu> {
  constructor() {
    super(Commands.Type.UserContextMenu);
  }
}
