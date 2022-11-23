let unlocked = false;

for (const doc of docs) {
    doc.title = doc.title.toLowerCase();
    doc.description = doc.description.toLowerCase();
    doc.author_ids = doc.authors.map((x) => x.id);
    doc.alt_authors = [
        ...doc.authors.filter((x) => !x.fake).map((x) => x.tag.toLowerCase()),
        ...doc.alt_authors.map((x) => x.toLowerCase()),
    ];
    doc.user_ids = doc.users.map((x) => x.id);
    doc.server_ids = doc.servers.map((x) => x.id);
    doc.alt_related = [
        ...doc.users.filter((x) => !x.fake).map((x) => x.tag.toLowerCase()),
        ...doc.servers
            .filter((x) => !x.fake)
            .map((x) => [x.name.toLowerCase(), ...(x.character ? [x.character.toLowerCase()] : [])])
            .flat(),
        ...doc.alt_related.map((x) => x.toLowerCase()),
    ];
}

let search, authors, related, uploader;

function uniquify(x) {
    return [...new Set(x)];
}

function to_list(x) {
    return uniquify(
        x
            .trim()
            .split(/\s+/)
            .filter((x) => x.match(/^\d{17,20}$/))
    );
}

function by_lines(x) {
    return uniquify(
        x
            .toLowerCase()
            .split("\n")
            .map((x) => x.trim())
            .filter((x) => x)
    );
}

$(document).ready(function () {
    search = $("#search").val().toLowerCase();
    authors = by_lines($("#authors").val());
    related = by_lines($("#related").val());
    uploader = to_list($("#uploader").val());

    if (
        $("#search").val() ||
        $("#authors").val() ||
        $("#related").val() ||
        $("#uploader").val()
    ) {
        M.Collapsible.getInstance($("#filters")).open();
    }

    update(true);

    $("#search").on("input", function () {
        search = this.value.toLowerCase();
        update();
    });

    $("#authors").on("input", function () {
        authors = by_lines(this.value);
        update();
    });

    $("#related").on("input", function () {
        related = by_lines(this.value);
        update();
    });

    $("#uploader").on("input", function () {
        uploader = to_list(this.value);
        update();
    });
});

function update(unlock) {
    if (unlock) unlocked = true;
    if (!unlocked) return;

    let keep = docs;

    if (search) {
        keep = keep.filter(
            (doc) =>
                doc.title.indexOf(search) != -1 ||
                doc.description.indexOf(search) != -1
        );
    }

    if (authors.length) {
        keep = keep.filter((doc) =>
            authors.every(
                (author) =>
                    doc.author_ids.includes(author) ||
                    doc.alt_authors.some((x) => x.indexOf(author) != -1)
            )
        );
    }

    if (related.length) {
        keep = keep.filter((doc) =>
            related.every(
                (party) =>
                    doc.user_ids.includes(party) ||
                    doc.server_ids.includes(party) ||
                    doc.alt_related.some((x) => x.indexOf(party) != -1)
            )
        );
    }

    if (uploader.length) {
        keep = keep.filter((doc) => uploader.includes(doc.uploader.id));
    }

    const ids = new Set(keep.map((doc) => `${doc.id}`));

    $(".doc").each(
        (_, x) => (
            ($x = $(x)), ids.has($x.attr("data-id")) ? $x.show() : $x.hide()
        )
    );

    $("#results").html(
        `Returned ${ids.size} result${ids.size == 1 ? "" : "s"}.`
    );
}
