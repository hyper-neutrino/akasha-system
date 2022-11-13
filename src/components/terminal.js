import db from "../db.js";

export default async function (cmd) {
    const data = {};

    switch (cmd.values[0]) {
        case "tour":
            data.embeds = [{ title: "Hello!" }];
    }

    data.ephemeral = true;
    await cmd.reply(data);

    const { times } = await db("times").findOneAndUpdate(
        {},
        { $inc: { times: 1 } },
        { upsert: true }
    );

    const embed = cmd.message.embeds[0].toJSON();

    embed.footer = {
        text: `The Akasha System has been activated ${times} time${
            times == 1 ? "" : "s"
        }.S`,
    };

    await cmd.edit({ embeds: [embed] });
}
