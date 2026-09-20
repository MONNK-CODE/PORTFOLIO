
const CONFIG = {
  CACHE_TTL_MS: 24 * 60 * 60 * 1000,
  STORAGE_KEY_PREFIX: "repoLangs::",
  API_STAGGER_DELAY: 120,
  API_ENDPOINT: "/api/github-langs",
  LANGUAGE_COLORS_FILE: "./language-colors.json"
};



let LANG_COLORS = {};
let DEFAULT_LANG_COLOR = "#6c757d";


/* ===================================================
   FALLBACK LANGUAGES

   These are only used if the GitHub language
   API request fails.

   Successful API responses still display
   actual percentage breakdowns.
=================================================== */

const FALLBACK_LANGS = {
  "MONNK-CODE/PAY-CALCULATOR": [
    "JavaScript",
    "HTML",
    "CSS"
  ],

  "MONNK-CODE/GPA-CALCULATOR": [
    "JavaScript",
    "HTML",
    "CSS"
  ],

  "MONNK-CODE/NABA-WEBSITE": [
    "JavaScript",
    "HTML",
    "CSS"
  ],

  "MONNK-CODE/Premier-League-Analysis": [
    "Jupyter Notebook"
  ],

  "MONNK-CODE/Instant-Ayah": [
    "JavaScript",
    "HTML",
    "CSS"
  ],

  "CS196Illinois/FA24-Group1": [
    "JavaScript",
    "HTML",
    "CSS"
  ]
};


/* ===================================================
   LOAD LANGUAGE COLORS
=================================================== */

async function loadLanguageColors() {

  try {

    const response = await fetch(
        CONFIG.LANGUAGE_COLORS_FILE
    );


    if (!response.ok) {

      throw new Error(
          `Failed to load language colors: ${response.status}`
      );

    }


    const data = await response.json();


    LANG_COLORS =
        data.languages || {};


    DEFAULT_LANG_COLOR =
        data.default || "#6c757d";


  } catch (error) {

    console.warn(
        "Could not load language-colors.json. " +
        "Unknown languages will use the default gray color.",
        error
    );

  }

}


/* ===================================================
   COLOR HELPERS
=================================================== */


/*
   Automatically chooses dark or light text
   depending on the language pill background.
*/

function getContrastText(hexColor) {

  if (!hexColor) {
    return "#ffffff";
  }


  let hex =
      hexColor
          .replace("#", "")
          .trim();


  /* Convert short hex such as #fff */

  if (hex.length === 3) {

    hex =
        hex
            .split("")
            .map(character =>
                character + character
            )
            .join("");

  }


  /*
     If the value somehow isn't a normal
     6-character hex color, fall back to white.
  */

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


  /*
     Perceived brightness calculation.
  */

  const luminance =
      (0.299 * red) +
      (0.587 * green) +
      (0.114 * blue);


  return luminance > 160
      ? "#111111"
      : "#ffffff";

}


/*
   Gets a language color from JSON.
   Unknown languages use the default.
*/

function getLanguageColor(language) {

  return (
      LANG_COLORS[language] ||
      DEFAULT_LANG_COLOR
  );

}


/* ===================================================
   CACHE MANAGEMENT
=================================================== */

const CacheManager = {

  getKey(owner, repo) {

    return (
        `${CONFIG.STORAGE_KEY_PREFIX}` +
        `${owner}/${repo}`
    );

  },


  get(owner, repo) {

    try {

      const key =
          this.getKey(owner, repo);


      const raw =
          localStorage.getItem(key);


      if (!raw) {
        return null;
      }


      const parsed =
          JSON.parse(raw);


      const data =
          parsed.data;


      const timestamp =
          parsed.ts;


      if (!data || !timestamp) {
        return null;
      }


      const age =
          Date.now() - timestamp;


      /*
         Remove cache after 24 hours.
      */

      if (
          age >
          CONFIG.CACHE_TTL_MS
      ) {

        this.remove(
            owner,
            repo
        );

        return null;

      }


      return data;


    } catch (error) {

      console.warn(
          `Cache read error for ${owner}/${repo}:`,
          error
      );


      return null;

    }

  },


  set(owner, repo, data) {

    try {

      const key =
          this.getKey(
              owner,
              repo
          );


      const payload =
          JSON.stringify({
            data: data,
            ts: Date.now()
          });


      localStorage.setItem(
          key,
          payload
      );


    } catch (error) {

      console.warn(
          `Cache write error for ${owner}/${repo}:`,
          error
      );

    }

  },


  remove(owner, repo) {

    try {

      localStorage.removeItem(
          this.getKey(
              owner,
              repo
          )
      );


    } catch (error) {

      console.warn(
          `Cache removal error for ${owner}/${repo}:`,
          error
      );

    }

  }

};


