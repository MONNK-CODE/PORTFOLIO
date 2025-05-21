document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', async function (event) {
            event.preventDefault();

            const firstName = document.querySelector('[name="first_name"]').value;
            const lastName = document.querySelector('[name="last_name"]').value;
            const emailAddress = document.querySelector('[name="email"]').value;
            const message = document.querySelector('[name="message"]').value;

            try {
                const response = await fetch('/api/send-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ firstName, lastName, emailAddress, message }),
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