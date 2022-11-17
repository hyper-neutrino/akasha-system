import { ButtonStyle, Colors, ComponentType } from "discord.js";
import db from "../db.js";
import { api_get_server, api_is_observer } from "../lib/api.js";
import {
    FIRST_PAGE,
    LAST_PAGE,
    NEXT_PAGE,
    NUMBERS,
    PREV_PAGE,
} from "../lib/emoji.js";

export default async function (cmd, mode, id, page) {
    if (page) await cmd.deferUpdate();
    else await cmd.deferReply({ ephemeral: true });

    page = parseInt(page || "0");

    const documents = await db("documents")
        .find(
            mode == "about"
                ? {
                      $or: [
                          { users: { $in: [id] } },
                          { servers: { $in: [id] } },
                      ],
                  }
                : mode == "uploaded"
                ? {
                      uploader: id,
                      ...(cmd.user.id == id ||
                      (await api_is_observer(cmd.user.id))
                          ? {}
                          : { anon: false }),
                  }
                : mode == "authored"
                ? { authors: { $in: [id] } }
                : {}
        )
        .toArray();

    if (documents.length == 0) {
        return {
            embeds: [
                {
                    title: "**No Documents Found**",
                    description:
                        "No documents were found for this user/server.",
                    color: Colors.Red,
                },
            ],
        };
    }

    documents.sort((x, y) => y.id - x.id);

    const pages = Math.ceil(documents.length / 5);
    page = Math.min(page, pages - 1);

    const items = documents.slice(page * 5, page * 5 + 5);

    let name;

    try {
        name = (await cmd.client.users.fetch(id)).tag;
    } catch {
        try {
            name = (await api_get_server(id)).name;
        } catch {
            name = `[${id}]`;
        }
    }

    return {
        embeds: [
            {
                title: `**Documents for ${name}**`,
                color: 0x2d3136,
                fields: items.map((doc) => ({
                    name: doc.title,
                    value: `${doc.description}\n\nUploaded ${
                        doc.anon ? "anonymously" : `by <@${doc.uploader}>`
                    }`,
                })),
                footer:
                    pages > 1 ? { text: `Page ${page + 1} / ${pages}` } : {},
            },
        ],
        components: [
            {
                type: ComponentType.ActionRow,
                components: items.map((doc, index) => ({
                    type: ComponentType.Button,
                    style: ButtonStyle.Link,
                    emoji: NUMBERS[index],
                    url: doc.link,
                })),
            },
            ...(pages > 1
                ? [
                      {
                          type: ComponentType.ActionRow,
                          components: [
                              {
                                  type: ComponentType.Button,
                                  style: ButtonStyle.Secondary,
                                  custom_id: `::documents:${id}:0:a`,
                                  emoji: FIRST_PAGE,
                              },
                              {
                                  type: ComponentType.Button,
                                  style: ButtonStyle.Secondary,
                                  custom_id: `::documents:${id}:${
                                      (page + pages - 1) % pages
                                  }:b`,
                                  emoji: PREV_PAGE,
                              },
                              {
                                  type: ComponentType.Button,
                                  style: ButtonStyle.Secondary,
                                  custom_id: `::documents:${id}:${
                                      (page + 1) % pages
                                  }:c`,
                                  emoji: NEXT_PAGE,
                              },
                              {
                                  type: ComponentType.Button,
                                  style: ButtonStyle.Secondary,
                                  custom_id: `::documents:${id}:${pages - 1}:d`,
                                  emoji: LAST_PAGE,
                              },
                          ],
                      },
                  ]
                : []),
        ],
    };
}
