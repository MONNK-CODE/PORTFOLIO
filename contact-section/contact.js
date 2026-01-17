document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', async function (event) {
            event.preventDefault();

            const first_name = document.querySelector('[name="first_name"]').value;
            const last_name = document.querySelector('[name="last_name"]').value;
            const email = document.querySelector('[name="email"]').value;
            const message = document.querySelector('[name="message"]').value;

            // honeypot field to prevent spam
            const nickname   = document.querySelector('[name="nickname"]')?.value || "";

            try {
                const response = await fetch('/api/send-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ first_name, last_name, email, message }),
                });

                const result = await response.json();

                if (response.ok) {
                    swal({
                        title: 'Success!',
                        text: 'Your message has been sent successfully!',
                        icon: 'success',
                    });
                    form.reset();
                } else {
                    throw new Error(result.error || 'Failed to send the message.');
                }
            } catch (error) {
                console.error('Error:', error);
                swal({
                    title: 'Failed!',
                    text: 'Failed to send the message, please try again.',
                    icon: 'error',
                });
            }
        });
    } else {
        console.log('Form not found');
    }
});