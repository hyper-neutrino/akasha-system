import { Colors } from "discord.js";
import user_info from "../lib/user_info.js";

export default async function (modal) {
    await modal.deferReply({ ephemeral: true });

    let user;

    try {
        user = await modal.client.users.fetch(
            modal.fields.getTextInputValue("id")
        );
    } catch (error) {
        console.error(error);

        return {
            embeds: [
                {
                    title: "**Invalid User ID**",
                    description:
                        "There was no user found with that ID on Discord. Make sure you are entering the ID (a 17-20 digit number) and not the tag (Username#0000).",
                    color: Colors.Red,
                },
            ],
        };
    }

    await modal.editReply(await user_info(modal, user));
}