/* ===================================================
   DOM UTILITIES
=================================================== */

const DOMUtils = {


  /*
     Creates one language pill.
  */

  createPill(
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

  },


  /*
     Removes everything currently
     inside a language list.
  */

  clearContainer(container) {

    while (
        container.firstChild
        ) {

      container.removeChild(
          container.firstChild
      );

    }

  },


  /*
     Used when the API fails and we only
     know the language names.

     Example:
     JavaScript
     HTML
     CSS
  */

  renderLanguageList(
      container,
      languages
  ) {

    this.clearContainer(
        container
    );


    if (
        !languages ||
        !languages.length
    ) {

      const background =
          DEFAULT_LANG_COLOR;


      const textColor =
          getContrastText(
              background
          );


      container.appendChild(

          this.createPill(
              "Languages N/A",
              background,
              textColor
          )

      );


      return;

    }


    const fragment =
        document.createDocumentFragment();


    languages.forEach(
        language => {

          const background =
              getLanguageColor(
                  language
              );


          const textColor =
              getContrastText(
                  background
              );


          fragment.appendChild(

              this.createPill(
                  language,
                  background,
                  textColor
              )

          );

        }
    );


    container.appendChild(
        fragment
    );

  },


  /*
     Converts GitHub's byte counts into
     percentages.

     Example API data:

     {
         "JavaScript": 94500,
         "HTML": 42000,
         "CSS": 31000
     }

     becomes:

     JavaScript 56.4%
     HTML 25.1%
     CSS 18.5%
  */

  renderLanguagePercentages(
      container,
      data
  ) {

    this.clearContainer(
        container
    );


    const entries =
        Object.entries(
            data || {}
        );


    if (!entries.length) {

      const background =
          DEFAULT_LANG_COLOR;


      container.appendChild(

          this.createPill(
              "Languages N/A",
              background,
              getContrastText(
                  background
              )
          )

      );


      return;

    }


    const totalBytes =
        entries.reduce(

            (
                total,
                [, bytes]
            ) => {

              return (
                  total +
                  Number(bytes)
              );

            },

            0

        );


    if (
        !totalBytes ||
        totalBytes <= 0
    ) {

      this.renderLanguageList(
          container,
          []
      );

      return;

    }


    /*
       Largest language appears first.
    */

    entries.sort(
        (
            [, bytesA],
            [, bytesB]
        ) => {

          return (
              bytesB -
              bytesA
          );

        }
    );


    const fragment =
        document.createDocumentFragment();


    entries.forEach(
        ([language, bytes]) => {

          const percentage =
              (
                  (
                      Number(bytes) /
                      totalBytes
                  ) *
                  100
              ).toFixed(1);


          const background =
              getLanguageColor(
                  language
              );


          const textColor =
              getContrastText(
                  background
              );


          fragment.appendChild(

              this.createPill(
                  `${language} ${percentage}%`,
                  background,
                  textColor
              )

          );

        }
    );


    container.appendChild(
        fragment
    );

  }

};


/* ===================================================
   GITHUB LANGUAGE API
=================================================== */

const GitHubLanguageService = {


  async fetchLanguages(
      owner,
      repo
  ) {

    const url =
        `${CONFIG.API_ENDPOINT}` +
        `?owner=${encodeURIComponent(owner)}` +
        `&repo=${encodeURIComponent(repo)}`;


    const response =
        await fetch(url);


    if (!response.ok) {

      throw new Error(
          `GitHub language API failed with status ${response.status}`
      );

    }


    return await response.json();

  },


  async getLanguagesWithCache(
      owner,
      repo
  ) {

    /*
       Check browser cache first.
    */

    const cached =
        CacheManager.get(
            owner,
            repo
        );


    if (cached) {

      return {
        data: cached,
        fromCache: true
      };

    }


    /*
       No cache found.
       Fetch fresh GitHub data.
    */

    const data =
        await this.fetchLanguages(
            owner,
            repo
        );


    /*
       Save it locally for next time.
    */

    CacheManager.set(
        owner,
        repo,
        data
    );


    return {
      data: data,
      fromCache: false
    };

  }

};


/* ===================================================
   PROJECT CARD LANGUAGE HANDLER
=================================================== */

