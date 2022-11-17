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
