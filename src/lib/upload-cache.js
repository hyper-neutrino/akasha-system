const cache = new Map();
let key = 0;

export function upload_cache_save(data) {
    cache.set(key, data);

    setTimeout(
        (
            (k) => () =>
                cache.delete(k)
        )(key),
        15 * 60 * 1000
    );

    return key++;
}

export function upload_cache_get(key) {
    return cache.get(key);
}
