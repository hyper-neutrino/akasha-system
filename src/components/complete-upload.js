import { ButtonStyle, ComponentType } from "discord.js";
import fetch from "node-fetch";
import config from "../config.js";
import db from "../db.js";
import autoinc from "../lib/autoinc.js";
import { UPLOAD } from "../lib/emoji.js";
import { upload_cache_save } from "../lib/upload-cache.js";

const ID_LIST = /(^$|^\s*(\d{17,20}\s+)*\d{17,20}\s*$)/;

export default async function (modal, id, anon) {
    await modal.deferReply({ ephemeral: true });
    const data = {};

    for (const key of ["ids", "servers", "link", "title", "description"]) {
        data[key] = modal.fields.getTextInputValue(key);
    }

    const retry = (title, message) => {
        const key = upload_cache_save(data);

        return {
            embeds: [
                {
                    title,
                    description: message,
                    color: 0x2d3136,
                },
            ],
            components: [
                {
                    type: ComponentType.ActionRow,
                    components: [
                        {
                            type: ComponentType.Button,
                            style: ButtonStyle.Secondary,
                            custom_id: `::upload:${id}:${anon}:${key}`,
                            emoji: UPLOAD,
                            label: "Try Again",
                        },
                    ],
                },
            ],
        };
    };

    if (!data.ids.match(ID_LIST) || !data.servers.match(ID_LIST)) {
        return retry(
            "**Invalid ID List**",
            "The ID lists should consist of whitespace-separated user/server IDs. You have 15 minutes to click below to try again."
        );
    }

    data.users = data.ids
        .trim()
        .split(/\s+/)
        .filter((x) => x);

    data.servers = data.servers
        .trim()
        .split(/\s+/)
        .filter((x) => x);

    let users;

    try {
        users = await Promise.all(
            data.users.map((x) => modal.client.users.fetch(x))
        );
    } catch {
        return retry(
            "**Invalid ID List**",
            "One or more user IDs did not correspond to a valid Discord user. You have 15 minutes to click below to try again."
        );
    }

    try {
        await fetch(data.link);
    } catch {
        return retry(
            "**Invalid URL**",
            "The document link appears to be invalid."
        );
    }

    if (id == "0") data.uploader = modal.user.id;
    if (anon) data.anon = anon == "a";

    data.updated = new Date();

    if (id == "0") {
        data.id = await autoinc("documents");
        await db("documents").insertOne(data);
    } else {
        await db("documents").findOneAndUpdate(
            { id: parseInt(id) },
            { $set: data }
        );
    }

    if (id == "0") {
        (async () => {
            try {
                const channel = await modal.client.channels.fetch(
                    config.business
                );

                await channel.send({
                    content:
                        "**Document uploaded. Check below for information.**\n_ _\n_ _",
                    embeds: [
                        {
                            title: `**Document ${data.id}**: ${data.title}`.substring(
                                0,
                                256
                            ),
                            description: data.description,
                            color: 0x2d3136,
                            fields: [
                                ...(users.length > 0
                                    ? [
                                          {
                                              name: "Involved User(s)",
                                              value: users
                                                  .slice(0, 40)
                                                  .join("\n"),
                                          },
                                      ]
                                    : []),
                                ...(data.servers.length > 0
                                    ? [
                                          {
                                              name: "Involved Server(s)",
                                              value: data.servers
                                                  .slice(0, 40)
                                                  .join("\n"),
                                          },
                                      ]
                                    : []),
                                {
                                    name: "Uploader",
                                    value: data.anon
                                        ? "Anonymous"
                                        : `${modal.user}`,
                                },
                            ],
                        },
                    ],
                    components: [
                        {
                            type: ComponentType.ActionRow,
                            components: [
                                {
                                    type: ComponentType.Button,
                                    style: ButtonStyle.Link,
                                    label: "View Document",
                                    url: data.link,
                                },
                            ],
                        },
                    ],
                });
            } catch {}
        })();
    }

    return {
        embeds: [
            {
                title: `**Document ${id == "0" ? "Uploaded" : "Updated"}!**`,
                description: `Your document was ${
                    id == "0" ? "uploaded" : "updated"
                }${id == "0" && data.anon ? " anonymously" : ""} with ID \`${
                    data.id ?? id
                }\`. You, and observers, can use **/akasha doc edit** with the ID to manage it.`,
                color: 0x2d3136,
            },
        ],
    };
}
