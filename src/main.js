import {
    ActivityType,
    Client,
    Colors,
    IntentsBitField,
    InteractionType,
    PresenceUpdateStatus,
} from "discord.js";
import fs from "fs";
import config from "./config.js";
import db from "./db.js";
import { api_get_servers, api_get_users } from "./lib/api.js";
import { is_string, respond } from "./utils.js";

process.on("uncaughtException", (error) => console.error(error));

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
    ],
    presence: {
        status: PresenceUpdateStatus.Online,
        activities: [{ type: ActivityType.Listening, name: "your inquiries" }],
    },
});

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

    console.log("The Akasha System is online.");

    let users = await api_get_users();
    let guilds = await api_get_servers();

    const display_user = (user) =>
        `user [${user.id}] guilds [${user.guilds.join(
            ", "
        )}] roles [${user.roles.join(", ")}]`;

    const display_guild = (guild) =>
        `guild [${guild.id}] "${guild.name}" character [${
            guild.character
        }] invite = discord.gg/${guild.invite} owned by ${guild.owner} ${
            guild.advisor ? `advised by ${guild.advisor}` : "no advisor"
        }`;

    setInterval(async () => {
        let _users, _guilds;

        try {
            _users = await api_get_users();
            _guilds = await api_get_servers();
        } catch (error) {
            console.error(error);
            return await log_channel.send("Failed to fetch from the API!");
        }

        const changes = [];

        const old_users = new Set(users.map((x) => x.id));
        const new_users = new Set(_users.map((x) => x.id));
        const umap = new Map();

        for (const user of users) {
            if (!new_users.has(user.id)) {
                changes.push(`- ${display_user(user)}`);
            } else umap.set(user.id, user);
        }

        for (const user of _users) {
            if (!old_users.has(user.id)) {
                changes.push(`+ ${display_user(user)}`);
            } else {
                const old = umap.get(user.id);

                const add = user.guilds.filter((x) => !old.guilds.includes(x));
                const rm = old.guilds.filter((x) => !user.guilds.includes(x));

                if (add.length + rm.length > 0) {
                    changes.push(
                        `= ${user.id}: guilds [${(
                            add.map((x) => `+${x}`).join(" ") +
                            " " +
                            rm.map((x) => `-${x}`).join(" ")
                        ).trim()}]`
                    );
                }

                for (const key of ["owner", "advisor", "voter", "observer"]) {
                    const prev = old.roles.includes(key);
                    const now = user.roles.includes(key);

                    if (prev && !now) {
                        changes.push(
                            `= ${user.id} is no longer ${
                                {
                                    owner: "a server owner",
                                    advisor: "a council advisor",
                                    voter: "their server's voter",
                                    observer: "an observer",
                                }[key]
                            }`
                        );
                    } else if (!prev && now) {
                        changes.push(
                            `= ${user.id} has become ${
                                {
                                    owner: "a server owner",
                                    advisor: "a council advisor",
                                    voter: "their server's voter",
                                    observer: "an observer",
                                }[key]
                            }`
                        );
                    }
                }
            }
        }

        const old_guilds = new Set(guilds.map((x) => x.id));
        const new_guilds = new Set(_guilds.map((x) => x.id));
        const gmap = new Map();

        for (const guild of guilds) {
            if (!new_guilds.has(guild.id)) {
                changes.push(`- ${display_guild(guilds)}`);
            } else gmap.set(guild.id, guild);
        }

        for (const guild of _guilds) {
            if (!old_guilds.has(guild.id)) {
                changes.push(`+ ${display_guild(guilds)}`);
            } else {
                const old = gmap.get(guild.id);

                const row = [];

                if (guild.name != old.name) {
                    row.push(`renamed "${old.name}" => "${guild.name}"`);
                }

                if (guild.invite != old.invite) {
                    row.push(
                        `invite changed discord.gg/${old.invite} => discord.gg/${guild.invite}`
                    );
                }

                if (guild.owner != old.owner) {
                    row.push(
                        `ownership transfered ${old.owner} => ${guild.owner}`
                    );
                }

                if (guild.advisor != old.advisor) {
                    if (!guild.advisor) {
                        row.push(`advisor ${old.advisor} removed`);
                    } else if (!old.advisor) {
                        row.push(`advisor ${guild.advisor} added`);
                    } else {
                        row.push(
                            `advisor switched ${old.advisor} => ${guild.advisor}`
                        );
                    }
                }

                if (guild.voter != old.voter) {
                    row.push(`voter switched ${old.voter} => ${guild.voter}`);
                }

                if (row.length > 0) {
                    changes.push(`= ${guild.id}: ${row.join(", ")}`);
                }
            }
        }

        if (changes.length > 0) {
            const log_channel = await client.channels.fetch(config.api_logs);

            let message = changes.shift();

            for (const change of changes) {
                if (message.length + change.length + 1 + 12 > 2000) {
                    await log_channel.send(`\`\`\`diff\n${message}\n\`\`\``);
                    message = change;
                } else message += "\n" + change;
            }

            await log_channel.send(`\`\`\`diff\n${message}\n\`\`\``);
        }

        users = _users;
        guilds = _guilds;
    }, 10 * 1000);
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
