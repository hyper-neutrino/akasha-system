import {
    ApplicationCommandOptionType,
    ApplicationCommandType,
    ButtonStyle,
    Colors,
    ComponentType,
    TextInputStyle,
} from "discord.js";
import db from "../db.js";
import { api_is_observer } from "../lib/api.js";
import { DELETE, EDIT_DOCUMENT } from "../lib/emoji.js";
import { upload_cache_save } from "../lib/upload-cache.js";

export const command = {
    type: ApplicationCommandType.ChatInput,
    name: "akasha",
    description: "akasha system commands",
    dm_permission: false,
    options: [
        {
            type: ApplicationCommandOptionType.SubcommandGroup,
            name: "bot",
            description: "manage a bot's stored information",
            options: [
                {
                    type: ApplicationCommandOptionType.Subcommand,
                    name: "edit",
                    description: "edit a bot's info embed",
                    options: [
                        {
                            type: ApplicationCommandOptionType.User,
                            name: "bot",
                            description: "the bot",
                            required: true,
                        },
                    ],
                },
            ],
        },
        {
            type: ApplicationCommandOptionType.SubcommandGroup,
            name: "doc",
            description: "manage a document",
            options: [
                {
                    type: ApplicationCommandOptionType.Subcommand,
                    name: "edit",
                    description: "edit a document",
                    options: [
                        {
                            type: ApplicationCommandOptionType.Integer,
                            name: "id",
                            description: "the document's ID",
                            required: true,
                        },
                        {
                            type: ApplicationCommandOptionType.Boolean,
                            name: "anon",
                            description:
                                "set this to overwrite the doc's anonymity",
                            required: false,
                        },
                    ],
                },
                {
                    type: ApplicationCommandOptionType.Subcommand,
                    name: "delete",
                    description: "take down a document",
                    options: [
                        {
                            type: ApplicationCommandOptionType.Integer,
                            name: "id",
                            description: "the document's ID",
                            required: true,
                        },
                    ],
                },
                {
                    type: ApplicationCommandOptionType.Subcommand,
                    name: "dump",
                    description: "dump a full list of all documents",
                },
            ],
        },
    ],
};

export async function execute(cmd) {
    let subgroup;

    try {
        subgroup = cmd.options.getSubcommandGroup();
    } catch {}

    const sub = cmd.options.getSubcommand();

    if (subgroup == "bot") {
        if (sub == "edit") {
            const bot = cmd.options.getUser("bot");

            if (!bot.bot) {
                return {
                    embeds: [
                        {
                            title: "**That is not a bot.**",
                            description:
                                "You can only edit this information for bot accounts.",
                            color: Colors.Red,
                        },
                    ],
                    ephemeral: true,
                };
            }

            const entry = await db("bots").findOne({ user: bot.id });

            cmd.showModal({
                custom_id: `::edit-bot:${bot.id}`,
                title: "Edit Bot Information",
                components: [
                    {
                        type: ComponentType.ActionRow,
                        components: [
                            {
                                type: ComponentType.TextInput,
                                label: "Body (will be shown in user info)",
                                style: TextInputStyle.Paragraph,
                                custom_id: "body",
                                required: true,
                                max_length: 2048,
                                value: entry?.body,
                            },
                        ],
                    },
                ],
            });
        }
    } else if (subgroup == "doc") {
        if (sub == "edit") {
            await cmd.deferReply({ ephemeral: true });

            const doc = await db("documents").findOne({
                id: cmd.options.getInteger("id"),
            });

            if (!doc) {
                return {
                    embeds: [
                        {
                            title: "**Document Not Found**",
                            description: "No document was found with this ID.",
                            color: Colors.Red,
                        },
                    ],
                };
            }

            const anon = cmd.options.getBoolean("anon");

            if (anon === false && doc.anon && cmd.user.id != doc.uploader) {
                return {
                    embeds: [
                        {
                            title: "**Cannot Remove Anonymity**",
                            description:
                                "You cannot remove the anonymity for a document that you did not upload.",
                            color: Colors.Red,
                        },
                    ],
                };
            }

            if (
                cmd.user.id != doc.uploader &&
                !(await api_is_observer(cmd.user.id))
            ) {
                return {
                    embeds: [
                        {
                            title: "**Permission Denied**",
                            description:
                                "Only the uploader and observers can edit documents.",
                            color: Colors.Red,
                        },
                    ],
                };
            }

            doc.ids = doc.users.join(" ");
            const key = upload_cache_save(doc);

            return {
                embeds: [
                    {
                        title: "**Editing A Document**",
                        description: `You are about to edit document #${doc.id} titled __${doc.title}__. If you do not own this document, please make sure you do not change the intent or drastically alter any information without permission from the uploader, unless you wrote the linked document itself. Click below to open the editor.\n\nYou have 15 minutes.`,
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
                                custom_id: `::upload:${doc.id}:${
                                    anon == true
                                        ? "a"
                                        : anon == false
                                        ? "i"
                                        : ""
                                }:${key}`,
                                emoji: EDIT_DOCUMENT,
                            },
                        ],
                    },
                ],
            };
        } else if (sub == "delete") {
            await cmd.deferReply({ ephemeral: true });

            const doc = await db("documents").findOne({
                id: cmd.options.getInteger("id"),
            });

            if (!doc) {
                return {
                    embeds: [
                        {
                            title: "**Document Not Found**",
                            description: "No document was found with this ID.",
                            color: Colors.Red,
                        },
                    ],
                };
            }

            return {
                embeds: [
                    {
                        title: "**Confirm Deleting Document?**",
                        description: `Please confirm that you are **absolutely sure** you would like to take down document #${doc.id} titled __${doc.title}__.\n\n**This action cannot be undone.**`,
                        color: 0x2d3136,
                    },
                ],
                components: [
                    {
                        type: ComponentType.ActionRow,
                        components: [
                            {
                                type: ComponentType.Button,
                                style: ButtonStyle.Danger,
                                custom_id: `::delete:${doc.id}`,
                                emoji: DELETE,
                            },
                        ],
                    },
                ],
            };
        } else if (sub == "dump") {
            return {
                files: [
                    {
                        name: "docs.md",
                        attachment: Buffer.from(
                            (await db("documents").find({}).toArray())
                                .sort((x, y) => y.updated - x.updated)
                                .map(
                                    (doc) =>
                                        `# Document ${doc.id} - ${
                                            doc.title
                                        }\n> ${doc.link}\n${
                                            doc.description
                                        }\n\nUsers: ${doc.users.join(", ")}\nUploaded ${
                                            doc.anon ? "anonymously" : `by ${doc.uploader}`
                                        }.`
                                )
                                .join("\n\n"),
                            "utf-8"
                        ),
                    },
                ],
                ephemeral: true,
            };
        }
    }
}
