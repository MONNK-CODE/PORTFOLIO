// -----------------------------------
// CONFIGURATION
// -----------------------------------

const CACHE_TIME = 60 * 60 * 1000; // 1 hour
const STORAGE_KEY_PREFIX = "repoLangs::";
const API_ENDPOINT = "/api/github-langs";
const LANGUAGE_COLORS_FILE = "./language-colors.json";


// -----------------------------------
// LANGUAGE COLORS
// -----------------------------------

let languageColors = {};
let defaultLanguageColor = "#6c757d";


// -----------------------------------
// LOAD LANGUAGE COLORS
// -----------------------------------

async function loadLanguageColors() {

    try {

        const response = await fetch(LANGUAGE_COLORS_FILE);

        if (!response.ok) {
            throw new Error(
                "Could not load language colors."
            );
        }

        const data = await response.json();

        languageColors = data.languages || {};

        defaultLanguageColor =
            data.default || "#6c757d";

    } catch (error) {

        console.log(
            "Could not load language-colors.json:",
            error
        );
    }
}


// -----------------------------------
// GET LANGUAGE COLOR
// -----------------------------------

function getLanguageColor(language) {

    if (languageColors[language]) {
        return languageColors[language];
    }

    return defaultLanguageColor;
}


// -----------------------------------
// CHOOSE TEXT COLOR
// -----------------------------------

function getContrastText(hexColor) {

    if (!hexColor) {
        return "#ffffff";
    }

    let hex = hexColor.replace("#", "").trim();


    // Convert short hex like #fff
    // into #ffffff
    if (hex.length === 3) {

        let expandedHex = "";

        for (const character of hex) {
            expandedHex =
                expandedHex +
                character +
                character;
        }

        hex = expandedHex;
    }


    if (hex.length !== 6) {
        return "#ffffff";
    }


    const red =
        parseInt(
            hex.substring(0, 2),
            16
        );

    const green =
        parseInt(
            hex.substring(2, 4),
            16
        );

    const blue =
        parseInt(
            hex.substring(4, 6),
            16
        );


    const brightness =
        (0.299 * red) +
        (0.587 * green) +
        (0.114 * blue);


    if (brightness > 160) {
        return "#111111";
    }

    return "#ffffff";
}


// -----------------------------------
// CACHE KEY
// -----------------------------------

function getCacheKey(owner, repo) {

    return (
        STORAGE_KEY_PREFIX +
        owner +
        "/" +
        repo
    );
}


// -----------------------------------
// GET CACHED LANGUAGE DATA
// -----------------------------------

function getCachedLanguages(owner, repo) {

    try {

        const key =
            getCacheKey(owner, repo);

        const saved =
            localStorage.getItem(key);


        if (!saved) {
            return null;
        }


        const parsed =
            JSON.parse(saved);


        if (
            !parsed.data ||
            !parsed.timestamp
        ) {

            return null;
        }


        const age =
            Date.now() -
            parsed.timestamp;


        // Remove cache if older than 1 hour
        if (age > CACHE_TIME) {

            localStorage.removeItem(key);

            return null;
        }


        return parsed.data;

    } catch (error) {

        console.log(
            "Could not read cached GitHub language data:",
            error
        );

        return null;
    }
}


// -----------------------------------
// SAVE LANGUAGE DATA TO CACHE
// -----------------------------------

function saveCachedLanguages(
    owner,
    repo,
    data
) {

    try {

        const key =
            getCacheKey(owner, repo);


        const savedData = {

            data: data,

            timestamp: Date.now()
        };


        localStorage.setItem(
            key,
            JSON.stringify(savedData)
        );

    } catch (error) {

        console.log(
            "Could not save GitHub language data:",
            error
        );
    }
}


// -----------------------------------
// CLEAR AN ELEMENT
// -----------------------------------

function clearElement(element) {

    while (element.firstChild) {

        element.removeChild(
            element.firstChild
        );
    }
}


