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
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    first_name: firstName,
                    last_name: lastName,
                    email: emailAddress,
                    message: message,
                }),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.success) {
                        swal({
                            title: "Success!",
                            text: "Your message has been sent successfully!",
                            icon: "success",
                        });
                        form.reset();
                    } else {
                        swal({
                            title: "Failed!",
                            text: "Failed to send the message, please try again.",
                            icon: "error",
                        });
                        console.error("Server Error:", data.error);
                    }
                })
                .catch((error) => {
                    console.error("Unexpected Error:", error);
                    swal({
                        title: "Error!",
                        text: "Something went wrong while sending your message.",
                        icon: "error",
                    });
                });
        });
    } else {
        console.log("Form not found.");
    }
});