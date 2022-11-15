import { home } from "../lib/discord_help.js";

export default async function (cmd) {
    await cmd.update(home);
}
