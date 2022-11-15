import db from "../db.js";

export default async function (modal, id) {
    await modal.deferReply({ ephemeral: true });

    await db("servers").findOneAndUpdate(
        { id },
        {
            $set: {
                body: modal.fields.getTextInputValue("body"),
                faction: modal.fields.getTextInputValue("faction"),
                abbr: modal.fields.getTextInputValue("abbr"),
            },
        },
        { upsert: true }
    );

    return {
        embeds: [
            {
                title: "**Updated server information**",
                description:
                    "The new information will be displayed in the server info.",
                color: 0x2d3136,
            },
        ],
    };
}
