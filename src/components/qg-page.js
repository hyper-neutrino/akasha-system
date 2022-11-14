import pages from "../lib/quick-guide.js";

export default async function (cmd, index) {
    await cmd.update(pages[parseInt(index)]);
}
