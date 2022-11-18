import { ButtonStyle, ComponentType } from "discord.js";
import db from "../db.js";
import { english_list } from "../utils.js";
import { api_get_servers, api_get_user, api_is_council_member } from "./api.js";
import { DOCUMENT } from "./emoji.js";

export default async function (ctx, user) {
    const entry = await db("users").findOne({ user: user.id });

    if (user.bot) {
        if (entry) {
            return {
                embeds: [
                    {
                        title: `**Bot Info** for ${user.tag}`,
                        description: entry.body,
                        color: 0x2d3136,
                        footer: {
                            text: "Observers can use /akasha bot edit to edit the displayed information.",
                        },
                    },
                ],
            };
        } else {
            return {
                embeds: [
                    {
                        title: `**Bot Info** for ${user.tag}`,
                        description:
                            "This bot is not recognized by the Akasha System. Observers can use **/akasha bot edit** to add information to display here instead.",
                        color: 0x2d3136,
                    },
                ],
            };
        }
    }

    let api_user;

    try {
        api_user = await api_get_user(user.id);
    } catch {}

    let description = "";

    if (!api_user) {
        description += "(This user could not be found in the TCN API.)\n\n";
    } else {
        if (api_user.roles.includes("observer")) {
            description += "This user is a TCN observer.\n\n";
        }

        const staffs = [];

        for (const guild of await api_get_servers()) {
            if (guild.owner == user.id) {
                description += `Server Owner of **${guild.name}**.\n`;
            } else if (guild.advisor == user.id) {
                description += `Council Advisor of **${guild.name}**.\n`;
            } else if (api_user.guilds?.includes(guild.id)) {
                staffs.push(`**${guild.name}**`);
            }
        }

        if (staffs.length) {
            staffs.sort();
            description += `${
                description ? "Also s" : "S"
            }taff in ${english_list(staffs)}.`;
        }

        if (entry) {
            description += `\n\n${entry.body}`;
        }
    }

    const council = await api_is_council_member(ctx.user.id);

    const documents = council
        ? await db("documents").countDocuments({ users: { $in: [user.id] } })
        : null;

    const uploaded = council
        ? await db("documents").countDocuments({ uploader: user.id })
        : null;

    const authored = council
        ? await db("documents").countDocuments({ authors: { $in: [user.id] } })
        : null;

    return {
        embeds: [
            {
                title: `**User Info** for ${user.tag}`,
                description,
                color: 0x2d3136,
                fields: [
                    {
                        name: "**Documents**",
                        value:
                            documents !== null
                                ? `This user has ${documents} document${
                                      documents == 1 ? "" : "s"
                                  } written about them, has uploaded ${uploaded} document${
                                      uploaded == 1 ? "" : "s"
                                  }, and has authored ${authored} document${
                                      authored == 1 ? "" : "s"
                                  }. Use the **Upload A Document** option in an Akasha Terminal to add documents.`
                                : "This is privileged information which you do not have permission to access.",
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
                        style: ButtonStyle.Secondary,
                        custom_id: `::documents:about:${user.id}`,
                        emoji: DOCUMENT,
                        label: "View Documents",
                        disabled: !documents,
                    },
                    {
                        type: ComponentType.Button,
                        style: ButtonStyle.Secondary,
                        custom_id: `::documents:uploaded:${user.id}`,
                        emoji: DOCUMENT,
                        label: "View Uploaded Documents",
                        disabled: !uploaded,
                    },
                    {
                        type: ComponentType.Button,
                        style: ButtonStyle.Secondary,
                        custom_id: `::documents:authored:${user.id}`,
                        emoji: DOCUMENT,
                        label: "View Authored Documents",
                        disabled: !authored,
                    },
                ],
            },
        ],
    };
}
