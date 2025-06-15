/**
 * This script loads translations from a JSON file and applies them to the page.
 * It also allows users to toggle between English and Swedish translations.
 */

var translations = {}; // Store translations

// Load translations from the JSON file
async function loadTranslations() {
  console.log("Loading translations...");

  try {
    const response = await fetch("/CV/translations-no-pg.json");
    translations = await response.json(); // Store translations globally
    console.log("Translations loaded successfully.");

    const language = getPreferredLanguage(); // Get saved or default language
    await applyLanguage(language); // Ensure translations are applied
    updateToggleLanguageButtonText();
  } catch (error) {
    console.error("Error loading translations:", error);
  }
  
  applyTheme(getPreferredTheme());
  console.log("Page loaded, theme and language applied.");
}

document.addEventListener("DOMContentLoaded", loadTranslations); // Load translations on page load

// Apply selected language's translations
async function applyLanguage(lang) {
  if (!lang) lang = "en"; // Default to English if undefined
  if (!translations[lang]) {
    console.error(`Language not found: ${lang}`);
    return;
  }

  console.log(`Applying translations for ${lang}`);

  document.querySelectorAll("[id]").forEach((element) => {
    const key = element.id;
    const value = translations[lang][key];

    if (value) {
      if (Array.isArray(value)) {
        element.innerHTML = "";
        const ul = document.createElement("ul");
        ul.id = `${key}-list`;

        value.forEach((item) => {
          const li = document.createElement("li");
          li.textContent = item;
          ul.appendChild(li);
        });

        element.appendChild(ul);
      } else {
        element.textContent = value;
      }
    }
  });

  // Save selected language
  localStorage.setItem("language", lang);
  document.documentElement.lang = lang;
  console.log(`Language set to ${lang}`);
}

// Language toggle button
const toggleLanguageButton = document.getElementById("toggle-language");

toggleLanguageButton.addEventListener("click", async () => {
  const newLanguage = getPreferredLanguage() === "en" ? "sv" : "en";

  await applyLanguage(newLanguage);
  updateToggleLanguageButtonText();
  console.log(`Language toggled to ${newLanguage}`);
});

// Get preferred language (fallback to "en")
function getPreferredLanguage() {
  let language = localStorage.getItem("language");
  if (!language) {
    language = "en"; // Default to English
    localStorage.setItem("language", language);
  }
  return language;
}

// Update the toggle language button text using replace() after the first time
function updateToggleLanguageButtonText() {
  const preferred = getPreferredLanguage();

  // Check if "en" or "sv" is already in the button
  if (!toggleLanguageButton.innerHTML.includes("en") && !toggleLanguageButton.innerHTML.includes("sv")) {
    // First-time update, append the language
    toggleLanguageButton.innerHTML += preferred;
  } else {
    // Subsequent updates, replace "en" with "sv" or vice versa
    console.log("preferred", preferred);
    toggleLanguageButton.innerHTML = toggleLanguageButton.innerHTML.replace(preferred === "en" ? "sv" : "en", preferred === "sv" ? "sv" : "en");
  }

  console.log(`Toggle language button updated to ${preferred}`);
}
updateToggleLanguageButtonText();

/*
 *  THEME TOGGLE FUNCTIONALITY
 */

// init button
const toggleThemeButton = document.getElementById("toggle-theme");
toggleThemeButton.innerHTML += getPreferredTheme() === "dark" ? "<i class=\"fa fa-moon\">" : "<i class=\"fa fa-sun\">";

// Ensure UI elements are updated correctly

function getPreferredTheme() {
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const localTheme = localStorage.getItem("theme");
  if (localTheme) 
    return localTheme;
  else if(mediaQuery.matches) {
    return "dark";
  }
  else
  return "light";
}

function applyTheme(theme) {
  document.documentElement.classList.remove("light-mode", "dark-mode");
  document.documentElement.classList.add(theme === "dark" ? "dark-mode" : "light-mode");
  
  localStorage.setItem("theme", theme);
  console.log(`Theme applied: ${theme}`);
}

toggleThemeButton.addEventListener("click", () => {
  const currentTheme = getPreferredTheme();
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  
  applyTheme(newTheme);
  updateToggleThemeButtonText();
  console.log(`Theme toggled to ${newTheme}`);
});

function updateToggleThemeButtonText() {
  const theme = getPreferredTheme();
  
  if(theme === "light"){
    toggleThemeButton.innerHTML = toggleThemeButton.innerHTML.replace("fa-moon", "fa-sun");
  } else {
    toggleThemeButton.innerHTML = toggleThemeButton.innerHTML.replace("fa-sun", "fa-moon");
  }
  
  console.log(`Toggle theme button text updated to ${theme}`);
}
updateToggleThemeButtonText();

// Update all language elements on the page
function updateLanguage() {
  const lang = getPreferredLanguage();
  document.querySelectorAll(`[data-${lang}]`).forEach((element) => {
    element.innerHTML = element.dataset[lang];
  });

  console.log(`Language updated to ${lang}`);
}

// initial info needs to be permanently gone after user clicks the first time, or after 5 seconds have elapsed
const info = document.getElementById("initial-info");
const cv_container = document.getElementById("cv-container");

cv_container.addEventListener("click", () => {
  info.style.opacity = "0";
  info.style.pointerEvents = "none";
  info.style.transition = "opacity 0.5s ease-in";
}
);

// timer counting down 3 seconds after domcontent loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM content loaded");
  setTimeout(() => {
    info.style.opacity = "0";
    info.style.pointerEvents = "none";
  }, 4000);
  console.log("Initial info hidden after 5 seconds");
});

window.onload() = function() {
  document.body.style.display = flex;
}
