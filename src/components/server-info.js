import server_info from "../lib/server_info.js";

export default async function (modal) {
    await modal.deferReply({ ephemeral: true });

    await modal.editReply(
        await server_info(modal, modal.fields.getTextInputValue("id"))
    );
}
