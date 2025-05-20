const emailjs = require('@emailjs/nodejs');

exports.handler = async (event) => {
    try {
        const { first_name, last_name, email, message } = JSON.parse(event.body);

        // Initialize EmailJS with your private key from environment variables
        emailjs.init(process.env.EMAILJS_PRIVATE_KEY);

        const response = await emailjs.send(
            process.env.EMAILJS_SERVICE_ID,
            process.env.EMAILJS_TEMPLATE_ID,
            {
                first_name: first_name,
                last_name: last_name,
                email: email,
                message: message,
            }
        );

        console.log('Email sent successfully:', response.status, response.text);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Email sent successfully!' }),
        };
    } catch (error) {
        console.error('Error sending email:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to send email.' }),
        };
    }
};