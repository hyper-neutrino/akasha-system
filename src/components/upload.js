import { Colors, ComponentType, TextInputStyle } from "discord.js";
import { upload_cache_get } from "../lib/upload-cache.js";

export default async function (cmd, id, anon, key) {
    let data;

    if (key) {
        if (!(data = upload_cache_get(parseInt(key)))) {
            return {
                embeds: [
                    {
                        title: "**Timed Out**",
                        description:
                            "The time window elapsed for this action. Try again.",
                        colors: Colors.Red,
                    },
                ],
            };
        }
    }

    cmd.showModal({
        custom_id: `::complete-upload:${id}:${anon}`,
        title: id == "0" ? "Edit A Document" : "Upload A Document",
        components: [
            {
                type: ComponentType.ActionRow,
                components: [
                    {
                        type: ComponentType.TextInput,
                        label: "Space-separated user IDs",
                        style: TextInputStyle.Paragraph,
                        custom_id: "ids",
                        required: true,
                        value: data?.ids,
                    },
                ],
            },
            {
                type: ComponentType.ActionRow,
                components: [
                    {
                        type: ComponentType.TextInput,
                        label: "Document Link",
                        style: TextInputStyle.Short,
                        custom_id: "link",
                        placeholder: "URL to the document",
                        required: true,
                        max_length: 512,
                        value: data?.link,
                    },
                ],
            },
            {
                type: ComponentType.ActionRow,
                components: [
                    {
                        type: ComponentType.TextInput,
                        label: "Title",
                        style: TextInputStyle.Short,
                        custom_id: "title",
                        placeholder: 'e.g. "HyperNeutrino\'s bad dev skills"',
                        required: true,
                        max_length: 256,
                        value: data?.title,
                    },
                ],
            },
            {
                type: ComponentType.ActionRow,
                components: [
                    {
                        type: ComponentType.TextInput,
                        label: "Description",
                        style: TextInputStyle.Paragraph,
                        custom_id: "description",
                        placeholder:
                            'e.g. "This document shows why HyperNeutrino is bad at coding."',
                        required: true,
                        max_length: 1024,
                        value: data?.description,
                    },
                ],
            },
        ],
    });
}
