import session from "cookie-session";
import { ButtonStyle, ComponentType } from "discord.js";
import escape from "escape-html";
import express from "express";
import { res as resolve } from "file-ez";
import http from "http";
import multer from "multer";
import fetch from "node-fetch";
import pug from "pug";
import client from "../client.js";
import config from "../config.js";
import db from "../db.js";
import {
    api_get_server,
    api_get_servers,
    api_get_user,
    api_get_users,
    api_is_council_member,
    api_is_observer,
} from "../lib/api.js";
import autoinc from "../lib/autoinc.js";
import { english_list, uniquify } from "../utils.js";

const version = "?v=" + Math.floor(Math.random() * 1000000).toString();

const server = express();
server.use("/static", express.static(resolve("static")));
server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.use(express.raw());
server.use(multer().array());

server.use(session({ name: "session", keys: config.session_keys }));

server.use(function (error, _req, res, _next) {
    console.error(error?.stack ?? error);
    res.status(500);
});

function save(req, data) {
    req.session.access_token = data.access_token;
    req.session.expires_at = new Date().getTime() + data.expires_in * 1000;
    req.session.refresh_token = data.refresh_token;
}

server.param("doc", async (req, res, next, doc) => {
    req.doc = await db("documents").findOne({ id: parseInt(doc) });

    if (!req.doc) {
        return res.status(404).send(
            req.render("error.pug", {
                title: "Document ID Invalid",
                header: "Document Not Found",
                description: `No document was found with ID <code>${escape(
                    doc
                )}</code>. <a href='/'>Return home</a>.`,
            })
        );
    }

    next();
});

server.param("server", async (req, _res, next, server) => {
    try {
        req.server = await api_get_server(server);
        req.owner =
            req.server.owner && (await client.users.fetch(req.server.owner));
        req.advisor =
            req.server.advisor &&
            (await client.users.fetch(req.server.advisor));
        req.server_type = "api";
    } catch {
        try {
            req.server = req.servers.filter((x) => x.id == server)[0];
            if (req.server) req.server_type = "oauth";
        } catch {}

        if (!req.server) {
            req.server = { name: `[${id}]`, id: server };
            req.server_type = "id";
        }
    }

    next();
});

server.param("user", async (req, _res, next, user) => {
    try {
        req.user = await client.users.fetch(user);
    } catch {
        req.user = { tag: `[${user}]`, id: user };
    }

    next();
});

