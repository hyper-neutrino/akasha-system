import { ButtonStyle, ComponentType } from "discord.js";
import db from "../db.js";
import { api_get_server, api_is_council_member } from "./api.js";
import { DOCUMENT } from "./emoji.js";

export default async function (ctx, id) {
    const entry = await db("servers").findOne({ id });

    let api_server;

    try {
        api_server = await api_get_server(id);
    } catch {}

    let description = "";

    if (api_server) {
        description += "This server is in the TCN.\n\n";

        if (api_server.owner) {
            description += `Owner: <@${api_server.owner}>\n`;
        }

        if (api_server.advisor) {
            description += `Advisor: <@${api_server.advisor}>\n`;
        }

        description += "\n";
    }

    if (entry?.body) description += entry.body;

    const documents = (await api_is_council_member(ctx.user.id))
        ? await db("documents").countDocuments({ servers: { $in: [id] } })
        : null;

    return {
        embeds: [
            {
                title: `**Server Info** for ${api_server?.name ?? id}`,
                description,
                color: 0x2d3136,
                fields: [
                    ...(entry?.faction
                        ? [
                              {
                                  name: "**Notable Affiliations**",
                                  value: entry.faction,
                              },
                          ]
                        : []),
                    ...(entry?.abbr
                        ? [
                              {
                                  name: "**Canonical Abbreviation**",
                                  value: `**${entry.abbr}** is this server's canonical abbreviation. It is **not** official or exclusive, but simply most commonly what is used to refer to this server and is understood to mean this server, at least within the TCN.`,
                              },
                          ]
                        : []),
                    {
                        name: "**Documents**",
                        value:
                            documents !== null
                                ? `This server has ${documents} document${
                                      documents == 1 ? "" : "s"
                                  } written about it. Use the **Upload A Document** option in an Akasha Terminal to add documents.`
                                : "This is privileged information which you do not have permission to access.",
                    },
                ],
            },
        ],
        components: documents
            ? [
                  {
                      type: ComponentType.ActionRow,
                      components: [
                          {
                              type: ComponentType.Button,
                              style: ButtonStyle.Secondary,
                              custom_id: `::documents:${id}`,
                              emoji: DOCUMENT,
                              label: "View Documents",
                          },
                      ],
                  },
              ]
            : [],
    };
}
