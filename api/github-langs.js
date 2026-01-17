// api/github-langs.js
export default async function handler(req, res) {
    // CORS (restrict to my domain)
    const ORIGIN = req.headers.origin || "";
    const ALLOW_ORIGIN = /https?:\/\/(www\.)?muhais\.org$/i.test(ORIGIN) ? ORIGIN : "*";
    res.setHeader("Access-Control-Allow-Origin", ALLOW_ORIGIN);
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    if (req.method === "OPTIONS") return res.status(200).end();

    try {
        const token = process.env.GITHUB_TOKEN;
        if (!token) return res.status(500).json({ error: "Missing GITHUB_TOKEN env var" });

        const { owner, repo } = req.query || {};
        if (!owner || !repo) return res.status(400).json({ error: "owner and repo are required" });

        const url = `https://api.github.com/repos/${owner}/${repo}/languages`;
        const gh = await fetch(url, {
            headers: {
                "Accept": "application/vnd.github+json",
                "Authorization": `Bearer ${token}`,
                "User-Agent": "muhais.org language-proxy"
            }
        });

        // Forward GitHub’s status if not OK
        if (!gh.ok) {
            const text = await gh.text();
            return res
                .status(gh.status)
                .setHeader("Cache-Control", "no-store")
                .json({ error: "GitHub error", status: gh.status, body: text });
        }

        const data = await gh.json();

        res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=86400");
        return res.status(200).json(data);
    } catch (err) {
        return res.status(500).json({ error: err.message || "Proxy error" });
    }
}