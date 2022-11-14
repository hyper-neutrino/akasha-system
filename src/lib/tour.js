import { ButtonStyle, ComponentType } from "discord.js";
import config from "../config.js";
import {
    BUSINESS,
    CHAT,
    COUNCIL,
    EVENT,
    FIRST_PAGE,
    HUB,
    IMPORTANT,
    LAST_PAGE,
    NEXT_PAGE,
    PREV_PAGE,
    TERMINAL,
    TOUR,
    WELCOME,
} from "./emoji.js";

const pages = [
    {
        meta: {
            label: "Introduction",
            description: "Welcome! Start the tour here.",
            emoji: TOUR,
        },
        title: "**Welcome to the Teyvat Collective Network!**",
        description:
            "This is our HQ, the base of operations for the TCN. Each TCN server's owner is here as a representative, as well as possibly one other trusted staff member, their council advisor. For a full list of every TCN server and its representative(s), refer to <#922747481484324895>.\n\nIf you haven't yet, you should check out <#809970922701979678> and <#930312026398548018>, then head over to <#830643335277707294> to pick up some roles. Come back here when you're done to continue the tour!",
    },
    {
        meta: {
            label: "Important Channels",
            description: "Read-only channels that you should check frequently.",
            emoji: IMPORTANT,
        },
        title: "**Important Channels**",
        description:
            "These channels are where you can get news on what's happening in the TCN or HQ, summaries of discussions and network changes, and where you vote and view observation reports for applying servers.\n\n<#836432538716733471> is where you will find news and updates for the network or the HQ server. You can pick up the <@&849902001684873266> ping role in <#830643335277707294>. When the partner embed changes, we will ping @everyone to make sure everyone sees the update and can make the appropriate changes.\n\n<#804175079076134952> is the voting channel. Votes for things like network rule changes, inductions, etc. will be put here. If you are eligible to vote, you will automatically have the role(s) that will be pinged. If you notice any issues with votes, please contact <@251082987360223233>.\n\n<#929434036236083200> is where suggestions can be posted. Some things will be implemented directly if their suggestions are favorable; other things require votes to be changed. Votes must be presented 24 hours before going live, and you do not need to suggest it here, but this is an easy way to gauge the council's consensus. To make a suggestion, go to <#804178519688871946> and use **/suggest**.\n\n<#804185611963072554> is where observers will publish their reports for servers. Make sure you check over reports and notify us of any issues you may notice! We will usually release the reports in advance of the induction vote to give time for review and feedback.\n\n<#929771954544709642> is where summaries for discussions will go. If you miss any long or important discussions, check here for a summary if you don't want to / can't read the entire conversation. If there isn't a summary for something you would like summarized, let an observer know. Additionally, every week, we will publish a summary of what's happening to keep everyone updated. You can receive the <@&1020074566753726535> role in <#830643335277707294>.",
    },
    {
        meta: {
            label: "Server Business",
            description: "Channels relating more to individual servers.",
            emoji: BUSINESS,
        },
        title: "**Server Business**",
        description:
            "These channels are generally more oriented towards individual servers and their business (as opposed to the whole network, which is what the __Council__ category is for). Please participate in discussions that you believe you can contribute to or that involve you or your server(s)!\n\n<#1024016016075923528> is for discussing partnerships with external (non-TCN) servers. If you have a partnership request that you want more information on, feel free to start a discussion thread for the server here. Make sure you read the FAQ post first!\n\n<#804178463564628018> is a help channel for advice when it comes to dealing with moderation scenarios, other server situations, etc. Feel free to also post general advice here; it isn't only a Q&A channel!\n\n<#923104196323074098> is a more general Q&A channel. You can ask for advice here as well, but feel free to also ask for information about users (for example, if you encounter a user behaving weirdly in your server and want to know if anyone else has background on them).\n\n<#804178568317632553> is where banshares submitted to https://banshare.teyvatcollective.network are posted. Follow this channel in your server to receive banshares of problematic users / accounts (optional). Note that you may not follow this channel outside of the TCN. You can use the evidence provided to ban users from other servers at your own discretion and at your own responsibility, but do not follow the channel elsewhere.\n\n<#885504201776562196> is where you can discuss or ask questions about a banshare. If you've noticed a potentially problematic user or suspicious but not incriminating behavior, feel free to mention them here as well if you don't want to publish a formal banshare across the network.\n\n<#885501615736512512> is where you can find information on how to use the banshare system.\n\n<#944593890541989958> is the logging channel for the TCN global chats (we will go over these later during the tour). You can mostly ignore these but if you need to find purged messages or view message edit history for global chats, you can check here.",
    },
    {
        meta: {
            label: "Council",
            description: "TCN Council discussion channels.",
            emoji: COUNCIL,
        },
        title: "**Council Discussion Channels**",
        description:
            "These channels are generally more oriented towards network-wide or HQ-related discussions. Please participate in discussions that you believe you can contribute to or that involve you or your server(s)!\n\n<#1020366138821062676> will be updated with applicants to the TCN. By policy, 72 hours will be given before observation arrangements are made once a notification is posted here. You can pick up the <@&1010031791597441165> ping role in <#830643335277707294> to be notified when new servers apply to the TCN. Please bring up any opinions or history you have with the server that you would like to share with the rest of the council, and let an observer know if you want to start a vote to decline observing the server.\n\n<#804177602810085446> is the primary discussion channel for HQ-related things and things like policies or rules. Feel free to create a thread if you want to start a long topical discussion and want to keep it organized in one place.\n\n<#822170266879787069> is a slightly more broad discussion channel and is generally more network-oriented. Like with <#804177602810085446>, feel free to start new threads.\n\n<#804185548776144928> is a public read-only observer discussion channel. The goal is to increase transparency, so when possible, observers will discuss their work here instead of a private channel. Feel free to bring up any questions or issues in a discussion channel.\n\n<#1022527333682393188> is the HQ to-do / project list. Ask an observer if you would like a project to be added onto the board. Feel free to add to discussions or contribute your opinion to project threads.\n\n<#804178519688871946> is just the bot spam channel. Use bot commands here!",
    },
    {
        meta: {
            label: "Event",
            description: "Event news and discussion channels.",
            emoji: EVENT,
        },
        title: "**Event Channels**",
        description:
            "<#809973098262298655> is the announcement channel where TCN servers and cross-promote and advertise their events across the network. It is mandatory to have a publicly visible channel in your server following this channel so we can all work together to help bring attention to each other's events! If you would like to promote one of your events, check the pins for the channel's webhook URL, then wait or let an observer know to review your event and publish it.\n\n<#822561646072430602> is for discussing anything event-related - pointing out issues or clarifications within cross-promoted events, asking an observer to review and publish your event, discussing potential collabs with other TCN servers, etc.",
    },
    {
        meta: {
            label: "General",
            description: "General channels.",
            emoji: CHAT,
        },
        title: "**General Channels**",
        description:
            "We skipped over the welcome category, but we'll get back to that shortly. The channels here are pretty self-explanatory - they are just general chat/hangout channels; there is no topic, be respectful when interacting with other council members but otherwise feel free to talk about anything SFW here! We all need time to relax and take our minds off of work/business-related matters. We have Honkai discussion channel as well, which you can access with the <@&890332504664440923> role in <#830643335277707294>. Please keep the general channel leaks-free and keep those in <#848822744740397096>. Finally, we also have an NSFW channel locked behind the <@&851638996706918400> role in <#830643335277707294>. You must be 18 years of age or older to access this channel!",
    },
    {
        meta: {
            label: "Welcome",
            description: "Welcome channels, including introductions.",
            emoji: WELCOME,
        },
        title: "**Welcome Channels**",
        description:
            "We'll come back to <#806099834707640341> in a bit.\n\nIf you haven't read <#809970922701979678> yet, you should go do so immediately. It has the initial landing information including HQ rules and expectations. If you're a bit confused by what to set up, don't worry, we'll go over it later in this tour, or you can check out the [quick guide](https://docs.google.com/document/d/1PFOOROZMU0k2saUW0Q6Ffq5YgppTIQ4s3JIrTJU4gXA).\n\n<#922747481484324895> has each TCN server as well as its server owner and council advisor (if present), as well as a Discohook link to the latest version of the partner embed. You can look up even more information about TCN servers using the **/akasha server lookup** command.\n\n<#930312026398548018> is a short-form channel directory of the channels in HQ. If you forget what a channel does, check its topic or here or ask someone in HQ.\n\n<#1019038929346908160> is a summarized versoin of the [rules, guidelines, and protocols](https://docs.google.com/document/d/1pMMfmob4y6xCKUc2WARSQlD8aQKpRdYT0zaexgRLraQ). Keep in mind that if these two versions disagree, the document is correct, so this is not a substitute for reading the rules.\n\n<#830643335277707294> is where you can find self-assignable roles. Please choose (a) pronoun role(s) though it is optional, and you can also obtain ping roles and access roles here.\n\n<#804185195594907688> is where you can find bots, emoji, and other resources other people have found useful. If you come across anything you think might interest or benefit other TCN servers, feel free to introduce the network to it here!\n\n\n\n**Congratulations!** You have completed the HQ part of the tour. We'll move on to the Akasha System next, but before we do so, feel free to take a break from exploring and introduce yourself to the rest of the council in <#806099834707640341>! This is completely optional so share as much or as little as you are comfortable with, and please do not reveal personally identifying information. Please do not have conversations here; if you want to respond to someone's introduction, ping them in <#804174916907171874>.",
    },
    {
        meta: {
            label: "TCN Hub",
            description: "Public-facing TCN hub server.",
            emoji: HUB,
        },
        title: "**TCN Hub**",
        description:
            "While this is optional, we recommend you join the [TCN Hub](https://discord.gg/BUVGp5yjcD). The Hub is the official public server where TCN members can go to communicate with other users, ask questions to staff, contact observers, view information about the TCN, etc. Representing your server there, both for members and your staff members, is optional but beneficial.\n\nTo add users to your staff list, use **/staff add** in the Hub. You can also use **/autostaff** to set up automatic synchronization by adding the <@959360773518413824> bot to your server with [this invite link](https://discord.com/api/oauth2/authorize?client_id=959360773518413824&permissions=1512097303623&scope=applications.commands%20bot).",
    },
    {
        meta: {
            label: "Akasha System",
            description: "What is the Akasha System and how do I use it?",
            emoji: TERMINAL,
        },
        title: "**Akasha System**",
        description: `The __Akasha System__ is the TCN's information service. If you have features you want added to it, please use the **Feedback** option in the Akasha Terminal (<#${config.terminal}>), or contact <@251082987360223233> for longer inquiries with more details.\n\nThe Akasha System is the bot that can be interacted with either with an Akasha Terminal or with its commands as long as you are within the borders of the TCN HQ.\n\nAn Akasha Terminal is a prompt (you can find one in <#${config.terminal}>). Interact with it to activate it depending on what you are looking for. You can also use **/akasha** to look for other features; they should be fairly self-explanatory. The important features are listed in the terminal, so if you are looking for something specific, check a terminal first.\n\n\n\n**You have reached the end of the tour!** We hope everything makes a bit more sense now, and we're confident you'll get used to everything as you spend time in HQ! Please ask any other questions you have; all of us are here to help and guide you and explain anything as needed. We hope you enjoy your stay!`,
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
                        custom_id: "::tour-page:0:a",
                        emoji: FIRST_PAGE,
                    },
                    {
                        type: ComponentType.Button,
                        style: ButtonStyle.Secondary,
                        custom_id: `::tour-page:${
                            (x + pages.length - 1) % pages.length
                        }:b`,
                        emoji: PREV_PAGE,
                    },
                    {
                        type: ComponentType.Button,
                        style: ButtonStyle.Secondary,
                        custom_id: `::tour-page:${(x + 1) % pages.length}:c`,
                        emoji: NEXT_PAGE,
                    },
                    {
                        type: ComponentType.Button,
                        style: ButtonStyle.Secondary,
                        custom_id: `::tour-page:${pages.length - 1}:d`,
                        emoji: LAST_PAGE,
                    },
                ],
            },
            {
                type: ComponentType.ActionRow,
                components: [
                    {
                        type: ComponentType.StringSelect,
                        custom_id: `::tour-jump`,
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
