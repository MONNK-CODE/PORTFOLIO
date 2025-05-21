const emailjs = require('@emailjs/nodejs');

exports.handler = async (event) => {
    try {
        const { first_name, last_name, email, message } = JSON.parse(event.body);

        const response = await emailjs.send(
            process.env.EMAILJS_SERVICE_ID,
            process.env.EMAILJS_TEMPLATE_ID,
            {
                first_name,
                last_name,
                email,
                message
            },
            {
                publicKey: process.env.EMAILJS_PUBLIC_KEY
            }
        );

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true }),
        };
    } catch (error) {
        console.error("Function error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ success: false, error: error.message }),
        };
    }
};