import { ButtonStyle, ComponentType } from "discord.js";
import fetch from "node-fetch";
import config from "../config.js";
import db from "../db.js";
import autoinc from "../lib/autoinc.js";
import { UPLOAD } from "../lib/emoji.js";
import { upload_cache_save } from "../lib/upload-cache.js";

export default async function (modal, id, anon) {
    await modal.deferReply({ ephemeral: true });
    const data = {};

    for (const key of ["ids", "link", "title", "description"]) {
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

    if (!data.ids.match(/\s*(\d+\s+)*\d+\s*/)) {
        return retry(
            "**Invalid ID List**",
            "The ID list should consist of whitespace-separated user IDs. You have 15 minutes to click below to try again."
        );
    }

    data.users = data.ids.trim().split(/\s+/);
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
                    files: [
                        {
                            name: "data.md",
                            attachment: Buffer.from(
                                `# Document ${data.id}\n\n**${
                                    data.title
                                }** uploaded ${
                                    data.anon
                                        ? "anonymously"
                                        : `by ${modal.user.tag}`
                                }. This document involves the following user(s):\n${users
                                    .map(
                                        (user) =>
                                            `- ${user.tag} (\`${user.id}\`)`
                                    )
                                    .join("\n")}\n\n## Description\n\n${
                                    data.description
                                }`,
                                "utf-8"
                            ),
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
