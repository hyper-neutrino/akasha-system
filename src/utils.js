export function is_string(object) {
    return object instanceof String || typeof object == "string";
}

export async function respond(interaction, data) {
    try {
        return await interaction.reply(data);
    } catch {
        return await interaction.editReply(data);
    }
}

export function timestamp(date, format = "F") {
    return `<t:${Math.round((date?.getTime?.() ?? date) / 1000)}:${format}>`;
}
