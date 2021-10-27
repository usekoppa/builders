import { Components } from "../../api";

import { Button } from "./button";

/**
 * A button component that is a link.
 */
export type LinkButton = Omit<
  Button<Components.Buttons.Style.Link>,
  "setCustomId" | "customId"
>;
