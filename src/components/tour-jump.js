import pages from "../lib/tour.js";

export default async function (cmd) {
    await cmd.update(pages[parseInt(cmd.values[0])]);
}
