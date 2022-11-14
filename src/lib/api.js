import fetch from "node-fetch";
import config from "../config.js";

export async function api(route, ...args) {
    const response = await fetch(
        `https://api.teyvatcollective.network${route}${args
            .map((x) => `/${x}`)
            .join("")}`,
        { headers: { Authorization: config.api_token } }
    );

    if (!response.ok) {
        throw `API did not return OK:\n- route: ${route}\n- args: ${JSON.stringify(
            args
        )}\n- ${response.status}: ${response.statusText}`;
    }

    return await response.json();
}

export async function api_get_user(id) {
    return await api("/users", id);
}

export async function api_is_council_member(id) {
    const user = await api_get_user(id);
    return user.roles.includes("owner") || user.roles.includes("advisor");
}

export async function api_is_observer(id) {
    try {
        return (await api_get_user(id)).roles.includes("observer");
    } catch {
        return false;
    }
}

export async function api_get_users() {
    return await api("/users");
}

export async function api_get_servers() {
    return await api("/guilds");
}

export async function api_get_observers() {
    return (await api_get_users()).filter((user) =>
        user.roles.includes("observer")
    );
}