// -----------------------------------
// CREATE A LANGUAGE PILL
// -----------------------------------

function createLanguagePill(
    text,
    backgroundColor,
    textColor
) {

    const pill =
        document.createElement("li");


    pill.className =
        "lang-pill";


    pill.style.backgroundColor =
        backgroundColor;


    pill.style.color =
        textColor;


    pill.textContent =
        text;


    return pill;
}


// -----------------------------------
// SHOW "LANGUAGES N/A"
// -----------------------------------

function showLanguagesUnavailable(container) {

    clearElement(container);


    const backgroundColor =
        defaultLanguageColor;


    const textColor =
        getContrastText(
            backgroundColor
        );


    const pill =
        createLanguagePill(
            "Languages N/A",
            backgroundColor,
            textColor
        );


    container.appendChild(pill);
}


// -----------------------------------
// RENDER LANGUAGE PERCENTAGES
// -----------------------------------

function renderLanguagePercentages(
    container,
    data
) {

    clearElement(container);


    if (!data) {

        showLanguagesUnavailable(
            container
        );

        return;
    }


    const entries =
        Object.entries(data);


    if (entries.length === 0) {

        showLanguagesUnavailable(
            container
        );

        return;
    }


    // -----------------------------------
    // FIND TOTAL BYTES
    // -----------------------------------

    let totalBytes = 0;


    for (const entry of entries) {

        const bytes =
            Number(entry[1]);


        totalBytes =
            totalBytes +
            bytes;
    }


    if (totalBytes <= 0) {

        showLanguagesUnavailable(
            container
        );

        return;
    }


    // -----------------------------------
    // SORT BIGGEST LANGUAGE FIRST
    // -----------------------------------

    entries.sort(
        function (first, second) {

            const firstBytes =
                first[1];

            const secondBytes =
                second[1];


            return (
                secondBytes -
                firstBytes
            );
        }
    );


    // -----------------------------------
    // CREATE LANGUAGE PILLS
    // -----------------------------------

    for (const entry of entries) {

        const language =
            entry[0];

        const bytes =
            Number(entry[1]);


        const percentage =
            (
                bytes /
                totalBytes *
                100
            ).toFixed(1);


        const backgroundColor =
            getLanguageColor(
                language
            );


        const textColor =
            getContrastText(
                backgroundColor
            );


        const pillText =
            language +
            " " +
            percentage +
            "%";


        const pill =
            createLanguagePill(
                pillText,
                backgroundColor,
                textColor
            );


        container.appendChild(
            pill
        );
    }
}


// -----------------------------------
// FETCH LANGUAGE DATA FROM API
// -----------------------------------

async function fetchGitHubLanguages(
    owner,
    repo
) {

    const url =
        API_ENDPOINT +
        "?owner=" +
        encodeURIComponent(owner) +
        "&repo=" +
        encodeURIComponent(repo);


    const response =
        await fetch(url);


    if (!response.ok) {

        throw new Error(
            "GitHub language API failed with status " +
            response.status
        );
    }


    const data =
        await response.json();


    return data;
}


// -----------------------------------
// GET LANGUAGE DATA
// -----------------------------------

async function getGitHubLanguages(
    owner,
    repo
) {

    // Check cache first
    const cachedData =
        getCachedLanguages(
            owner,
            repo
        );


    if (cachedData) {
        return cachedData;
    }


    // No cache, fetch new data
    const data =
        await fetchGitHubLanguages(
            owner,
            repo
        );


    // Save fresh data
    saveCachedLanguages(
        owner,
        repo,
        data
    );


    return data;
}


// -----------------------------------
// UPDATE ONE PROJECT CARD
// -----------------------------------

