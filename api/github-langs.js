// api/github-langs.js
export default async function handler(req, res) {

    // CORS (restrict to my domain)

    const origin = req.headers.origin || "";

    const allowedOrigins = [
        "https://muhais.org",
        "https://www.muhais.org",
        "http://localhost:63342"
    ];

    if (allowedOrigins.includes(origin)) {

        res.setHeader(
            "Access-Control-Allow-Origin",
            origin
        );
    }


    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, OPTIONS"
    );


    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type"
    );

    if (req.method === "OPTIONS") {

        return res
            .status(200)
            .end();
    }

    try {

        // -----------------------------------
        // GITHUB TOKEN
        // -----------------------------------

        const token =
            process.env.GITHUB_TOKEN;


        if (!token) {

            return res
                .status(500)
                .json({
                    error:
                        "Missing GITHUB_TOKEN environment variable"
                });
        }


        // -----------------------------------
        // GET REPOSITORY INFORMATION
        // -----------------------------------

        const owner =
            req.query.owner;


        const repo =
            req.query.repo;


        if (!owner || !repo) {

            return res
                .status(400)
                .json({
                    error:
                        "owner and repo are required"
                });
        }


        // -----------------------------------
        // GITHUB API URL
        // -----------------------------------

        const url =
            "https://api.github.com/repos/" +
            encodeURIComponent(owner) +
            "/" +
            encodeURIComponent(repo) +
            "/languages";


        // -----------------------------------
        // REQUEST GITHUB
        // -----------------------------------

        const githubResponse =
            await fetch(
                url,
                {
                    headers: {

                        "Accept":
                            "application/vnd.github+json",

                        "Authorization":
                            "Bearer " + token,

                        "User-Agent":
                            "muhais.org language-proxy"
                    }
                }
            );


        // -----------------------------------
        // GITHUB ERROR
        // -----------------------------------

        if (!githubResponse.ok) {

            const message =
                await githubResponse.text();


            res.setHeader(
                "Cache-Control",
                "no-store"
            );


            return res
                .status(githubResponse.status)
                .json({
                    error: "GitHub error",
                    status: githubResponse.status,
                    body: message
                });
        }


        // -----------------------------------
        // GITHUB DATA
        // -----------------------------------

        const data =
            await githubResponse.json();


        // Cache successful responses
        // for 5 minutes
        res.setHeader(
            "Cache-Control",
            "s-maxage=300, stale-while-revalidate=600"
        );


        return res
            .status(200)
            .json(data);


    } catch (error) {

        return res
            .status(500)
            .json({
                error:
                    error.message ||
                    "Proxy error"
            });
    }
}