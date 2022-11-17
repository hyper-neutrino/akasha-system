import { Colors, InteractionType } from "discord.js";
import fs from "fs";
import config from "./config.js";
import db from "./db.js";
import { is_string, respond } from "./utils.js";

import "./server/index.js";
import { api_get_users } from "./lib/api.js";
import client from "./client.js";

process.on("uncaughtException", (error) => console.error(error));

const commands = [];
const command_map = new Map();

for (const name of fs.readdirSync("src/commands")) {
    const { command, execute, autocomplete } = await import(
        `./commands/${name}`
    );

    commands.push(command);
    command_map.set(command.name, { execute, autocomplete });
}

client.once("ready", async () => {
    await client.application.commands.set(commands);

    try {
        client.hq = await client.guilds.fetch(config.guild);
    } catch {
        console.error(
            "\n\n=== [ CRITICAL ] ===\n\nCould not fetch HQ. Maybe the bot isn't in the server? Most features will not work properly.\n\n=== [ -------- ] ===\n"
        );
    }

    console.log("The Akasha System is online. Pre-loading users...");

    const required = new Set();

    for (const user of await api_get_users()) {
        required.add(user.id);
    }

    for (const doc of await db("documents").find({}).toArray()) {
        for (const user of [...(doc.authors ?? []), ...(doc.users ?? [])]) {
            required.add(user);
        }
    }

    for (const id of required) {
        try {
            await client.users.fetch(id);
        } catch {}
    }

    console.log("Users loaded.");
});

client.on("guildMemberAdd", async (member) => {
    const channel = await client.channels.fetch(config.welcome);

    if (member.user.bot) {
        const entry = await db("bots").findOne({ user: member.id });

        if (entry) {
            await channel.send(
                `Hello, ${member}. You are already recognized by the Akasha System:\n\n${entry.body}\n\nObservers - run **/akasha bot edit** to edit this information.`
            );
        } else {
            await channel.send(
                `Hello, ${member}. You are not recognized by the Akasha System yet. Observers - run **/akasha bot edit** to provide public information about the bot if needed.`
            );
        }
    } else {
        await channel.send(
            `Welcome to the TCN HQ, ${member}! To get started, please read <#809970922701979678> and pick up some roles in <#830643335277707294>. You can find a full tour using **/tour** or in <#${config.terminal}>, where you can also find a step-by-step quick guide. Please do not hesitate to ask if you have any questions, need any help familiarizing yourself with HQ, or need any assistance with setting up your server for the TCN!`
        );
    }
});

client.on("interactionCreate", async (interaction) => {
    if (interaction.type == InteractionType.ApplicationCommand) {
        const { execute } = command_map.get(interaction.commandName) ?? {};

        if (execute) {
            try {
                let data = await execute(interaction);

                if (data) {
                    if (is_string(data)) data = { content: data };
                    await respond(interaction, data);
                }
            } catch (error) {
                await respond(interaction, {
                    embeds: [
                        {
                            title: "Error",
                            description:
                                "An error occurred executing this command.",
                            color: Colors.Red,
                        },
                    ],
                    components: [],
                    files: [],
                    content: null,
                    ephemeral: true,
                });

                throw error;
            }
        }
    } else if (
        interaction.type == InteractionType.ApplicationCommandAutocomplete
    ) {
        const { autocomplete } = command_map.get(interaction.commandName) ?? {};

        if (autocomplete) {
            let data = await autocomplete(interaction);
            if (data) {
                if (!Array.isArray(data)) data = [data];
                await interaction.respond(
                    data.map((x) => (is_string(x) ? { name: x, value: x } : x))
                );
            }
        }
    } else if (
        interaction.type == InteractionType.MessageComponent ||
        interaction.type == InteractionType.ModalSubmit
    ) {
        if (interaction.customId.startsWith(":")) {
            let cmd = interaction.customId.substring(1);
            const [id, key, ...args] = cmd.split(/:/);

            if (id && interaction.user.id != id) return;

            let handle;

            ({ default: handle } = await import(`./components/${key}.js`));

            if (handle) {
                try {
                    let data = await handle(interaction, ...args);

                    if (data) {
                        if (is_string(data)) data = { content: data };
                        await respond(interaction, data);
                    }
                } catch (error) {
                    await respond(interaction, {
                        embeds: [
                            {
                                title: "Error",
                                description:
                                    "An error occurred with this interaction.",
                                color: Colors.Red,
                            },
                        ],
                        components: [],
                        files: [],
                        content: null,
                        ephemeral: true,
                    });

                    throw error;
                }
            }
        }
    }
});

client.on("messageCreate", async (message) => {
    if (message.author.id == client.user.id) return;
    if (message.channelId == config.terminal) await message.delete();
});

await client.login(config.discord_token);
