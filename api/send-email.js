export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { first_name, last_name, email, message } = req.body;

    try {
        const emailRes = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                service_id: process.env.EMAILJS_SERVICE_ID,
                template_id: process.env.EMAILJS_TEMPLATE_ID,
                user_id: process.env.EMAILJS_PUBLIC_KEY,
                template_params: {
                    first_name,
                    last_name,
                    email,
                    message,
                },
            }),
        });

        let data;
        try {
            data = await emailRes.json();
        } catch (err) {
            const text = await emailRes.text();
            console.error("Non-JSON response from EmailJS:", text);
            return res.status(500).json({ success: false, error: text });
        }

        if (emailRes.ok) {
            return res.status(200).json({ success: true });
        } else {
            console.error("EmailJS Error:", data);
            return res.status(500).json({ success: false, error: data });
        }
    } catch (err) {
        console.error("Unexpected Server Error:", err.message);
        return res.status(500).json({ success: false, error: err.message });
    }
}