import { ButtonStyle, ComponentType } from "discord.js";
import {
    ACCESS,
    ADVANCED,
    FAQ,
    FORUM,
    MUTE,
    PARTNER_LIST,
    PERMISSIONS,
    PREV_PAGE,
    TECHNICAL,
    TROUBLESHOOTING,
    VERIFICATION,
    WEBHOOK,
} from "./emoji.js";

const back = {
    type: ComponentType.Button,
    style: ButtonStyle.Secondary,
    custom_id: "::discord-help-home",
    emoji: PREV_PAGE,
    label: "BACK",
};

const permission_dropdown = {
    type: ComponentType.ActionRow,
    components: [
        {
            type: ComponentType.StringSelect,
            custom_id: "::discord-help",
            placeholder: "Select an option for further information.",
            options: [
                {
                    label: "Quick Troubleshooting",
                    value: "permissions/troubleshooting",
                    emoji: TROUBLESHOOTING,
                    description: "common issues and quick solutions",
                },
                {
                    label: "Verification Roles",
                    value: "permissions/verification",
                    emoji: VERIFICATION,
                    description: "learn how to set up verification roles",
                },
                {
                    label: "Access Roles",
                    value: "permissions/access",
                    emoji: ACCESS,
                    description:
                        "learn how to lock channels behind access roles",
                },
                {
                    label: "Mute Roles",
                    value: "permissions/mute",
                    emoji: MUTE,
                    description: "learn how to set up mute roles",
                },
                {
                    label: "Permission List",
                    value: "permissions/list",
                    emoji: PARTNER_LIST,
                    description:
                        "see a list of commonly misunderstood permissions",
                },
            ],
        },
    ],
};

const webhooks_dropdown = {
    type: ComponentType.ActionRow,
    components: [
        {
            type: ComponentType.StringSelect,
            custom_id: "::discord-help",
            placeholder: "Select an option for further information.",
            options: [
                {
                    label: "Quick Troubleshooting",
                    value: "webhooks/troubleshooting",
                    emoji: TROUBLESHOOTING,
                    description: "common issues and quick solutions",
                },
                {
                    label: "Advanced Embeds",
                    value: "webhooks/advanced-embeds",
                    emoji: ADVANCED,
                    description:
                        "learn how to decorate your embeds and make them look fancy",
                },
                {
                    label: "Webhook Technical Details",
                    value: "webhooks/technical",
                    emoji: TECHNICAL,
                    description:
                        "for those interested in how webhooks really work",
                },
                {
                    label: "Forum Webhooks",
                    value: "webhooks/forums",
                    emoji: FORUM,
                    description: "a guide to using webhooks in forums",
                },
            ],
        },
    ],
};

const permission_subpage = [
    permission_dropdown,
    {
        type: ComponentType.ActionRow,
        components: [
            {
                type: ComponentType.Button,
                style: ButtonStyle.Secondary,
                custom_id: "::discord-help:permissions",
                emoji: PREV_PAGE,
                label: "BACK",
            },
        ],
    },
];

const webhooks_subpage = [
    webhooks_dropdown,
    {
        type: ComponentType.ActionRow,
        components: [
            {
                type: ComponentType.Button,
                style: ButtonStyle.Secondary,
                custom_id: "::discord-help:webhooks",
                emoji: PREV_PAGE,
                label: "BACK",
            },
        ],
    },
];

