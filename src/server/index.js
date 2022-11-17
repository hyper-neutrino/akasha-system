import session from "cookie-session";
import express from "express";
import { res as resolve } from "file-ez";
import http, { Server } from "http";
import multer from "multer";
import fetch from "node-fetch";
import pug from "pug";
import client from "../client.js";
import config from "../config.js";
import db from "../db.js";
import autoinc from "../lib/autoinc.js";

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

function require_login(req, res, next) {
    if (!req.session.user) return res.send(req.render("need-login.pug"));
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

server.get("/upload/", require_login, (req, res) => {
    res.send(req.render("upload.pug", { upload: true, doc: {} }));
});

const IDS_PATTERN = /^\s*(\d{17,20}\s+)*\d{17,20}?\s*$/;

function to_list(ids) {
    ids = ids.trim();
    if (!ids) return [];
    return ids.split(/\s+/);
}

function by_lines(list) {
    return list
        .split("\n")
        .map((x) => x.trim())
        .filter((x) => x);
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
    }

    doc.uploader = req.session.user.id;
    doc.id = await autoinc("documents");

    await db("documents").insertOne(doc);

    req.flash("Upload complete.", "SUCCESS");

    req.redirect(303, `/docs/${doc.id}`);
});

http.createServer(server).listen(config.port);
