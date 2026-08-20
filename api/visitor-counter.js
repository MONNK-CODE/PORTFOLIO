export default async function handler(req, res) {
    try {
        const response = await fetch(
            "https://api.counterapi.dev/v2/muhais-olatunduns-team-2519/first-counter-2519/up",
            {
                headers: {
                    Authorization: `Bearer ${process.env.COUNTER_API_TOKEN}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json(data);
        }

        return res.status(200).json({
            count: data.data.up_count
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: "Could not update visitor count"
        });
    }
}