export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests are allowed' });
    }

    const { subscriber_email, subscriber_name } = req.body;
    const subscription_date = new Date().toLocaleString();

    const headers = {
        'Content-Type': 'application/json',
    };

    const templateId = process.env.EMAILJS_SUBSCRIBE_TEMPLATE_ID;

    const template_params = {
        subscriber_email,
        subscriber_name,
        subscription_date,
    };

    const baseBody = {
        service_id: process.env.EMAILJS_SERVICE_ID,
        template_id: templateId,
        user_id: process.env.EMAILJS_PUBLIC_KEY,
        accessToken: process.env.EMAILJS_PRIVATE_KEY,
        template_params,
    };

    try {
        // 1. Send welcome email to subscriber
        await fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers,
            body: JSON.stringify({
                ...baseBody,
                to_email: subscriber_email, // this overrides the template's default recipient
            }),
        });

        // 2. Send notification email to YOU
        await fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers,
            body: JSON.stringify({
                ...baseBody,
                // to_email: process.env.ADMIN_EMAIL,
            }),
        });

        return res.status(200).json({ success: true, message: 'Subscription and welcome sent!' });
    } catch (err) {
        console.error('Error sending emails:', err.message);
        return res.status(500).json({ success: false, error: err.message });
    }
}

console.log("Sending to subscriber:", subscriber_email);
console.log("Sending to admin:", process.env.ADMIN_EMAIL);
console.log("EmailJS payload:", JSON.stringify({...}));