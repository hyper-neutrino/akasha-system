import { Colors } from "discord.js";
import db from "../db.js";

export default async function (cmd, id) {
    await cmd.deferUpdate();
    id = parseInt(id);

    if (await db("documents").findOne({ id })) {
        await db("documents").findOneAndDelete({
            id,
        });

        return {
            embeds: [
                {
                    title: "**Deleted Document**",
                    description: `Document #${id} was deleted forever.`,
                    color: 0x2d3136,
                },
            ],
            components: [],
        };
    } else {
        return {
            embeds: [
                {
                    title: "**Document Not Found**",
                    description: `Document #${id} could not be found; it may have been deleted already.`,
                    color: Colors.Red,
                },
            ],
            components: [],
        };
    }
}
