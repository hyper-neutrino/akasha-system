import { ApplicationCommandType, ButtonStyle, ComponentType } from "discord.js";
import config from "../config.js";
import db from "../db.js";
import {
    DASHBOARD,
    DISCORD,
    DOCUMENT,
    HUB,
    PARTNER_LIST,
    QUICK_GUIDE,
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
                        type: ComponentType.Button,
                        style: ButtonStyle.Link,
                        emoji: DASHBOARD,
                        label: "Dashboard",
                        url: config.domain,
                    },
                    {
                        type: ComponentType.Button,
                        style: ButtonStyle.Link,
                        emoji: PARTNER_LIST,
                        label: "Document List",
                        url: `${config.domain}/docs/`,
                    },
                    {
                        type: ComponentType.Button,
                        style: ButtonStyle.Link,
                        emoji: DOCUMENT,
                        label: "Documentation",
                        url: "https://docs.google.com/document/d/19iFhBSdKUnKSfG5ma6W3alhgKRyAP5QVsOoOFcZZ3cc",
                    },
                ],
            },
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
                            {
                                label: "Server Info",
                                value: "server-info",
                                emoji: HUB,
                                description:
                                    "view information/documents for a server",
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
