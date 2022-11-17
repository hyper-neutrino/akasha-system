import session from "cookie-session";
import express from "express";
import { res as resolve } from "file-ez";
import http from "http";
import multer from "multer";
import fetch from "node-fetch";
import pug from "pug";
import config from "../config.js";

const version = "?v=" + Math.floor(Math.random() * 1000000).toString();

const server = express();
server.use("/static", express.static(resolve("/static")));
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
            req.session.data !=
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
                        "This usually happens because your session expired or you accidentally altered the URL. It can also happen if you were subject to a <a href='https://en.wikipedia.org/wiki/Cross-site_request_forgery'>CSRF attack</a>. If you were brought to this website from another unofficial page and are getting this message, you should be careful with that website. Your account is not at risk; this message means the attack did not work. Navigate back to the home page and try logging in again if needed.",
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
                        "An unexpected error occurred when retrieving your data from Discord. Please try logging in again.",
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

    if (req.query.code) return res.redirect(302, "/");

    next();
});

server.get("/", (req, res) => {
    res.send(req.render("index.pug"));
});

http.createServer(server).listen(config.port);
