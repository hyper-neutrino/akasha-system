import pages from "../lib/tour.js";

export default async function (cmd, index) {
    await cmd.update(pages[parseInt(index)]);
}
