let rateLimit = {}; // In-memory rate limit store

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Only POST requests are allowed" });
    }

    const { first_name, last_name, email, message, nickname } = req.body;

    // 1. Honeypot field check
    if (nickname && nickname.trim() !== "") {
        console.warn("Bot detected:", { first_name, last_name, email });
        return res.status(400).json({ success: false, error: "Bot detected" });
    }

    // 2. Basic validation
    const nameRegex = /^[A-Za-z\s'-]+$/;
    if (!nameRegex.test(first_name) || !nameRegex.test(last_name)) {
        return res.status(400).json({ success: false, error: "Invalid name format" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ success: false, error: "Invalid email address" });
    }

    if (!message || message.trim().length < 3) {
        return res.status(400).json({ success: false, error: "Message is too short" });
    }

    // 3. Simple in-memory rate limiter (resets every minute)
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const now = Date.now();

    if (!rateLimit[ip]) rateLimit[ip] = [];
    // Keep only timestamps from the last 60 seconds
    rateLimit[ip] = rateLimit[ip].filter((t) => now - t < 60_000);

    if (rateLimit[ip].length >= 5) {
        return res.status(429).json({ success: false, error: "Too many requests. Try again later." });
    }

    rateLimit[ip].push(now);

    // 4. Send through EmailJS
    try {
        const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                service_id: process.env.EMAILJS_SERVICE_ID,
                template_id: process.env.EMAILJS_TEMPLATE_ID,
                user_id: process.env.EMAILJS_PUBLIC_KEY,
                accessToken: process.env.EMAILJS_PRIVATE_KEY,
                template_params: {
                    firstName: first_name,
                    lastName: last_name,
                    emailAddress: email,
                    message: message,
                },
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("EmailJS Error Response:", errorText);
            return res.status(500).json({ success: false, error: errorText });
        }

        return res.status(200).json({ success: true });
    } catch (err) {
        console.error("Server Error:", err.message);
        return res.status(500).json({ success: false, error: err.message });
    }
}