server.use(async function (req, res, next) {
    req.session.flashes ??= [];

    req.flash = function (message, category) {
        req.session.flashes.push({ message, category });
    };

    req.render = function (file, options) {
        options ??= {};
        options.flashes = req.session.flashes ?? [];
        req.session.flashes = undefined;
        options.version = version;
        options.req = req;

        options.english_list = english_list;
        options.escape = escape;

        if (!req.session.state) {
            req.session.state = "";
            const n = Math.floor(Math.random() * 10);
            for (let x = 0; x < 10 + n; ++x) {
                req.session.state += String.fromCharCode(
                    33 + Math.floor(Math.random() * 94)
                );
            }
        }

        options.login_url = `https://discord.com/api/oauth2/authorize?client_id=${
            config.client.id
        }&redirect_uri=${encodeURIComponent(
            config.domain
        )}&response_type=code&scope=identify%20guilds&state=${Buffer.from(
            req.session.state,
            "utf-8"
        )
            .toString("base64")
            .replaceAll("+", "-")
            .replaceAll("/", "_")}`;

        options.user = req.session.user;

        return pug.renderFile(resolve(`templates/${file}`), options);
    };

    if (req.query.code) {
        req.session.user = undefined;

        if (
            req.session.state !=
            Buffer.from(
                req.query.state.replaceAll("_", "/").replaceAll("-", "+"),
                "base64"
            ).toString("utf-8")
        ) {
            return res.send(
                req.render("error.pug", {
                    title: "State Mismatch",
                    header: "State Mismatch",
                    description:
                        "This usually happens because your session expired or you accidentally altered the URL. It can also happen if you were subject to a <a href='https://en.wikipedia.org/wiki/Cross-site_request_forgery'>CSRF attack</a>. If you were brought to this website from another unofficial page and are getting this message, you should be careful with that website. Your account is not at risk; this message means the attack did not work. <a href='/'>Return to home</a>.",
                })
            );
        }

        const request = await fetch("https://discord.com/api/v8/oauth2/token", {
            method: "POST",
            body: new URLSearchParams({
                client_id: config.client.id,
                client_secret: config.client.secret,
                grant_type: "authorization_code",
                code: req.query.code,
                redirect_uri: config.domain,
            }),
        });

        if (!request.ok) {
            return res.send(
                req.render("error.pug", {
                    title: "Authentication Failure",
                    header: "Failed to authenticate",
                    description:
                        "An unexpected error occurred when retrieving your data from Discord. <a href='/'>Try again</a>.",
                })
            );
        }

        const data = await request.json();
        save(req, data);
    }

    if (
        !req.session.user &&
        req.session.expires_at &&
        new Date().getTime() > req.session.expires_at - 10000
    ) {
        const request = await fetch("https://discord.com/api/v8/oauth2/token", {
            method: "POST",
            body: new URLSearchParams({
                client_id: config.client.id,
                client_secret: config.client.secret,
                grant_type: "refresh_token",
                refresh_token: req.session.refresh_token,
            }),
        });

        if (request.ok) {
            const data = await request.json();
            save(req, data);
        }
    }

    if (!req.session.user && req.session.access_token) {
        const request = await fetch("https://discord.com/api/v8/users/@me", {
            headers: {
                Authorization: "Bearer " + req.session.access_token,
            },
        });

        req.session.user = await request.json();
    }

    if (req.session.access_token) {
        const request = await fetch(
            "https://discord.com/api/v8/users/@me/guilds",
            {
                headers: {
                    Authorization: "Bearer " + req.session.access_token,
                },
            }
        );

        const servers = await request.json();

        if (!Array.isArray(servers)) {
            req.session.user = undefined;
            return res.redirect(302, "/");
        }

        req.servers = servers.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (req.query.code) return res.redirect(302, "/");

    next();
});

async function require_login(req, res, next) {
    if (!req.session.user) return res.send(req.render("need-login.pug"));

    if (!(await api_is_council_member(req.session.user.id))) {
        return res.send(
            req.render("error.pug", {
                title: "Access Forbidden",
                header: "Permission Denied",
                description:
                    "You do not have the required credentials (you must be a TCN council member to access the Akasha System). <a href='/'>Log in on another account</a>.",
            })
        );
    }

    next();
}

async function require_edit(req, res, next) {
    if (
        req.session.user.id != req.doc.uploader &&
        !(await api_is_observer(req.session.user.id))
    ) {
        return res.send(
            req.render("error.pug", {
                title: "Access Forbidden",
                header: "Permission Denied",
                description:
                    "You must be the uploader of the document or an observer to edit this document.",
            })
        );
    }

    next();
}

server.get("/", require_login, (req, res) => {
    res.send(req.render("index.pug"));
});

server.get("/logout/", (req, res) => {
    req.session.user = undefined;

    req.session.access_token = undefined;
    req.session.expires_at = undefined;
    req.session.refresh_token = undefined;

    req.session.state = undefined;

    res.redirect(303, "/");
});

function unparse(doc) {
    return {
        authors: doc.authors.join(" "),
        alt_authors: doc.alt_authors.join("\n"),
        users: doc.users.join(" "),
        servers: doc.servers.join(" "),
        alt_related: doc.alt_related.join("\n"),
        title: doc.title,
        description: doc.description,
        link: doc.link,
    };
}

server.get("/upload/", require_login, async (req, res) => {
    res.send(
        req.render("upload.pug", {
            upload: true,
            doc: {},
            observer: await api_is_observer(req.session.user.id),
        })
    );
});

server.get("/edit/:doc", require_login, require_edit, async (req, res) => {
    res.send(
        req.render("upload.pug", { upload: false, doc: unparse(req.doc) })
    );
});

const IDS_PATTERN = /^\s*(\d{17,20}\s+)*(\d{17,20})?\s*$/;

function to_list(ids) {
    ids = ids.trim();
    if (!ids) return [];
    return uniquify(ids.split(/\s+/));
}

function by_lines(list) {
    return uniquify(
        list
            .split("\n")
            .map((x) => x.trim())
            .filter((x) => x)
    );
}

async function parse_upload(body) {
    const doc = {};

    if (!body.title) throw "Missing title.";
    if (body.title.length > 256) throw "Title exceeds length limit.";

    if (!body.description) throw "Missing description";

    if (body.description.length > 1024) {
        throw "Description exceeds length limit";
    }

    if (!body.link) throw "Missing link.";
    if (!body.link.match(/^https?:\/\//)) throw "Invalid link format.";

    try {
        await fetch(body.link);
    } catch {
        throw "Invalid link.";
    }

    if (!body.authors.match(IDS_PATTERN)) {
        throw "Author list does not look like a valid ID list.";
    }

    if (!body.users.match(IDS_PATTERN)) {
        throw "User list does not look like a valid ID list.";
    }

    if (!body.servers.match(IDS_PATTERN)) {
        throw "Server list does not look like a valid ID list.";
    }

    try {
        doc.authors = await Promise.all(
            to_list(body.authors).map(
                async (x) => (await client.users.fetch(x)).id
            )
        );
    } catch {
        throw "One or more listed authors was not a valid user ID.";
    }

    try {
        doc.users = await Promise.all(
            to_list(body.users).map(
                async (x) => (await client.users.fetch(x)).id
            )
        );
    } catch {
        throw "One or more listed related users was not a valid user ID.";
    }

    doc.servers = to_list(body.servers);

    doc.alt_authors = by_lines(body.alt_authors);
    doc.alt_related = by_lines(body.alt_related);

    doc.title = body.title;
    doc.description = body.description;
    doc.link = body.link;

    return doc;
}

server.post("/upload/", require_login, async (req, res) => {
    let doc;

    try {
        doc = await parse_upload(req.body);
    } catch (e) {
        req.flash(e, "ERROR");
        return res.send(
            req.render("upload.pug", { upload: true, doc: req.body })
        );
    }

    doc.uploader = req.session.user.id;
    doc.id = await autoinc("documents");
    doc.uploaded = new Date();
    doc.updated = new Date();

    db("documents").insertOne(doc);

    req.flash("Upload complete.", "SUCCESS");

    if (
        !Object.keys(req.body).includes("quiet") ||
        !(await api_is_observer(doc.uploader))
    ) {
        (async () => {
            try {
                client.channels.cache.get(config.business).send({
                    content: `A document was just uploaded by <@${doc.uploader}>. Check it out at ${doc.link}.`,
                    embeds: [
                        {
                            title: doc.title,
                            description: doc.description,
                            color: 0x2d3136,
                        },
                    ],
                    components: [
                        {
                            type: ComponentType.ActionRow,
                            components: [
                                {
                                    type: ComponentType.Button,
                                    style: ButtonStyle.Link,
                                    label: "View On Dashboard",
                                    url: `${config.domain}/docs/${doc.id}`,
                                },
                            ],
                        },
                    ],
                });
            } catch {}
        })();
    }

    res.redirect(303, `/docs/${doc.id}`);
});

server.post("/edit/:doc", require_login, require_edit, async (req, res) => {
    let doc;

    try {
        doc = await parse_upload(req.body);
    } catch (e) {
        req.flash(e, "ERROR");
        return res.send(
            req.render("upload.pug", { upload: false, doc: req.body })
        );
    }

    doc.updated = new Date();

    db("documents").findOneAndUpdate({ id: req.doc.id }, { $set: doc });

    req.flash("Edit complete.", "SUCCESS");

    res.redirect(303, `/docs/${req.doc.id}`);
});

function load(req) {
    return async (doc) => {
        doc.uploader = await userfetch(doc.uploader);

        doc.authors = await Promise.all(doc.authors.map(userfetch));
        doc.users = await Promise.all(doc.users.map(userfetch));
        doc.servers = await Promise.all(doc.servers.map(serverfetch(req)));

        return doc;
    };
}

server.get("/docs/", require_login, async (req, res) => {
    const docs = await Promise.all(
        (await db("documents").find({}).toArray()).map(load(req))
    );

    res.send(req.render("documents.pug", { docs }));
});

async function userfetch(id) {
    try {
        return await client.users.fetch(id);
    } catch {
        return { tag: `[user: ${id}]`, id, fake: true };
    }
}

function serverfetch(req) {
    return async (id) => {
        try {
            return await api_get_server(id);
        } catch {
            return (
                req.servers.filter((x) => x.id == id)[0] || {
                    name: `[server: ${id}]`,
                    id,
                    fake: true,
                }
            );
        }
    };
}

server.get("/docs/:doc", require_login, async (req, res) => {
    const doc = await load(req)(req.doc);

    res.send(
        req.render("document.pug", {
            doc,
            can_edit:
                req.session.user.id == doc.uploader.id ||
                (await api_is_observer(req.session.user.id)),
        })
    );
});

server.get("/servers/", require_login, async (req, res) => {
    const tcn = await api_get_servers();
    const ids = new Set(tcn.map((x) => x.id));

    res.send(
        req.render("servers.pug", {
            tcn,
            others: req.servers.filter((x) => !ids.has(x.id)),
        })
    );
});

server.get("/servers/:server", require_login, async (req, res) => {
    res.send(
        req.render("server.pug", {
            server: req.server,
            server_type: req.server_type,
            entry: await db("servers").findOne({ id: req.server.id }),
            docs: await Promise.all(
                (
                    await db("documents")
                        .find({ servers: { $in: [req.server.id] } })
                        .toArray()
                ).map(load(req))
            ),
        })
    );
});

function link(guild) {
    return `<a href='/servers/${guild.id}'><b>${escape(guild.name)}</b></a>`;
}

server.get("/users/:user", require_login, async (req, res) => {
    let body = "";

    const entry = await db("users").findOne({ user: req.user.id });

    if (req.user.bot) {
        if (entry) {
            body = `<h6>Bot Info <span class='grey-text'>for ${
                req.user.tag
            }</h6><br />${escape(entry.body).replace("\n", "<br />")}`;
        } else {
            body =
                "This user is a bot and is not recognized by the Akasha System.";
        }
    } else {
        let api_user;

        try {
            api_user = await api_get_user(req.user.id);
        } catch {}

        if (!api_user) {
            body += "(This user could not be found in the TCN API.)\n\n";
        } else {
            if (api_user.roles.includes("observer")) {
                body += "This user is a TCN observer.\n\n";
            }

            const staffs = [];

            for (const guild of await api_get_servers()) {
                if (guild.owner == req.user.id) {
                    body += `Server Owner of ${link(guild)}. `;
                } else if (guild.advisor == req.user.id) {
                    body += `Council Advisor of ${link(guild)}. `;
                } else if (api_user.guilds?.includes(guild.id)) {
                    staffs.push(link(guild));
                }
            }

            if (staffs.length) {
                staffs.sort();
                body += `${body ? "Also s" : "S"}taff in ${english_list(
                    staffs
                )}.`;
            }

            if (entry) {
                body += `<br /><br />${escape(entry.body).replace(
                    "\n",
                    "<br />"
                )}`;
            }
        }
    }

    res.send(
        req.render("user.pug", {
            body,
            main: await userfetch(
                (
                    await db("alts").findOne({ alt: req.user.id })
                )?.main
            ),
            alts: await Promise.all(
                (
                    await db("alts").find({ main: req.user.id }).toArray()
                ).map((entry) => userfetch(entry.alt))
            ),
        })
    );
});

http.createServer(server).listen(config.port);
