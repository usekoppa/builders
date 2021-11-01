import { Interactions } from "./api";

const client = new Client();

client.commands.create({
  name: "ban",
  usage: [
    {
      name: "User",
      value: "user",
      type: "user",
      required: true,
    },
    {
      name: "reason",
      type: "string",
    },
  ],
  pipeline: {
    inhibitor: req =>
      true /* returning a falsey value will terminate execution, return a response to respond with it */,
    executor: req => {
      const res = new Response(req);

      res
        .setContent()
        .setAsEphemeral(true)
        .addEmbed(emb =>
          emb.setTitle(`Are you sure you want to ban ${req.args.user.tag()}?`)
        )
        .addButton("response", true, btn =>
          btn.setLabel("Continue").setID("continue")
        )
        .addButton("response", false, btn =>
          btn.setLabel("Cancel").setID("cancel")
        )
        .nextActionRow();

      res.removeButton();

      client.sendResponse(res);

      const buttonReq = await res.waitForButtonRequest();
      if (buttonReq.args.response) {
        //client.guilds.bans.create(req, req.args.user);
        //client.guilds.channels.create("guildID", { ...channelPayload });
        //client.channels.messages.create("channelID", { ...messagePayload })
        //client.channels.threads.post();
        // client.guilds.cache gets Map<guildID, cachedGuild>
        // clients.guilds.bans.cache gets Map<guildID, bansCache>
        // cachedGuild.bans gets bansCache.
      }

      const buttonRes = new Response(buttonReq);
      buttonRes.buttons
        .get("response")
        .setArgumentID("not_response")
        .forEach(btn => btn.setDisabled())
        .setDisabled();
      // buttonRes.clear(); // Empties the response from the previous response's contents like the embeds n stuff.

      client.sendResponse(res);
    },
  },
});

type ResponseArgumentsPropertyValue<
  Name extends keyof Arguments,
  Arguments extends ResponseArguments
> = Arguments[Name] extends {
  [name: string]: infer Pieces;
}
  ? Pieces
  : never;

interface ResponseArguments {
  [name: string]: {
    [name: string]: unknown;
  };
}

type ArgumentValues<Arguments extends ResponseArguments> = {
  [Key in keyof Arguments]: ResponseArgumentsPropertyValue<Key, Arguments>;
};

declare const a: ResponseArgumentsPropertyValue<
  "a",
  { a: { value: "allah"; something: "allahs" } }
>;

declare const b: ArgumentValues<{
  a: { value: "allah"; pieces: { something: "allah" } };
}>;

class Request {
  constructor(public readonly interaction: Interactions.Incoming.Interaction) {}
}

class Response<Arguments extends ResponseArguments = {}> {
  components?:
  constructor(public readonly request: Request) {}
}
