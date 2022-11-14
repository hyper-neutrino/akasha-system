import db from "../db.js";

export default async function (seq) {
    const document = await db("counters").findOneAndUpdate(
        { seq },
        { $inc: { val: 1 } },
        { upsert: true }
    );

    return (document.value?.val ?? 0) + 1;
}
