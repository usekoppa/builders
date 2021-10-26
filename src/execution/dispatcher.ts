import { Command } from "../application_commands";
import { DataButton, SelectMenu } from "../components";

interface Executables {
  components: {
    buttons: Map<string, DataButton>;
    selectMenus: Map<string, SelectMenu>;
  };
  commands: {
    chatInputCmds: Map<string, Command>;
    contextMenus: Map<string, ContextMe
  }

}
export class Dispatcher {}
