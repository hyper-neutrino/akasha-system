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

export function english_list(list, separator = ", ", terminator = "and ") {
    if (list.length == 0) return "<empty list>";
    if (list.length == 1) return list[0];
    if (list.length == 2) return `${list[0]} ${terminator}${list[1]}`;

    return `${list
        .slice(0, list.length - 1)
        .join(separator)}${separator}${terminator}${list[list.length - 1]}`;
}

export function uniquify(list) {
    const set = new Set();
    const output = [];

    for (const element of list) {
        if (!set.has(element)) {
            set.add(element);
            output.push(element);
        }
    }

    return output;
}
