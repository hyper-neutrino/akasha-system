$(document).ready(function () {
    M.AutoInit();

    $(".collapsible.expandable").collapsible({ accordion: false });

    $(".charcount").characterCounter();

    $(".flash").each(function () {
        const category = this.getAttribute("data-category");
        M.toast({
            html: this.innerHTML,
            classes:
                category == "ERROR"
                    ? "red"
                    : category == "SUCCESS"
                    ? "green"
                    : category == "WARNING"
                    ? "yellow darken-3"
                    : "grey",
        });
    });

    update();
});

function update() {
    M.updateTextFields();
    $("textarea").each((_, e) => M.textareaAutoResize(e));
}

function user_by_id() {
    let id;
    let message = "Enter the user ID.";

    do {
        id = prompt(message);
        if (!id) return;

        message =
            "Invalid user ID. Please enter the user ID (17-20 digit number).";
    } while (!id.match(/\d{17,20}/));

    window.location.href = `/users/${id}`;
}
