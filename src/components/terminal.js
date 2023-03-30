import db from "../db.js";
import tour from "../lib/tour.js";
import qg from "../lib/quick-guide.js";
import { api_get_observers } from "../lib/api.js";
import { english_list } from "../utils.js";
import { ButtonStyle, ComponentType, TextInputStyle } from "discord.js";
import config from "../config.js";

export default async function (cmd) {
    try {
        let data = {};

        switch (cmd.values[0]) {
            case "tour":
                data = tour[0];
                break;
            case "quick-guide":
                data = qg[0];
                break;
            case "tcn-directory":
                await cmd.deferReply({ ephemeral: true });

                const observers = await api_get_observers();

                data.embeds = [
                    {
                        title: "**TCN Directory**",
                        color: 0x2d3136,
                        fields: [
                            {
                                name: "**Observers**",
                                value: `The TCN observer committee is responsible for observations, public relations, and administrative tasks. They do not have more authority or privilege and are subject to the same rules and must follow the will of the council's votes. The observer committee is elected and each observer has a six-month term, and can be removed by vote as well.\n\nThe current observers are ${english_list(
                                    observers.map((x) => `<@${x.id}>`)
                                )}.\n_ _\n_ _`,
                            },
                            {
                                name: "**Important Document Links**",
                                value: "- [Rules, Guidelines, and Protocols](https://docs.google.com/document/d/1pMMfmob4y6xCKUc2WARSQlD8aQKpRdYT0zaexgRLraQ) (the official rules doc)\n- [TCN Partnership Application Form](https://forms.gle/mDiXUkpPDmC8oFgN9)\n- [Global Bot Guide](https://docs.google.com/document/d/14pu-vayBjaDgGwAKwF8jOlGqJxb6st9FnSh8Rb3PsjU)\n- [TCN Quick Guide](https://docs.google.com/document/d/1PFOOROZMU0k2saUW0Q6Ffq5YgppTIQ4s3JIrTJU4gXA) (also check the quick guide option in the Akasha Terminal)\n- [Daedalus Usage Guide for HQ](https://docs.google.com/document/d/1pIdUmlyUXcXVIggd8rL8sLgoz2MNUyMySBwMB5Aex7w) (how to use suggestions, highlights, and reminders)\n- [Submit Anonymous Feedback/Reports](https://forms.gle/RGGhPzdjepi5V5Ey9)\n- [TCN Partner Embed Autosync Guide](https://docs.google.com/document/d/1CZqaV4HAiNDgv7aTNS8MNdEMgDoIaihv-ymeI18ar64)\n- [TCN Membership Change Logs](https://docs.google.com/spreadsheets/d/1CZYFyynMoKCPJRuAW1x6LQycpHVynHBg0MKMa8dd68Q)\n_ _\n_ _",
                            },
                            {
                                name: "**TCN Website**",
                                value: "The website is at https://teyvatcollective.network/. To submit banshares, go to https://banshare.teyvatcollective.network/. To access the API (for development purposes), go to https://api.teyvatcollective.network/ (documentation to come).\n_ _\n_ _",
                            },
                            {
                                name: "**Bots**",
                                value: "__Official__\n- [TC-global](https://discord.com/api/oauth2/authorize?client_id=905370006362140702&permissions=137976212544&scope=applications.commands%20bot) - for global chat [by Leaf]\n- [TCN](https://discord.com/api/oauth2/authorize?client_id=959360773518413824&permissions=1512097303623&scope=applications.commands%20bot) - for autosyncing staff roles [by Leaf]\n- [TCN Autosync](https://discord.com/api/oauth2/authorize?client_id=713773560371609660&permissions=0&scope=applications.commands%20bot) - for autosyncing the partner embed [by hyper]\n\n__Partners__\n- [Genshin Wizard](https://genshinwizard.com/) - multipurpose Genshin Discord bot [by hatter]\n\n__Unofficial__\n- [Daedalus](https://daedalus.hyper-neutrino.xyz) - general purpose Discord management bot [by hyper]\n- [Banhammer](https://discord.com/api/oauth2/authorize?client_id=994100815402909817&permissions=274877959172&scope=bot) - massban by URL (run **bh!help**) [by hyper]\n_ _\n_ _",
                            },
                            {
                                name: "**TCN Hub**",
                                value: "https://discord.gg/BUVGp5yjcD\n\nThe TCN hub is the public-facing server where members can talk to each other, ask questions about the network, find information about the TCN and how to apply, and contact observers. It is optional but strongly encouraged to join the hub so you can help with onboarding your staff in the hub and represent your server. Check the **Staff Role Autosync** page of the Quick Guide in the Akasha Terminal for information on how to automatically grant your staff members your server role and the Network Staff role on the hub.",
                            },
                        ],
                    },
                ];

                break;
            case "server-info":
                data = null;

                cmd.showModal({
                    custom_id: "::server-info",
                    title: "Obtain Server Information",
                    components: [
                        {
                            type: ComponentType.ActionRow,
                            components: [
                                {
                                    type: ComponentType.TextInput,
                                    label: "Server ID",
                                    style: TextInputStyle.Short,
                                    custom_id: "id",
                                    placeholder:
                                        "ID (17-20 digit number), not name.",
                                    required: true,
                                    min_length: 17,
                                    max_length: 20,
                                },
                            ],
                        },
                    ],
                });

                break;
            case "user-info":
                data = null;

                cmd.showModal({
                    custom_id: "::user-info",
                    title: "Obtain User Information",
                    components: [
                        {
                            type: ComponentType.ActionRow,
                            components: [
                                {
                                    type: ComponentType.TextInput,
                                    label: "User ID",
                                    style: TextInputStyle.Short,
                                    custom_id: "id",
                                    placeholder:
                                        "ID (17-20 digit number), not tag (Username#0000).",
                                    required: true,
                                    min_length: 17,
                                    max_length: 20,
                                },
                            ],
                        },
                    ],
                });

                break;
            case "upload":
                data.components = [
                    {
                        type: ComponentType.ActionRow,
                        components: [
                            {
                                type: ComponentType.Button,
                                style: ButtonStyle.Link,
                                label: "Upload Docs on the Dashboard",
                                url: config.domain,
                            },
                        ],
                    },
                ];

                break;
            default:
                data.content =
                    "This item is not available yet. Check back later!";
        }

        if (data) {
            data.ephemeral = true;

            try {
                await cmd.reply(data);
            } catch {
                await cmd.editReply(data);
            }
        }

        const entry = await db("times").findOneAndUpdate(
            {},
            { $inc: { times: 1 } },
            { upsert: true }
        );

        const times = (entry.value?.times ?? 0) + 1;

        const embed = cmd.message.embeds[0].toJSON();

        embed.footer = {
            text: `The Akasha System has been activated ${times} time${
                times == 1 ? "" : "s"
            }.`,
        };

        await cmd.message.edit({ embeds: [embed] });
    } catch (e) {
        await cmd.message.edit({});
        throw e;
    }
}
