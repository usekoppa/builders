# Discord Interactions and Commands Framework (WIP)

An extremely powerful, library agnostic, interactions framework.

__⚠ The quick guide is subject to change, and demonstrates WIP and conceptual functionality.__

# Table of Contents

* [Quick guide](#quick-guide)
   * [Creating the client](#creating-the-client)
   * [Adding a command](#adding-a-command)
   * [Syncing the commands](#syncing-the-commands)
   * [Responding to interactions](#responding-to-interactions)
   * [Using the included API types](#using-the-included-api-types)
* [Inspirations](#inspirations)

## Quick guide

### Creating the client

```ts
import { Client} from "@koppa/framework";

const clientId = "¯\_(ツ)_/¯";
const clientSecret = "¯\_(ツ)_/¯";

const port = 3000;

const client = new Client(clientId, clientSecret, { disallowedMentions: [] });
```

### Adding a command

```ts
import { Command } from "@koppa/framework";

client.addCommand(cmd =>
  cmd
    .setName("ping")
    .setDescription("Ping's a server of your choice")
    .addStringOption(opt =>
      opt.setName("ip").setDescription("The selected server").setRequired(true)
    )
    .addIntegerOption(
      opt =>
        opt
          .setName("requests")
          .setDescription("The amount of requests to send")
          .addChoice("Ten", 10)
          .addChoice("Fifty", 50)
          .addChoice("One Hundred", 100)
      //  .setDefault(100), you can also have a default value,
      //  this means that the resulting type of this option will not have undefined in its type union"
    )
    .setExecutor(req => {
      // ip is type string
      // requests is 10 | 50 | 100 | undefined
      const { ip, requests } = req.args;
      // Some logic here.
      // Now you have two options on how to respond to this,
      // you can handle it with your favourite API library like discord.js or eris
      // (if you enabled the option) OR

      return new Response(req)
        .addEmbed(embed => embed.setTitle("Something"))
        .createSharedExecutor("name of the executor", (req, res, current) => {
          // res is the current response object, you can use it or create a new response,
          // in the case that you use it, you can change it as you please, the response will
          // be diffed and the old response will be edited.
          // current is the current component.
          return res
            .setEmbeds(res.embeds.reduce(/* do something here */))
            .disable(current) // disables the current component.
            .remove(current) // removes the current component
            .removeCurrentComponent(); // an alias if you do not wish to use the current object

          // OR

          return new Response(req)
            .deletePreviousResponses()
            .setEmbed(something);
        })
        .addActionRow(row =>
          row.addSelectMenu(menu =>
            menu
              .setCustomId("thing_select_menu")
              .addOption(opt => opt.setLabel("a thing").setCustomId("a thing"))
              // Select menus can not use shared executors,
              // due to a lack of compatibility with type information.
              .setExecutor(/* ... */)
          )
        )
        .addActionRow(row =>
          row
            .addButton(btn => btn.setLabel("A thing").setCustomId("a_thing"))
            // Buttons can use a shared executor or a normal executor
            .useSharedExecutor("name of executor")
        );
    })
);

// You can also just create a command using the class.
const command = new Command()
  .setName("something")
  .setDescription("something else");

client.addCommand(command);

```

### Syncing the commands

```ts


// Syncs (edits, removes, creates) application commands.
//
// client#sync(defer = false)
// Defer will make it so that this process happens in the background.
// More options will be added soon to have more fine tuned control over which aspects
// of syncing can be deferred as a "background" task.
client.sync();
```

### Responding to interactions

```ts
import { createServer } from "node:http";

// There are two ways to use the framework.

// First via HTTP:
const server = createServer(client.handleHTTPRequests)

// You'd probably start the server in this manner:
client.sync().then(() => server.listen(port))

// or by just passing an interaction object:
declare const interaction: API.Interactions.Incoming.Interaction;
client.handleInteraction(interaction);
```

### Using the included API types

```ts
// The API module included with the framework provides easier to use typings than discord-api-types,
// however, it does use some of its typings under the hood (although, they're generally modified to be way easier to use!)
// Examples are:

// This corresponds to https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-structure
// (but only the data relevant to ChatInput application commands (AKA slash commands))
declare const chatInputCommand = API.Commands.ChatInput.Outgoing.Command;

// This corresponds with an option with choices type,
// https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure
declare const optionWithChoices = API.Commands.ChatInput.Options.Outgoing.Choice;
```


## Inspirations
 - [Discord API Types](https://github.com/discordjs/discord-api-types)
 - [Discord.js builders](https://github.com/discordjs/builders)
