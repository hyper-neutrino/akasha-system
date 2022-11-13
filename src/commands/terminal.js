import { ApplicationCommandType, ComponentType } from "discord.js";
import db from "../db.js";

export const command = {
    type: ApplicationCommandType.ChatInput,
    name: "terminal",
    description: "post an Akasha Terminal",
    dm_permission: false,
    default_member_permissions: "0",
};

export async function execute(cmd) {
    const entry = await db("times").findOne();
    const times = entry?.times ?? 0;

    await cmd.channel.send({
        embeds: [
            {
                title: "**Akasha Terminal**",
                description: `Welcome to the Akasha System, traveler. Select a category below or use **/akasha** to view all options.`,
                color: 0x2d3136,
                footer: {
                    text: `The Akasha System has been activated ${times} time${
                        times == 1 ? "" : "s"
                    }.`,
                },
            },
        ],
        components: [
            {
                type: ComponentType.ActionRow,
                components: [
                    {
                        type: ComponentType.StringSelect,
                        custom_id: "::terminal",
                        placeholder: "What would you like to know today?",
                        options: [
                            {
                                label: "Tour",
                                value: "tour",
                                emoji: "<:tour:1041125279843745792>",
                                description:
                                    "get a tour of HQ and the Akasha System",
                            },
                            {
                                label: "TCN HQ Directory",
                                value: "hq-directory",
                                emoji: "<:hq_directory:1041123361117450343>",
                                description:
                                    "HQ directory and navigation guide",
                            },
                            {
                                label: "TCN Resources Directory",
                                value: "tcn-directory",
                                emoji: "<:tcn_directory:1041125577870032987>",
                                description:
                                    "TCN directory (everything outside of HQ)",
                            },
                            {
                                label: "Server Info",
                                value: "server-info",
                                emoji: "<:hub:1041090995644797028>",
                                description:
                                    "view information for a TCN server",
                            },
                            {
                                label: "User Info",
                                value: "user-info",
                                emoji: "<:user:1041091822979666010>",
                                description:
                                    "view information/documents for a user",
                            },
                            {
                                label: "Upload A Document",
                                value: "upload",
                                emoji: "<:upload:1041092139016261682>",
                                description:
                                    "add a document to the Akasha System",
                            },
                        ],
                    },
                ],
            },
        ],
    });

    return { content: "Posted!", ephemeral: true };
}