const ProjectCardHandler = {


  async updateLanguages(card) {

    /*
       Repository information now lives in:

       data-owner="MONNK-CODE"
       data-repo="NABA-WEBSITE"

       instead of hidden <h3> elements.
    */

    const owner =
        card.dataset.owner;


    const repo =
        card.dataset.repo;


    const languageStats =
        card.querySelector(
            ".language-stats"
        );


    /*
       Projects without GitHub metadata
       may use manually written tech tags.

       Example:
       College Application Tracker.
    */

    if (
        !owner ||
        !repo ||
        !languageStats
    ) {

      return;

    }


    const fallbackKey =
        `${owner}/${repo}`;


    try {

      const result =
          await GitHubLanguageService
              .getLanguagesWithCache(
                  owner,
                  repo
              );


      DOMUtils
          .renderLanguagePercentages(
              languageStats,
              result.data
          );


    } catch (error) {

      console.warn(
          `Unable to load language percentages for ${fallbackKey}.`,
          error
      );


      /*
         If GitHub API fails,
         show the fallback language names.
      */

      const fallback =
          FALLBACK_LANGS[
              fallbackKey
              ];


      DOMUtils
          .renderLanguageList(
              languageStats,
              fallback
          );

    }

  },


  initializeAll() {

    /*
       Only select cards that actually
       contain repository metadata.
    */

    const cards =
        document.querySelectorAll(
            ".project-card[data-owner][data-repo]"
        );


    cards.forEach(
        (card, index) => {

          /*
             Small stagger prevents all
             repositories from hitting the
             API at exactly the same moment.
          */

          setTimeout(

              () => {

                this.updateLanguages(
                    card
                );

              },

              index *
              CONFIG.API_STAGGER_DELAY

          );

        }
    );

  }

};


/* ===================================================
   PROJECT FILTERS
=================================================== */

const FilterManager = {


  init() {

    const filterButtons =
        document.querySelectorAll(
            ".filter-btn"
        );


    const projectCards =
        document.querySelectorAll(
            ".project-card"
        );


    if (
        !filterButtons.length ||
        !projectCards.length
    ) {

      return;

    }


    filterButtons.forEach(
        button => {

          button.addEventListener(
              "click",
              () => {

                const category =
                    button.dataset.filter ||
                    "all";


                this.setActiveButton(
                    button,
                    filterButtons
                );


                this.filterProjects(
                    category,
                    projectCards
                );

              }
          );

        }
    );

  },


  setActiveButton(
      activeButton,
      allButtons
  ) {

    allButtons.forEach(
        button => {

          const isActive =
              button ===
              activeButton;


          button.classList.toggle(
              "active",
              isActive
          );


          button.setAttribute(
              "aria-pressed",
              isActive.toString()
          );

        }
    );

  },


  filterProjects(
      category,
      cards
  ) {

    cards.forEach(
        card => {

          const shouldShow =
              category === "all" ||
              card.classList.contains(
                  category
              );


          card.classList.toggle(
              "filtered",
              !shouldShow
          );

        }
    );

  }

};


/* ===================================================
   PROJECT CARD SCROLL ANIMATIONS
=================================================== */

const RevealManager = {


  init() {

    const cards =
        document.querySelectorAll(
            ".project-card"
        );


    if (!cards.length) {
      return;
    }


    /*
       Respect users who prefer
       reduced motion.
    */

    const prefersReducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;


    if (prefersReducedMotion) {

      cards.forEach(
          card => {

            card.classList.add(
                "is-visible"
            );

          }
      );


      return;

    }


    const observer =
        new IntersectionObserver(

            entries => {

              entries.forEach(
                  entry => {

                    if (
                        !entry.isIntersecting
                    ) {

                      return;

                    }


                    entry.target
                        .classList.add(
                        "is-visible"
                    );


                    /*
                       Once animated,
                       stop watching.
                    */

                    observer.unobserve(
                        entry.target
                    );

                  }
              );

            },

            {
              threshold: 0.12,
              rootMargin:
                  "0px 0px -6% 0px"
            }

        );


    cards.forEach(
        card => {

          observer.observe(
              card
          );

        }
    );

  }

};


/* ===================================================
   INITIALIZATION
=================================================== */

async function init() {

  /*
     Load color data first so the language
     pills have their correct colors before
     repository data is rendered.
  */

  await loadLanguageColors();


  /*
     Initialize filters.
  */

  FilterManager.init();


  /*
     Fetch repository language percentages.
  */

  ProjectCardHandler
      .initializeAll();


  /*
     Initialize card entrance animations.
  */

  RevealManager.init();

}


/* ===================================================
   START
=================================================== */

document.addEventListener(
    "DOMContentLoaded",
    init
);