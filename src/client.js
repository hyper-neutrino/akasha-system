import {
    ActivityType,
    Client,
    IntentsBitField,
    PresenceUpdateStatus,
} from "discord.js";

export default new Client({
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
