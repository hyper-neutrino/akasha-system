import pages from "../lib/quick-guide.js";

export default async function (cmd) {
    await cmd.update(pages[parseInt(cmd.values[0])]);
}
