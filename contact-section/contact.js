document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('contactForm');

    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();

            const data = {
                first_name: document.querySelector('[name="first_name"]').value,
                last_name: document.querySelector('[name="last_name"]').value,
                email: document.querySelector('[name="email"]').value,
                message: document.querySelector('[name="message"]').value,
            };

            fetch('/.netlify/functions/send-contact-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })
                .then(async res => {
                    const contentType = res.headers.get("content-type") || "";
                    const isJson = contentType.includes("application/json");
                    const body = isJson ? await res.json() : {};

                    if (res.ok && body.success) {
                        swal("Success!", "Your message has been sent successfully!", "success");
                        form.reset();
                    } else {
                        swal("Failed!", body.error || "Something went wrong on the server.", "error");
                    }
                })
                .catch(err => {
                    console.error("Fetch error:", err);
                    swal("Failed!", "Unexpected error occurred. Please try again.", "error");
                });
        });
    } else {
        console.log("Form not found. Make sure it has id='contactForm'");
    }
});