export const config = {
    api: {
        bodyParser: true, // Vercel parses body automatically
    },
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST allowed' });
    }

    const { first_name, last_name, email, message } = req.body;

    try {
        const emailRes = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
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

        if (!emailRes.ok) {
            const errorText = await emailRes.text();
            console.error("EmailJS Error Response:", errorText);
            return res.status(500).json({ success: false, error: errorText });
        }

        return res.status(200).json({ success: true });
    } catch (err) {
        console.error("Server Error:", err.message);
        return res.status(500).json({ success: false, error: err.message });
    }
}
console.log("EMAILJS_PUBLIC_KEY =", process.env.EMAILJS_PUBLIC_KEY);