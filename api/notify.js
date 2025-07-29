export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests are allowed' });
    }

    try {
        const response = await fetch(
            "https://script.google.com/macros/library/d/1FVSv42vszAmK4obu4haIbN0bdiP0XrxSPrsbAAOb26AgAxsVRFXnBdLt/2",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(req.body),
            }
        );

        const result = await response.text();

        if (!response.ok) {
            return res.status(500).json({ success: false, error: result });
        }

        return res.status(200).json({ success: true, message: result });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}