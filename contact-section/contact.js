document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('contactForm');

    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();

            const firstName = document.querySelector('[name="first_name"]').value;
            const lastName = document.querySelector('[name="last_name"]').value;
            const emailAddress = document.querySelector('[name="email"]').value;
            const message = document.querySelector('[name="message"]').value;

            fetch("/api/send-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    first_name: firstName,
                    last_name: lastName,
                    email: emailAddress,
                    message: message,
                }),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.success) {
                        swal("Success!", "Your message has been sent!", "success");
                        form.reset();
                    } else {
                        swal("Oops!", "Something went wrong. Try again later.", "error");
                    }
                })
                .catch((error) => {
                    console.error(error);
                    swal("Error!", "Something went wrong. Try again.", "error");
                });
        });
    } else {
        console.log("Form not found.");
    }
});