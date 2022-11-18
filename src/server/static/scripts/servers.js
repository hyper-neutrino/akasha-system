function by_id() {
    let id;
    let message = "Enter the server ID.";

    do {
        id = prompt(message);
        if (!id) return;

        message =
            "Invalid server ID. Please enter the server ID (17-20 digit number).";
    } while (!id.match(/\d{17,20}/));

    window.location.href = `/servers/${id}`;
}
