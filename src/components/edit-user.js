import db from "../db.js";

export default async function (modal, id) {
    await modal.deferReply({ ephemeral: true });

    await db("users").findOneAndUpdate(
        { user: id },
        { $set: { body: modal.fields.getTextInputValue("body") } },
        { upsert: true }
    );

    return {
        embeds: [
            {
                title: "**Updated user information**",
                description:
                    "The new information will be displayed in the user info for this user.",
                color: 0x2d3136,
            },
        ],
    };
}
