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
import { DELETE } from "../lib/emoji.js";

export const command = {
    type: ApplicationCommandType.ChatInput,
    name: "akasha",
    description: "akasha system commands",
    dm_permission: false,
    options: [
        {
            type: ApplicationCommandOptionType.SubcommandGroup,
            name: "user",
            description: "manage a user's stored information",
            options: [
                {
                    type: ApplicationCommandOptionType.Subcommand,
                    name: "edit",
                    description: "edit a user's info embed",
                    options: [
                        {
                            type: ApplicationCommandOptionType.User,
                            name: "user",
                            description: "the user",
                            required: true,
                        },
                    ],
                },
            ],
        },
        {
            type: ApplicationCommandOptionType.SubcommandGroup,
            name: "server",
            description: "manage a server's stored information",
            options: [
                {
                    type: ApplicationCommandOptionType.Subcommand,
                    name: "edit",
                    description: "edit a server's info embed",
                    options: [
                        {
                            type: ApplicationCommandOptionType.String,
                            name: "id",
                            description: "the server's ID",
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
        {
            type: ApplicationCommandOptionType.SubcommandGroup,
            name: "alt",
            description: "manage linked alts",
            options: [
                {
                    type: ApplicationCommandOptionType.Subcommand,
                    name: "link",
                    description:
                        "link an account as an alt of the main account",
                    options: [
                        {
                            type: ApplicationCommandOptionType.User,
                            name: "main",
                            description: "the main account",
                            required: true,
                        },
                        {
                            type: ApplicationCommandOptionType.User,
                            name: "alt",
                            description: "the alt account",
                            required: true,
                        },
                    ],
                },
                {
                    type: ApplicationCommandOptionType.Subcommand,
                    name: "unlink",
                    description:
                        "unlink an account as an alt of the main account",
                    options: [
                        {
                            type: ApplicationCommandOptionType.User,
                            name: "main",
                            description: "the main account",
                            required: true,
                        },
                        {
                            type: ApplicationCommandOptionType.User,
                            name: "alt",
                            description: "the alt account",
                            required: true,
                        },
                    ],
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

    if (subgroup == "user") {
        if (sub == "edit") {
            if (!(await api_is_observer(cmd.user.id))) {
                return {
                    embeds: [
                        {
                            title: "**Permission Denied**",
                            description:
                                "Only observers may edit this information.",
                            color: Colors.Red,
                        },
                    ],
                    ephemeral: true,
                };
            }

            const user = cmd.options.getUser("user");

            const entry = await db("users").findOne({ user: user.id });

            cmd.showModal({
                custom_id: `::edit-user:${user.id}`,
                title: "Edit User Information",
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
    } else if (subgroup == "server") {
        if (sub == "edit") {
            if (!(await api_is_observer(cmd.user.id))) {
                return {
                    embeds: [
                        {
                            title: "**Permission Denied**",
                            description:
                                "Only observers may edit this information.",
                            color: Colors.Red,
                        },
                    ],
                    ephemeral: true,
                };
            }

            const id = cmd.options.getString("id");

            const entry = await db("servers").findOne({ id });

            cmd.showModal({
                custom_id: `::edit-server:${id}`,
                title: "Edit Server Information",
                components: [
                    {
                        type: ComponentType.ActionRow,
                        components: [
                            {
                                type: ComponentType.TextInput,
                                label: "Body (will be shown in server info)",
                                style: TextInputStyle.Paragraph,
                                custom_id: "body",
                                required: false,
                                max_length: 2048,
                                value: entry?.body,
                            },
                        ],
                    },
                    {
                        type: ComponentType.ActionRow,
                        components: [
                            {
                                type: ComponentType.TextInput,
                                label: "Important Affiliations (e.g. TCN, KNET, etc.)",
                                style: TextInputStyle.Short,
                                custom_id: "faction",
                                required: false,
                                max_length: 32,
                                value: entry?.faction,
                            },
                        ],
                    },
                    {
                        type: ComponentType.ActionRow,
                        components: [
                            {
                                type: ComponentType.TextInput,
                                label: "Canonical Abbreviation (e.g. TCN)",
                                style: TextInputStyle.Paragraph,
                                custom_id: "abbr",
                                required: false,
                                max_length: 8,
                                value: entry?.abbr,
                            },
                        ],
                    },
                ],
            });
        }
    } else if (subgroup == "doc") {
        if (sub == "delete") {
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

            if (
                cmd.user.id != doc.uploader &&
                !(await api_is_observer(cmd.user.id))
            ) {
                return {
                    embeds: [
                        {
                            title: "**Permission Denied**",
                            description:
                                "Only the uploader and observers can delete documents.",
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
                                        }\n\nUsers: ${doc.users.join(
                                            ", "
                                        )}\nUploaded by ${doc.uploader}.`
                                )
                                .join("\n\n"),
                            "utf-8"
                        ),
                    },
                ],
                ephemeral: true,
            };
        }
    } else if (subgroup == "alt") {
        await cmd.deferReply({ ephemeral: true });

        if (!(await api_is_observer(cmd.user.id))) {
            return {
                embeds: [
                    {
                        title: "**Permission Denied**",
                        description:
                            "Only observers may edit this information.",
                        color: Colors.Red,
                    },
                ],
            };
        }

        const main = cmd.options.getUser("main").id;
        const alt = cmd.options.getUser("alt").id;

        if (sub == "link") {
            if (
                (await db("alts").countDocuments({
                    $or: [{ main: alt }, { alt }],
                })) > 0
            ) {
                return {
                    embeds: [
                        {
                            title: "**Already Linked**",
                            description:
                                "The provided alt account is already either an alt or a main of an alt account relationship.",
                            color: Colors.Red,
                        },
                    ],
                };
            }

            await db("alts").insertOne({ main, alt });

            return {
                embeds: [
                    {
                        title: "**Linked**",
                        description: `<@${alt}> is now designated as the alt of <@${main}>.`,
                        color: 0x2d3136,
                    },
                ],
            };
        } else if (sub == "unlink") {
            if (!(await db("alts").findOne({ main, alt }))) {
                return {
                    embeds: [
                        {
                            title: "**Not Linked**",
                            description:
                                "The provided alt-main relationship does not exist.",
                            color: Colors.Red,
                        },
                    ],
                };
            }

            await db("alts").findOneAndDelete({ main, alt });

            return {
                embeds: [
                    {
                        title: "**Unlinked**",
                        description: `<@${alt}> is no longer designated as the alt of <@${main}>.`,
                        color: 0x2d3136,
                    },
                ],
            };
        }
    }
}
