import { MongoClient } from "mongodb";
import config from "./config.js";

const client = new MongoClient(config.mongo_uri);
await client.connect();

const db = client.db();

let f = db.collection;
f = f.bind(db);

export default f;
