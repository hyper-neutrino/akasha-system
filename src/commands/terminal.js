import { ApplicationCommandType, ComponentType } from "discord.js";
import db from "../db.js";
import {
    HUB,
    QUICK_GUIDE,
    SUMMARY,
    TCN_DIRECTORY,
    TOUR,
    UPLOAD,
    USER,
} from "../lib/emoji.js";

export const command = {
    type: ApplicationCommandType.ChatInput,
    name: "terminal",
    description: "post an Akasha Terminal",
    dm_permission: false,
    default_member_permissions: "0",
};

export async function execute(cmd) {
    const entry = await db("times").findOne({});
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
                                emoji: TOUR,
                                description:
                                    "get a tour of HQ and the Akasha System",
                            },
                            {
                                label: "Quick Guide",
                                value: "quick-guide",
                                emoji: QUICK_GUIDE,
                                description:
                                    "quick guide for setup of TCN features",
                            },
                            {
                                label: "TCN Directory",
                                value: "tcn-directory",
                                emoji: TCN_DIRECTORY,
                                description: "TCN directory of resources",
                            },
                            // {
                            //     label: "Summary",
                            //     value: "summary",
                            //     emoji: SUMMARY,
                            //     description: "view a summary of current events",
                            // },
                            {
                                label: "Server Info",
                                value: "server-info",
                                emoji: HUB,
                                description:
                                    "view information for a TCN server",
                            },
                            {
                                label: "User Info",
                                value: "user-info",
                                emoji: USER,
                                description:
                                    "view information/documents for a user",
                            },
                            {
                                label: "Upload A Document",
                                value: "upload",
                                emoji: UPLOAD,
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
