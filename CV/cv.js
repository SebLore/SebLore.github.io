/**
 * This script loads translations from a JSON file and applies them to the page.
 * It also allows users to toggle between English and Swedish translations.
 */

let translations = {}; // Store translations
let currentLang = getPreferredLanguage();
const toggleLanguageButton = document.getElementById("toggle-language");
const toggleThemeButton = document.getElementById("toggle-theme");
const info = document.getElementById("initial-info");
const cv_container = document.getElementById("cv-container");
const backbutton = document.getElementById("backbutton");


// Load translations from the JSON file
async function fetchTranslations() {
  console.log("Loading translations...");
  try {
    const response = await fetch("/cv/translations/translations.json");
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    translations = await response.json(); // Store translations globally
    console.log("Translations loaded successfully.");
  } catch (error) {
    console.error("Error loading translations:", error);
  }
}

// Apply selected language's translations
async function applyLanguage(lang) {
  if (!translations) {
    console.error("Translations not loaded");
    return;
  }

  currentLang = lang;

  document.querySelectorAll("[data-translate-key]").forEach((element) => {
    const key = element.getAttribute("data-translate-key");
    const value = translations[key]?.[currentLang];

    if (value) {
      if (Array.isArray(value)) {
        element.innerHTML = "";
        const ul = document.createElement("ul");
        value.forEach((item) => {
          const li = document.createElement("li");
          li.textContent = item;
          ul.appendChild(li);
        });
        element.appendChild(ul);
      }
      else {
        element.textContent = value;
      }
    }
  });

  localStorage.setItem("language", currentLang);
  document.documentElement.lang = currentLang;
  updateToggleLanguageButtonText(currentLang);
  console.log(`Language set to ${currentLang}`);
}

// Get preferred language (fallback to "en")
function getPreferredLanguage() {
  return localStorage.getItem("language") || "en";
}

// Update the toggle language button text using replace() after the first time
function updateToggleLanguageButtonText(currentLang) {
  toggleLanguageButton.textContent = currentLang === "en" ? "EN" : "SV";
  toggleLanguageButton.title = translations["toggle-language-tooltip"][currentLang];
}

/**
 * Gets the preferred theme from local storage or system settings.
 * @returns {string} The preferred theme ('light' or 'dark').
 */
function getPreferredTheme() {
  const localTheme = localStorage.getItem("theme");
  if (localTheme) {
    return localTheme;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme) {
  document.documentElement.classList.toggle("dark-mode", theme === "dark");
  document.documentElement.classList.toggle("light-mode", theme === "light");

  localStorage.setItem("theme", theme);
  updateToggleThemeButtonIcon(theme);
  console.log(`Theme applied: ${theme}`);
}

function updateToggleThemeButtonIcon(currentTheme) {
  toggleThemeButton.innerHTML = `<i class="fa fa-${currentTheme === "dark" ? "moon" : "sun"}"></i>`;
  toggleThemeButton.title = translations["toggle-theme-tooltip"][getPreferredLanguage()];
}

document.addEventListener("DOMContentLoaded", async () => {
  console.log("DOM content loaded");
  setTimeout(() => {
    info.style.opacity = "0";
    info.style.pointerEvents = "none";
  }, 4000);
  console.log("Initial info hidden after 5 seconds");

  await fetchTranslations();
  applyLanguage(getPreferredLanguage());
  applyTheme(getPreferredTheme());

  // make the top blurry
  cv_container.addEventListener("click", () => {
    info.style.opacity = "0";
    info.style.pointerEvents = "none";
    info.style.transition = "opacity 0.5s ease-in";
  });

  // Handle theme toggle click
  toggleThemeButton.addEventListener("click", () => {
    const currentTheme = getPreferredTheme();
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    applyTheme(newTheme);
  });

  // Handle language toggle click
  toggleLanguageButton.addEventListener("click", () => {
    const newLang = currentLang === "en" ? "sv" : "en";
    console.log(`newLang after click is ${newLang}`);
    applyLanguage(newLang);
    updateToggleThemeButtonIcon(getPreferredTheme()); // Update theme tooltip
  });

  // Handle initial info pop-up
  if (initialInfo) {
    setTimeout(() => {
      initialInfo.style.opacity = "0";
      initialInfo.style.pointerEvents = "none";
    }, 4000);
  }
});
