/* ==============================
   Configuration & Constants
============================== */
const CONFIG = {
  CACHE_TTL_MS: 24 * 60 * 60 * 1000,
  STORAGE_KEY_PREFIX: "repoLangs::",
  API_STAGGER_DELAY: 120,
  API_ENDPOINT: "/api/github-langs"
};

const LANG_COLORS = {
  "JavaScript": { bg: "#f7df1e", text: "#000000" },
  "TypeScript": { bg: "#3178c6", text: "#ffffff" },
  "Python": { bg: "#FFD43B", text: "#306998" },
  "HTML": { bg: "#e34c26", text: "#ffffff" },
  "CSS": { bg: "#2965f1", text: "#ffffff" },
  "Kotlin": { bg: "#a97bff", text: "#000000" },
  "Java": { bg: "#b07219", text: "#ffffff" },
  "C": { bg: "#555555", text: "#ffffff" },
  "C++": { bg: "#00599c", text: "#ffffff" },
  "C#": { bg: "#178600", text: "#ffffff" },
  "Go": { bg: "#00add8", text: "#000000" },
  "Rust": { bg: "#dea584", text: "#000000" },
  "Swift": { bg: "#f05138", text: "#ffffff" },
  "PHP": { bg: "#777bb4", text: "#ffffff" },
  "Ruby": { bg: "#cc342d", text: "#ffffff" },
  "Shell": { bg: "#89e051", text: "#000000" },
  "Stata": { bg: "#1a5aa6", text: "#ffffff" }
};

const DEFAULT_LANG_COLOR = { bg: "#6c757d", text: "#ffffff" };

const FALLBACK_LANGS = {
  "MONNK-CODE/PAY-CALCULATOR": ["JavaScript", "HTML", "CSS"],
  "MONNK-CODE/GPA-CALCULATOR": ["JavaScript", "HTML", "CSS"],
  "MONNK-CODE/GuessMaster-WebApp": ["JavaScript", "HTML", "CSS"],
  "MONNK-CODE/Password-Generator-WebApp": ["JavaScript", "HTML", "CSS"],
  "MONNK-CODE/Instant-Ayah": ["JavaScript", "HTML", "CSS"],
  "MONNK-CODE/WAGE-CALCULATOR": ["Python"],
  "MONNK-CODE/RPS-GAME": ["JavaScript", "HTML", "CSS"],
  "MONNK-CODE/Random-Quote-Generator": ["JavaScript", "HTML", "CSS"],
  "MONNK-CODE/Calculator": ["JavaScript", "HTML", "CSS"],
  "MONNK-CODE/Trip-to-School": ["JavaScript", "HTML", "CSS"],
  "MONNK-CODE/GENRE-REMIX": ["JavaScript", "HTML", "CSS"],
  "MONNK-CODE/DANGERS-OF-SODA-WEBSITE-FIRST-PROJECT": ["HTML", "CSS"],
  "MONNK-CODE/Stock-Simulator": ["JavaScript", "HTML", "CSS"],
  "MONNK-CODE/NABA-WEBSITE": ["JavaScript", "HTML", "CSS"],
  "CS196Illinois/FA24-Group1": ["JavaScript", "HTML", "CSS"]
};

/* ==============================
   Cache Management
============================== */
const CacheManager = {
  getKey(owner, repo) {
    return `${CONFIG.STORAGE_KEY_PREFIX}${owner}/${repo}`;
  },

  get(owner, repo) {
    try {
      const raw = localStorage.getItem(this.getKey(owner, repo));
      if (!raw) return null;

      const { data, ts } = JSON.parse(raw);
      if (!data || !ts) return null;
      if (Date.now() - ts > CONFIG.CACHE_TTL_MS) {
        this.remove(owner, repo);
        return null;
      }
      return data;
    } catch (error) {
      console.warn(`Cache read error for ${owner}/${repo}:`, error);
      return null;
    }
  },

  set(owner, repo, data) {
    try {
      const payload = JSON.stringify({ data, ts: Date.now() });
      localStorage.setItem(this.getKey(owner, repo), payload);
    } catch (error) {
      console.warn(`Cache write error for ${owner}/${repo}:`, error);
    }
  },

  remove(owner, repo) {
    try {
      localStorage.removeItem(this.getKey(owner, repo));
    } catch (error) {
      console.warn(`Cache remove error for ${owner}/${repo}:`, error);
    }
  }
};

