/* ==============================
   Language color pills
============================== */
const LANG_COLORS = {
  "JavaScript":   { bg: "#f7df1e", text: "#000000" },
  "TypeScript":   { bg: "#3178c6", text: "#ffffff" },
  "Python":       { bg: "#3776ab", text: "#ffffff" },
  "HTML":         { bg: "#e34c26", text: "#ffffff" },
  "CSS":          { bg: "#2965f1", text: "#ffffff" },
  "Kotlin":       { bg: "#a97bff", text: "#000000" },
  "Java":         { bg: "#b07219", text: "#ffffff" },
  "C":            { bg: "#555555", text: "#ffffff" },
  "C++":          { bg: "#00599c", text: "#ffffff" },
  "C#":           { bg: "#178600", text: "#ffffff" },
  "Go":           { bg: "#00add8", text: "#000000" },
  "Rust":         { bg: "#dea584", text: "#000000" },
  "Swift":        { bg: "#f05138", text: "#ffffff" },
  "PHP":          { bg: "#777bb4", text: "#ffffff" },
  "Ruby":         { bg: "#cc342d", text: "#ffffff" },
  "Shell":        { bg: "#89e051", text: "#000000" },
  "Stata":        { bg: "#1a5aa6", text: "#ffffff" },
  "Google Sheets":{ bg: "#0f9d58", text: "#ffffff" }
};
const DEFAULT_LANG_COLOR = { bg: "#6c757d", text: "#ffffff" };

/* ==============================
   Static fallback (labels only)
   Used if API/proxy fails
============================== */
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
  "CS196Illinois/FA24-Group1": ["JavaScript", "HTML", "CSS"]
};

/* ==============================
   Local cache (24h) to minimize calls
============================== */
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const STORAGE_KEY_PREFIX = "repoLangs::";

function storageKey(owner, repo) {
  return `${STORAGE_KEY_PREFIX}${owner}/${repo}`;
}
function getCached(owner, repo) {
  try {
    const raw = localStorage.getItem(storageKey(owner, repo));
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    if (!data || !ts) return null;
    if (Date.now() - ts > CACHE_TTL_MS) return null;
    return data;
  } catch { return null; }
}
function setCached(owner, repo, data) {
  try {
    localStorage.setItem(storageKey(owner, repo), JSON.stringify({ data, ts: Date.now() }));
  } catch {}
}

/* ==============================
   DOM helpers
============================== */
function createPill(text, bg, color) {
  const pill = document.createElement('li');
  pill.className = 'lang-pill';
  pill.style.backgroundColor = bg;
  pill.style.color = color;
  pill.textContent = text;
  return pill;
}

function renderFromList(container, langs) {
  container.innerHTML = '';
  if (!langs || !langs.length) {
    container.appendChild(createPill('Languages N/A', DEFAULT_LANG_COLOR.bg, DEFAULT_LANG_COLOR.text));
    return;
  }
  langs.forEach(lang => {
    const { bg, text } = (LANG_COLORS[lang] || DEFAULT_LANG_COLOR);
    container.appendChild(createPill(lang, bg, text));
  });
}

function renderPercentages(container, data) {
  container.innerHTML = '';
  const totals = Object.values(data);
  if (!totals.length) {
    container.appendChild(createPill('Languages N/A', DEFAULT_LANG_COLOR.bg, DEFAULT_LANG_COLOR.text));
    return;
  }
  const totalBytes = totals.reduce((a, b) => a + b, 0);
  Object.keys(data).forEach(key => {
    const pct = ((data[key] / totalBytes) * 100).toFixed(1);
    const { bg, text } = (LANG_COLORS[key] || DEFAULT_LANG_COLOR);
    container.appendChild(createPill(`${key} ${pct}%`, bg, text));
  });
}

/* ==============================
   Fetch via Vercel proxy (no client token)
============================== */
async function fetchRepoLanguages(cardTitleElement, cardOwnerElement) {
  const repoName = cardTitleElement?.textContent?.trim();
  const owner    = cardOwnerElement?.textContent?.trim();
  if (!repoName || !owner) return;

  const card = cardTitleElement.closest('.project-card');
  const languageStatsElement = card?.querySelector('.language-stats');
  if (!languageStatsElement) return;

  const key = `${owner}/${repoName}`;

  // Prefer cached API results
  const cached = getCached(owner, repoName);
  if (cached) {
    renderPercentages(languageStatsElement, cached);
    return;
  }

  try {
    const resp = await fetch(`/api/github-langs?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repoName)}`);
    if (!resp.ok) {
      // Proxy/GitHub error → fallback labels
      return renderFromList(languageStatsElement, FALLBACK_LANGS[key]);
    }
    const data = await resp.json();
    setCached(owner, repoName, data);
    renderPercentages(languageStatsElement, data);
  } catch {
    // Network error → fallback labels
    renderFromList(languageStatsElement, FALLBACK_LANGS[key]);
  }
}

/* ==============================
   Load languages for each card on window load
============================== */
window.onload = () => {
  const cards = document.querySelectorAll('.project-card');
  let idx = 0;
  cards.forEach(card => {
    const titleEl = card.querySelector('.card-title');
    const ownerEl = card.querySelector('.card-owner');
    if (titleEl && ownerEl) {
      // small stagger just to smooth things out
      setTimeout(() => fetchRepoLanguages(titleEl, ownerEl), idx * 120);
      idx++;
    }
  });
};

/* ==============================
   Filtering logic
============================== */
document.addEventListener("DOMContentLoaded", function() {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards  = document.querySelectorAll(".project-card");

  filterButtons.forEach(button => {
    button.addEventListener("click", function() {
      const category = this.textContent.trim().toLowerCase();
      projectCards.forEach(card => {
        if (category === "all" || card.classList.contains(category)) {
          card.classList.remove("filtered");
        } else {
          card.classList.add("filtered");
        }
      });
    });
  });
});

document.addEventListener("DOMContentLoaded", function() {
  const filterButtons = document.querySelectorAll(".filter-btn");
  filterButtons.forEach(button => {
    button.addEventListener("click", function() {
      filterButtons.forEach(btn => btn.classList.remove("active"));
      this.classList.add("active");
    });
  });
});