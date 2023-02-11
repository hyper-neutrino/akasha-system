import { ButtonStyle, ComponentType } from "discord.js";
import {
    BANSHARE,
    EVENT,
    FIRST_PAGE,
    GLOBAL,
    LAST_PAGE,
    NEXT_PAGE,
    PARTNER_LIST,
    PREV_PAGE,
    QUICK_GUIDE,
    SYNC,
} from "./emoji.js";

const pages = [
    {
        meta: {
            label: "Partner List",
            description: "(mandatory)",
            emoji: PARTNER_LIST,
        },
        title: "**Partner List**",
        description:
            "You must display the list of TCN servers and other partners in a publicly visible channel clearly separated from the rest of your partners. You can find the most up-to-date version in <#922747481484324895>; however, you may also choose your own format as long as it includes all of the servers and all required descriptions/links (website, hub, Genshin Wizard).\n\n:bulb: You can use the <@713773560371609660> bot to keep your partner list automatically up-to-date. You can invite it with [this link](https://discord.com/api/oauth2/authorize?client_id=713773560371609660&permissions=0&scope=applications.commands%20bot) and view a full guide on how to use it [here](https://docs.google.com/document/d/1CZqaV4HAiNDgv7aTNS8MNdEMgDoIaihv-ymeI18ar64)).",
    },
    {
        meta: {
            label: "Partner Event Channel",
            description: "(mandatory)",
            emoji: EVENT,
        },
        title: "**Partner Event Channel**",
        description:
            "You must follow <#809973098262298655> in a publicly visible channel in your server. You may make this the same channel as where you post other partner events.\n\n:bulb: The destination channel must be a regular text channel and not an announcement channel itself.",
    },
    {
        meta: {
            label: "Banshares",
            description: "(optional)",
            emoji: BANSHARE,
        },
        title: "**Banshares**",
        description:
            "Follow <#804178568317632553> to receive TCN banshares. You may **not** use this in non-TCN servers (you can use the evidence provided to ban problematic members from other servers at your own discretion; however, you cannot directly connect TCN banshares to a non-TCN server).\n\n:bulb: To submit a banshare, go to https://banshare.teyvatcollective.network. It is advised that only admins or head mods have access to submitting banshares on behalf of your servers. You will need to login to keep track of who is submitting the banshares. Once submitted, the observers will vet through the submission and publish it. Please ping an available observer online, if it is urgent.",
    },
    {
        meta: {
            label: "Global Chat",
            description: "(optional)",
            emoji: GLOBAL,
        },
        title: "**Global Chat**",
        description:
            "To use global chat, you will need to add <@905370006362140702> to your server using [this invite link](https://discord.com/api/oauth2/authorize?client_id=905370006362140702&permissions=137976212544&scope=applications.commands%20bot).\n\nThere are three global channels available. You can use **/connect** to connect a channel to a global channel.\n- **TCN**: the main (public) global channel\n- **lounge**: the staff general/hangout channel - you may grant access to retired staff or others with staff chat access in your server\n- **office**: the staff business channel - you may only grant access to current staff in your server\n\n:bulb: Make sure the bot can see the channel. It also needs the **Manage Webhooks** and **Manage Messages** permissions in global channels, which the bot requests by default, so as long as you don't have overrides in that channel disabling those permissions, you should not need to do anything.\n\n:bulb: To let emoji from outside of TCN servers work properly, create a webhook in the channel. You do not need to do anything with it or edit its properties, just create a user-owned webhook.\n\nFor a full guide on operating the global bot, check out [this document](https://docs.google.com/document/d/14pu-vayBjaDgGwAKwF8jOlGqJxb6st9FnSh8Rb3PsjU).",
    },
    {
        meta: {
            label: "Staff Role Autosync",
            description: "(optional)",
            emoji: SYNC,
        },
        title: "**Staff Role Autosync**",
        description:
            "To use automatic staff role synchronization, you will need to add <@959360773518413824> to your server using [this invite link](https://discord.com/api/oauth2/authorize?client_id=959360773518413824&permissions=1512097303623&scope=applications.commands%20bot).\n\nIf you would like your staff to automatically receive the network staff and server color roles on the hub, use /autostaff add <role> with your staff role(s). Your staff should automatically gain the appropriate roles on the hub (there may be some delay as updates happen).",
    },
    {
        meta: {
            label: "Full Quick Guide",
            description: "including available (optional) bots",
            emoji: QUICK_GUIDE,
        },
        title: "**Full Quick Guide**",
        description:
            "To view the full quick guide, including more information on each item, links to other information documents, and a list of (fully optional) features and bots that are available to you as a TCN member, visit [this page](https://info.teyvatcollective.network/quickstart). We hope that this has streamlined the setup process a bit; please let us know if you have any more questions or need help setting up a server, and the observers would be happy to assist you with that.",
    },
];

const options = pages.map((x, i) => ({ ...x.meta, value: `${i}` }));

for (let x = 0; x < pages.length; x++) {
    pages[x].color ??= 0x2d3136;
    pages[x].footer = { text: `Page ${x + 1} / ${pages.length}` };

    pages[x] = {
        embeds: [pages[x]],
        components: [
            {
                type: ComponentType.ActionRow,
                components: [
                    {
                        type: ComponentType.Button,
                        style: ButtonStyle.Secondary,
                        custom_id: "::qg-page:0:a",
                        emoji: FIRST_PAGE,
                    },
                    {
                        type: ComponentType.Button,
                        style: ButtonStyle.Secondary,
                        custom_id: `::qg-page:${
                            (x + pages.length - 1) % pages.length
                        }:b`,
                        emoji: PREV_PAGE,
                    },
                    {
                        type: ComponentType.Button,
                        style: ButtonStyle.Secondary,
                        custom_id: `::qg-page:${(x + 1) % pages.length}:c`,
                        emoji: NEXT_PAGE,
                    },
                    {
                        type: ComponentType.Button,
                        style: ButtonStyle.Secondary,
                        custom_id: `::qg-page:${pages.length - 1}:d`,
                        emoji: LAST_PAGE,
                    },
                ],
            },
            {
                type: ComponentType.ActionRow,
                components: [
                    {
                        type: ComponentType.StringSelect,
                        custom_id: `::qg-jump`,
                        placeholder: "Select a page to jump to.",
                        options,
                    },
                ],
            },
        ],
    };

    if (x == 0) pages[x].ephemeral = true;
}

export default pages;
