import { ApplicationCommandType } from "discord.js";
import pages from "../lib/tour.js";

export const command = {
    type: ApplicationCommandType.ChatInput,
    name: "tour",
    description: "start the TCN HQ tour",
    dm_permission: false,
};

export async function execute(cmd) {
    return pages[0];
}