/* ==============================
   DOM Utilities
============================== */
const DOMUtils = {
  createPill(text, bg, color) {
    const pill = document.createElement('li');
    pill.className = 'lang-pill';
    pill.style.backgroundColor = bg;
    pill.style.color = color;
    pill.textContent = text;
    return pill;
  },

  clearContainer(container) {
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
  },

  renderLanguageList(container, langs) {
    this.clearContainer(container);

    if (!langs?.length) {
      container.appendChild(
          this.createPill('Languages N/A', DEFAULT_LANG_COLOR.bg, DEFAULT_LANG_COLOR.text)
      );
      return;
    }

    const fragment = document.createDocumentFragment();
    langs.forEach(lang => {
      const { bg, text } = LANG_COLORS[lang] || DEFAULT_LANG_COLOR;
      fragment.appendChild(this.createPill(lang, bg, text));
    });
    container.appendChild(fragment);
  },

  renderLanguagePercentages(container, data) {
    this.clearContainer(container);

    const entries = Object.entries(data);
    if (!entries.length) {
      container.appendChild(
          this.createPill('Languages N/A', DEFAULT_LANG_COLOR.bg, DEFAULT_LANG_COLOR.text)
      );
      return;
    }

    const totalBytes = entries.reduce((sum, [, bytes]) => sum + bytes, 0);
    const fragment = document.createDocumentFragment();

    entries
        .sort(([, a], [, b]) => b - a)
        .forEach(([lang, bytes]) => {
          const pct = ((bytes / totalBytes) * 100).toFixed(1);
          const { bg, text } = LANG_COLORS[lang] || DEFAULT_LANG_COLOR;
          fragment.appendChild(this.createPill(`${lang} ${pct}%`, bg, text));
        });

    container.appendChild(fragment);
  }
};

/* ==============================
   API Service
============================== */
const GitHubLanguageService = {
  async fetchLanguages(owner, repo) {
    const url = `${CONFIG.API_ENDPOINT}?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Failed to fetch languages for ${owner}/${repo}:`, error);
      throw error;
    }
  },

  async getLanguagesWithCache(owner, repo) {
    const cached = CacheManager.get(owner, repo);
    if (cached) return { data: cached, fromCache: true };

    const data = await this.fetchLanguages(owner, repo);
    CacheManager.set(owner, repo, data);
    return { data, fromCache: false };
  }
};

/* ==============================
   Project Card Handler
============================== */
const ProjectCardHandler = {
  async updateLanguages(card) {
    const titleEl = card.querySelector('.card-title');
    const ownerEl = card.querySelector('.card-owner');
    const languageStatsEl = card.querySelector('.language-stats');

    if (!titleEl || !ownerEl || !languageStatsEl) return;

    const repo = titleEl.textContent.trim();
    const owner = ownerEl.textContent.trim();
    const fallbackKey = `${owner}/${repo}`;

    if (!repo || !owner) return;

    try {
      const { data } = await GitHubLanguageService.getLanguagesWithCache(owner, repo);
      DOMUtils.renderLanguagePercentages(languageStatsEl, data);
    } catch (error) {
      const fallback = FALLBACK_LANGS[fallbackKey];
      DOMUtils.renderLanguageList(languageStatsEl, fallback);
    }
  },

  async initializeAll() {
    const cards = document.querySelectorAll('.project-card');

    cards.forEach((card, index) => {
      setTimeout(
          () => this.updateLanguages(card),
          index * CONFIG.API_STAGGER_DELAY
      );
    });
  }
};

/* ==============================
   Filter Functionality
============================== */
const FilterManager = {
  init() {
    const filterButtons = document.querySelectorAll(".filter-btn");
    const projectCards = document.querySelectorAll(".project-card");

    filterButtons.forEach(button => {
      button.addEventListener("click", () => {
        this.setActiveButton(button, filterButtons);
        this.filterProjects(button.textContent.trim().toLowerCase(), projectCards);
      });
    });
  },

  setActiveButton(activeButton, allButtons) {
    allButtons.forEach(btn => btn.classList.remove("active"));
    activeButton.classList.add("active");
  },

  filterProjects(category, cards) {
    cards.forEach(card => {
      const shouldShow = category === "all" || card.classList.contains(category);
      card.classList.toggle("filtered", !shouldShow);
    });
  }
};

/* ==============================
   Initialization
============================== */
function init() {
  FilterManager.init();
  ProjectCardHandler.initializeAll();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}