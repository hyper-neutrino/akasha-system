import { page_map } from "../lib/discord_help.js";

export default async function (cmd, id) {
    await cmd.update(
        page_map.get(id || cmd.values[0])?.message ?? {
            embeds: [
                {
                    title: "**Page Missing**",
                    description:
                        "This page is not available yet. Check back later!",
                    color: 0x2d3136,
                },
            ],
        }
    );
}