export const pages = [
    {
        id: "permissions",
        label: "Permissions",
        emoji: PERMISSIONS,
        description: "Discord permission setup and troubleshooting",
        message: {
            embeds: [
                {
                    title: "**Discord Permissions**",
                    description:
                        "If you are completely unfamiliar with Discord permissions, the following official support articles may help: [Permissions FAQ](https://support.discord.com/hc/en-us/articles/206029707-Setting-Up-Permissions-FAQ) and [Permission Hierarchy Structure](https://support.discord.com/hc/en-us/articles/206141927).\n\nBefore starting on anything else, it is important to understand how permissions are calculated. Let's start with the simpler server-wide permissions; for example, **Ban Members**. This permission is not channel-dependent, so a user has this permission if any of their roles or @everyone has the permission.\n\nChannel permissions are more complex due to overrides. Firstly, @everyone and all of the member's roles are added up to determine if they have this permission by default. Then, overrides are calculated such that more specific ones apply first and allowing overrides denying. If the user has an override just for them, that always applies. Otherwise, if any of their roles are allowed, they are allowed. If any of their roles are denied, they are denied. Finally, if @everyone has an override, that will apply.\n\nMost importantly, note that allow overrides _always_ take priority. Thus, if your member role has **Send Messages** as an allow override, the mute role having **Send Messages** as a deny override will not work, even if the mute role is higher. **Overrides disregard role hierarchy!**\n\nFinally, a quick caveat of permissions - some permissions depend on others, but these usually make sense. For example, even with **Send Messages**, a user cannot send a message without the **View Channel** permissions (sometimes users can temporarily see channels they can't access if they were removed from it but the client hasn't updated, but they won't see new messages, can't send or delete messages or reactions, etc.)\n\nTherefore, it is important that you structure your roles and permissions to minimize allow overrides, as they often interfere with other things. Select an option below for help with how to set up things like mute roles, or for an explanation of what the permissions actually mean.",
                    color: 0x2d3136,
                },
            ],
            components: [
                permission_dropdown,
                { type: ComponentType.ActionRow, components: [back] },
            ],
        },
    },
    {
        hide: true,
        id: "permissions/troubleshooting",
        message: {
            embeds: [
                {
                    title: "**Discord Permissions**: Troubleshooting",
                    fields: [
                        {
                            name: "**Muted members can send messages.**",
                            value: "If it's in a thread or forum post, make sure **Send Messages in Threads/Posts** is denied on the parent channel. Make sure the override is actually set to deny sending permissions. If that is correct, see if any of the other roles have sending permissions allowed by override; if so, you will need to remove them, as recall that allow overrides surpass deny overrides.\n_ _\n_ _",
                        },
                        {
                            name: "**Verified users cannot see some channels.**",
                            value: "If you are using overrides to allow access, check the overrides for that channel. However, consider setting up verification roles using base role permissions instead of overrides (see the __Verification Roles__ page in the dropdown for how to set that up).\n_ _\n_ _",
                        },
                        {
                            name: "**Users can send images even though I locked it behind a level role.**",
                            value: "Firstly, check if the channel has any overrides that are allowing this permission. Secondly, note that the **Embed Links** permission needs to be disabled too otherwise users can upload their files to another website and then post the link instead. Finally, check all of your roles. A common mistake is to remove the permissions from @everyone and the verification role and lower level roles; however, sometimes people have other roles like pronoun roles, access roles, or vanity roles that have these permissions on them. In general, roles that exist just for overrides (mute, access) or for display (pronoun, vanity) should not have any permissions.\n_ _\n_ _",
                        },
                        {
                            name: "**My mods cannot timeout users.**",
                            value: "Make sure they have the timeout permission. If you never altered your permissions since timeouts were implemented, roles do not have that permission by default, so even if your mods can ban users, they may not be able to timeout users. Otherwise, note that admins cannot be timed out even if you are above them in hierarchy, and if all else fails, try updating or reinstalling your app since your client may be very outdated.\n_ _\n_ _",
                        },
                        {
                            name: "**My mod cannot take any moderation actions.**",
                            value: "This is likely **not** a permissions issue, actually. If your server has the 2FA moderation requirement on (all community servers are required to have it), they will not be able to moderate until they set up 2FA on their account. You can find this in **User Settings > My Account > Password and Authentication**. If this is set up properly, just make sure they have the right roles and those roles have the right permissions.",
                        },
                    ],
                    color: 0x2d3136,
                },
            ],
            components: permission_subpage,
        },
    },
    {
        hide: true,
        id: "permissions/verification",
        message: {
            embeds: [
                {
                    title: "**Discord Permissions**: How to set up verification roles",
                    description:
                        "> **TLDR**: Deny @everyone and allow your verification role **View Channels** in the base role permissions. Override @everyone to have **View Channels** for your landing channels (rules, etc.). New channels with no overrides will, by default, be visible only to verified users.\n\nThe purpose of a verification role is to only grant permissions to users once they have confirmed they've read the rules by clicking a button / reaction or following some other procedure. How you assign these roles is up to you - manual verification, a CAPTCHA system, just a reaction role, etc. This is a guide on how to set up the role itself to minimize struggling later on.\n\nTo meet the stated goal, users must not be able to see your channels (except the landing channels) until they have the verification role. There are two main ways that you can implement this. The first and more common is actually the worse of the two - set an @everyone override denying view access on your channels, and then set an override allowing it for the verified role. Recall that minimizing allow overrides is good design principle.\n\nThus, the better way is to deny @everyone the view channel permission on the role itself rather than via override, and allow it for the verified role. Now, all of your channels that have no overrides will meet your goal by default!\n\nThen, you just need to give @everyone an allow override to view your landing channels like welcome, rules, roles, etc. This is overall much cleaner and while it does not usually cause problems in this context to do it the first way, it reduces the number of overrides required for normal channels from 2 to 0, which can make things a lot simpler.\n\nIf you want a channel that is visible to everyone but only verified users can talk in, you can apply a similar concept and disable the send messages permission on @everyone and enable it on the verification role. Then, just use the view channel override to allow everyone to see the channel and they will have read-only access because they cannot talk without the role.\n\nFinally, if you want a channel that everyone can talk in, just use an override for @everyone. This is not a problem because role deny overrides take priority over any @everyone overrides, so your mute role still works correctly in these circumstances.",
                    color: 0x2d3136,
                },
            ],
            components: permission_subpage,
        },
    },
    {
        hide: true,
        id: "permissions/access",
        message: {
            embeds: [
                {
                    title: "**Discord Permissions**: How to set up access roles",
                    description:
                        "> **TLDR**: Deny @everyone and allow your access role **View Channels** via a channel override.\n\nIf you have a verification role, you _can_ deny it view permissions via an override. However, it's simpler to just deny it for @everyone. Remember that overrides take priority over base permissions, so even though role overrides surpass @everyone overrides, an @everyone override will still surpass the role's inherent permissions. If you have other roles with view permissions in the role itself, you would need to deny all of these via overrides, so using @everyone is easier and less error-prone.\n\nFor access roles, you will need to use a role allow override. Even though you should aim to minimize these, it is unavoidable here; just make sure that you do not enable any unnecessary permissions besides view permissions (for example, if you grant write permissions via an override, that will break your mute role).",
                    color: 0x2d3136,
                },
            ],
            components: permission_subpage,
        },
    },
    {
        hide: true,
        id: "permissions/mute",
        message: {
            embeds: [
                {
                    title: "**Discord Permissions**: How to set up mute roles",
                    description:
                        "> **TLDR**: __Consider using timeouts instead.__ To create a mute role, deny the role access to any permissions you want to remove via an override in __every__ channel where you want this to apply.\n\nFirstly, you should consider using Discord's timeouts instead. There are some pros and cons.\n\n**Pros**: No need to worry about permissions issues. The UI makes it obvious to the user that they were timed out and it is not a permission issue. You can easily identify timed out users as a moderator but normal members cannot tell.\n\n**Cons**: Being timed out blocks all permissions except view and read message history. Thus, timed out users cannot react to existing reactions (thus making them unable to use reaction roles) and also cannot interact with buttons or dropdowns.\n\nIf you have decided you want to use a mute role anyway, create a role and ideally remove its base permissions as it doesn't need any. Mute roles are done purely using overrides.\n\nNow comes the tedious part - you will need to deny each permission you want to block in every channel where you want the mute role to apply. You can skip read-only or staff channels, for example.\n\nYou should, at a minimum, deny the following:\n- Send Messages\n- Send Messages in Threads\n- Create Public/Private Threads, if your members have this permission\n- Add Reactions\n- Connect (if it is a voice channel or category)\n\nYou should also set these permissions on categories so they carry over to new channels that are created.",
                    color: 0x2d3136,
                },
            ],
            components: permission_subpage,
        },
    },
    {
        hide: true,
        id: "permissions/list",
        message: {
            embeds: [
                {
                    title: "**Discord Permissions**: List of commonly misunderstood permissions",
                    description:
                        "```fix\nAdministrator\n```\nAdmins have all permissions, have access to all channels, cannot be denied any permissions by overrides, and cannot be timed out. However, they do not bypass role hierarchy. Thus, they cannot ban people with equal or higher roles, cannot manage roles above their highest role, and can be kicked/banned by people with higher roles. Additionally, people with a higher role with **Manage Roles** can assign themselves the admin role even if they aren't an admin, so be careful with your role hierarchy. Bot roles cannot be added or removed, so you do not need to worry about issues there.\n\n```fix\nManage Channels\n```\nAllows you to create, edit, and delete channels, including changing channel properties (name, bitrate, region) and slowmode. This does not include editing permission overrides (see **Manage Roles**).\n\n```fix\nAdd Reactions\n```\nAllows you to add a new reaction to a message. Note that no permissions are needed to add to a reaction that is already on the message. Thus, **Add Reactions** should be disabled on reaction role channels so that users can only use the designated reactions and cannot add their own.\n\n```fix\nManage Messages\n```\nAllows you to delete, pin, publish, and strip embeds from messages. You can always delete, publish, and remove embeds from your own messages. Notably, you cannot edit other people's messages under any circumstances except for removing embeds. Note that this disregards role hierarchy, including ownership.\n\n```fix\nManage Roles\n```\nAllows you to edit a channel's permission overrides, but you cannot control overrides for permissions that you do not have. It also allows you to edit roles below your highest role, and add them to / remove them from members including yourself. Note that this is calculated based on the user's top role in general, **not** the highest role they have that has **Manage Roles**.\n\n```fix\n= Other Notes\n```\nMuting, deafening, and moving/disconnecting members in voice calls disregards role hierarchy. Also, since no permissions are checked when reacting to existing reactions, you do not need to give **Use External Emojis** for users to click on existing external emoji reactions (do note that users who are timed out or who have not completed membership screening cannot react at all).",
                    color: 0x2d3136,
                },
            ],
            components: permission_subpage,
        },
    },
    {
        id: "webhooks",
        label: "Webhooks and Embeds",
        emoji: WEBHOOK,
        description: "webhook and embed guide, tips, and tricks",
        message: {
            embeds: [
                {
                    title: "**Webhooks and Embeds**",
                    description:
                        "__This is just a summary! For a much more complete guide, check out [this guide](https://docs.google.com/document/d/1DhxUmV-jsXeETwi5Km7ifUBsG2Xw_vQf-YMeAGzbHVs/edit#).__",
                    color: 0x2d3136,
                    fields: [
                        {
                            name: "**What is a webhook?**",
                            value: "A webhook is a Discord entity that can post messages. Webhooks have a URL which allows anything with the URL to control it. **It is important to keep this URL secure.** Anyone with this URL can send messages through the webhook and edit or delete existing messages sent by the same webhook.\n_ _\n_ _",
                        },
                        {
                            name: "**How do I use a webhook?**",
                            value: "To create a webhook, go into the channel's settings, go to the Integrations tab, and click **Create Webhook** or go into the webhook list and click **New Webhook**. Once you have a webhook, you can change its avatar and name, which will be displayed in messages sent by this webhook unless overridden. To use the webhook, click **Copy Webhook URL** under the desired webhook. You can now use this for a variety of purposes, including but not limited to sending custom embeds or pasting it into other applications/services such as GitHub. Make sure you trust the application that you give your webhooks to!\n_ _\n_ _",
                        },
                        {
                            name: "**How do I post embeds?**",
                            value: "The most commonly used service in Genshincord is Discohook by far, so this guide will use it, but other services exist. To get started, visit https://discohook.org, or if you already have a Discohook share link from someone else, just use that. If you're unfamiliar with Discohook, go to the [home page](https://discohook.org) which contains some help information, or visit their support server. Editing the embed is fairly straightforward and you can see a preview on the right. Once you are ready to post, paste your webhook URL into the top part and click **Send**! To edit a message, paste the message link at the bottom and the button at the top should become **Edit**. Note that this only works if the same webhook posted the message. **Make sure you have the right webhook!**",
                        },
                    ],
                },
            ],
            components: [
                webhooks_dropdown,
                { type: ComponentType.ActionRow, components: [back] },
            ],
        },
    },
    {
        hide: true,
        id: "webhooks/troubleshooting",
        message: {
            embeds: [
                {
                    title: "**Webhooks and Embeds**: Troubleshooting",
                    color: 0x2d3136,
                    fields: [
                        {
                            name: "**My message isn't appearing when I try posting it.**",
                            value: "Make sure your webhook URL is correct. If you are sure it is, check the content to see if there are any issues. Discohook is not great with informing you of errors, but make sure all URLs (author image, footer image, etc.) are either valid or blank, all field names and values are not blank, and you are not exceeding the length limits specified [here](https://discordjs.guide/popular-topics/embeds.html#embed-limits). If none of these are wrong, you may have a privacy extension preventing Discohook from executing the webhook. Try using a private window or switching to another browser.\n_ _\n_ _",
                        },
                        {
                            name: "**My embeds are different widths.**",
                            value: "Embeds will only be as wide as they need to be. The exception is when there is an image - in that case, the embed's width is forced to be constant (though how wide depends on the image's aspect ratio). To align your embeds, you have two options. You can make each embed contain a long enough line such that the embed is pushed to its max width, or give every embed an image. If you don't want a visible image, you can use a 1000x1 transparent image such as this one: https://i.imgur.com/U9Wqlug.png.\n_ _\n_ _",
                        },
                        {
                            name: "**I can't find my webhook.**",
                            value: "Webhooks can be moved between channels. Go into **Server Settings > Integrations > Webhooks** and see if the webhook you're looking for is in a different channel than where you last put it. If it is not there, it was probably just deleted. You can just create a new one with the same image and name; you won't be able to edit old posts but otherwise it should be fine.\n_ _\n_ _",
                        },
                        {
                            name: "**I can't copy the webhook URL.**",
                            value: "You cannot manually operate webhooks that are owned by a bot (as opposed to a regular user). You can manipulate and delete it if needed but you cannot obtain its URL to post things.\n_ _\n_ _",
                        },
                        {
                            name: "**A member cannot see any embeds.**",
                            value: "Have them go into **User Settings > Text & Images** and enable __Show embeds and preview website links pasted into chat__. While they're here, it's a good idea to check __Show emoji reactions on messages__ as well; if you use reaction-based role prompts, they will need this setting enabled to see the reactions.",
                        },
                    ],
                },
            ],
            components: webhooks_subpage,
        },
    },
    {
        hide: true,
        id: "webhooks/advanced-embeds",
        message: {
            embeds: [
                {
                    title: "**Webhooks and Embeds**: Advanced Embeds",
                    color: 0x2d3136,
                    fields: [
                        {
                            name: "**Embed Color**",
                            value: "You should pick one embed color that you like and stick to it for most of your embeds for consistency. If you want the embed to appear colorless, use `0x2d3136`, which is the same color as the embed body (only in dark mode).",
                        },
                        {
                            name: "**Text Color**",
                            value: "You cannot color text by default, but you can use code block syntax highlighting to get a similar effect. Check out [this guide](https://docs.google.com/document/d/1tyBtgNfGc6ae7t033dFxdqCSfG9kgiuwrFxlJTvyuu8) for examples and how to get certain colors.",
                        },
                        {
                            name: "**Timestamps**",
                            value: "Discord doesn't make it very obvious that this feature exists, but you can show dates, both in absolute and relative time, to the user in their own timezone. The format is `<t:timestamp:format>`, and you can use [this website](https://r.3v.fi/discord-timestamps/) to generate these. For example, <t:1668531120:F> should display some time close to November 15th, 2022, and <t:1668531120:R> should display approximately how long ago that was.",
                        },
                        {
                            name: "**Embed Limits**",
                            value: "Discord places size limits on embeds.\n- The author name can be up to 256 characters.\n- The title can be up to 256 characters.\n- The description can be up to 4096 characters.\n- Field names must not be blank and can be up to 256 characters.\n- Field values must not be blank and can be up to 1024 characters.\n- The footer text can be up to 2048 characters and is not formatted.\n- The total length of the listed fields over all embeds in one message can be up to 6000 characters.\n- A message can have up to 10 embeds.\n- An embed can have up to 25 fields.",
                        },
                    ],
                },
            ],
            components: webhooks_subpage,
        },
    },
];

export const home = {
    embeds: [
        {
            title: "**Discord Help Center**",
            description:
                "If we don't have what you're looking for, don't hesitate to ask someone for help!",
            color: 0x2d3136,
        },
    ],
    components: [
        {
            type: ComponentType.ActionRow,
            components: [
                {
                    type: ComponentType.StringSelect,
                    custom_id: "::discord-help",
                    placeholder: "What do you need help with today?",
                    options: pages
                        .filter((page) => !page.hide)
                        .map((page) => ({
                            label: page.label,
                            value: page.id,
                            emoji: page.emoji,
                            description: page.description,
                        })),
                },
            ],
        },
    ],
};

export const page_map = new Map();
pages.forEach((page) => page_map.set(page.id, page));