async function updateProjectLanguages(card) {

    const owner =
        card.dataset.owner;


    const repo =
        card.dataset.repo;


    const languageStats =
        card.querySelector(
            ".language-stats"
        );


    // If this project does not have
    // GitHub repository information,
    // leave its manual tech tags alone.
    if (
        !owner ||
        !repo ||
        !languageStats
    ) {

        return;
    }


    try {

        const data =
            await getGitHubLanguages(
                owner,
                repo
            );


        renderLanguagePercentages(
            languageStats,
            data
        );

    } catch (error) {

        console.log(
            "Could not load languages for " +
            owner +
            "/" +
            repo +
            ":",
            error
        );


        showLanguagesUnavailable(
            languageStats
        );
    }
}


// -----------------------------------
// INITIALIZE PROJECT LANGUAGES
// -----------------------------------

function initializeProjectLanguages() {

    const projectCards =
        document.querySelectorAll(
            ".project-card[data-owner][data-repo]"
        );


    for (const card of projectCards) {

        updateProjectLanguages(card);
    }
}


// -----------------------------------
// PROJECT FILTERS
// -----------------------------------

function initializeFilters() {

    const filterButtons =
        document.querySelectorAll(
            ".filter-btn"
        );


    const projectCards =
        document.querySelectorAll(
            ".project-card"
        );


    if (
        filterButtons.length === 0 ||
        projectCards.length === 0
    ) {

        return;
    }


    for (const button of filterButtons) {

        button.addEventListener(
            "click",
            function () {

                let category =
                    button.dataset.filter;


                if (!category) {
                    category = "all";
                }


                // -----------------------
                // ACTIVE BUTTON
                // -----------------------

                for (
                    const otherButton
                    of filterButtons
                    ) {

                    if (
                        otherButton === button
                    ) {

                        otherButton
                            .classList
                            .add("active");

                        otherButton
                            .setAttribute(
                                "aria-pressed",
                                "true"
                            );

                    } else {

                        otherButton
                            .classList
                            .remove("active");

                        otherButton
                            .setAttribute(
                                "aria-pressed",
                                "false"
                            );
                    }
                }


                // -----------------------
                // FILTER CARDS
                // -----------------------

                for (
                    const card
                    of projectCards
                    ) {

                    let shouldShow = false;


                    if (category === "all") {

                        shouldShow = true;

                    } else if (
                        card.classList.contains(
                            category
                        )
                    ) {

                        shouldShow = true;
                    }


                    if (shouldShow) {

                        card.classList.remove(
                            "filtered"
                        );

                    } else {

                        card.classList.add(
                            "filtered"
                        );
                    }
                }
            }
        );
    }
}


// -----------------------------------
// SCROLL REVEAL ANIMATION
// -----------------------------------

function initializeScrollAnimations() {

    const cards =
        document.querySelectorAll(
            ".project-card"
        );


    if (cards.length === 0) {
        return;
    }


    const prefersReducedMotion =
        window
            .matchMedia(
                "(prefers-reduced-motion: reduce)"
            )
            .matches;


    // If user prefers less animation,
    // show everything immediately
    if (prefersReducedMotion) {

        for (const card of cards) {

            card.classList.add(
                "is-visible"
            );
        }

        return;
    }


    const observer =
        new IntersectionObserver(

            function (entries) {

                for (const entry of entries) {

                    if (
                        entry.isIntersecting
                    ) {

                        entry.target
                            .classList
                            .add(
                                "is-visible"
                            );


                        observer.unobserve(
                            entry.target
                        );
                    }
                }
            },

            {
                threshold: 0.12,

                rootMargin:
                    "0px 0px -6% 0px"
            }
        );


    for (const card of cards) {

        observer.observe(card);
    }
}


// -----------------------------------
// INITIALIZE PAGE
// -----------------------------------

async function init() {

    // Load language colors first
    await loadLanguageColors();


    // Load GitHub language breakdowns
    initializeProjectLanguages();


    // Set up project filters
    initializeFilters();


    // Set up scroll animations
    initializeScrollAnimations();
}


// -----------------------------------
// START
// -----------------------------------

document.addEventListener(
    "DOMContentLoaded",
    init
);