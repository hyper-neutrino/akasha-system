import { ButtonStyle, Colors, ComponentType } from "discord.js";
import db from "../db.js";

const fail = {
    embeds: [
        {
            title: "**Document Failed To Send**",
            description:
                "A document could not be sent. This issue was logged; please contact the developer if it persists.",
            color: Colors.Red,
        },
    ],
};

export default async function (cmd, id) {
    await cmd.deferReply({ ephemeral: true });

    const documents = await db("documents")
        .find({ users: { $in: [id] } })
        .toArray();

    if (documents.length == 0) {
        return {
            embeds: [
                {
                    title: "**No Documents Found**",
                    description: "No documents were found for this user.",
                    color: Colors.Red,
                },
            ],
        };
    }

    documents.sort((x, y) => x.id - y.id);

    const messages = documents.map((doc) => ({
        embeds: [
            {
                title: doc.title,
                description: `${doc.description}\n\nID: \`${
                    doc.id
                }\`. Uploaded ${
                    doc.anon ? "anonymously" : `by <@${doc.uploader}>`
                }.`,
                color: 0x2d3136,
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
                        url: doc.link,
                    },
                ],
            },
        ],
        ephemeral: true,
    }));

    try {
        await cmd.editReply(messages.shift());
    } catch (error) {
        console.error(error);
        await cmd.editReply(fail);
    }

    for (const message of messages) {
        try {
            await cmd.followUp(message);
        } catch (error) {
            console.error(error);
            await cmd.followUp(fail);
        }
    }
}
