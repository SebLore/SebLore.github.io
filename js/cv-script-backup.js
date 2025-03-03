/**
 * This script is used to load translations from a JSON file and apply them to the page.
 * It also allows the user to toggle between English and Swedish translations.
 */

var translations = {}; // Store translations

// Load translations from the JSON file
function loadTranslations() {
  console.log("Loading translations...");
  fetch("CV/translations.json")
    .then((response) => response.json())
    .then((data) => {
      translations = data; // Store translations in global object
      console.log("Translations loaded successfully.");
      const language = getPreferredLanguage(); // Use language saved in localStorage or default to English
      applyLanguage(language);
      updateToggleLanguageButtonText();
    })
    .catch((error) => {
      console.error("Error loading translations:", error);
    });
  applyTheme(getPreferredTheme());
  applyLanguage(getPreferredLanguage());
  console.log("Page loaded and theme/language applied");
}
document.addEventListener("DOMContentLoaded", loadTranslations); // Load translations on page load

// Apply selected language's translations
function applyLanguage(lang) {
  if (lang === null || lang === undefined) {
    lang = "en";
  }
  if (!translations[lang]) {
    console.error(`Language not found: ${lang}`);
    return;
  } else {
    console.log(`Applying translations for ${lang}`);
  }
  // Apply translations to all elements with a data-key attribute
  document.querySelectorAll("[id]").forEach((element) => {
    const key = element.id;
    console.log(`Key: ${key}, Translation: ${translations[lang][key]}`);

    // check if it an array or a single string
    if (translations[lang][key]) {
      const value = translations[lang][key];

      if (Array.isArray(value)) {
        element.innerHTML = ""; // clear the element
        const ul = document.createElement("ul");
        ul.id = `${key}-list`;

        value.forEach((item) => {
          const li = document.createElement("li");
          li.textContent = item;
          ul.appendChild(li);
        });

        element.appendChild(ul);
      } else if (typeof value === "string") {
        element.textContent = value;
      }
    }
  });

  // Save the selected language to localStorage
  localStorage.setItem("language", lang);
  console.log(`Language set to ${lang}`);
}

// Add event listeners for language toggling
document.getElementById("toggle-language").addEventListener("click", () => {
  const currentLanguage = localStorage.getItem("language") || "en";
  const newLanguage = currentLanguage === "en" ? "sv" : "en"; // Toggle between English and Swedish
  applyLanguage(newLanguage);
  localStorage.setItem("language", newLanguage); // Save selected language
  console.log(`Language toggled to ${newLanguage}`);
});

/*
 *  Path: script.js
 */

const toggleThemeButton = document.getElementById("toggle-theme");
const toggleLanguageButton = document.getElementById("toggle-language");
updateToggleThemeButtonText();
updateToggleLanguageButtonText();

function getPreferredTheme() {
  if (localStorage.getItem("theme")) {
    return localStorage.getItem("theme");
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme) {
  document.documentElement.classList.remove("light-mode", "dark-mode");
  if (theme === "dark") {
    document.documentElement.classList.add("dark-mode");
  } else {
    document.documentElement.classList.add("light-mode");
  }
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

  if (!toggleThemeButton.innerHTML.includes("fa-sun") && !toggleThemeButton.innerHTML.includes("fa-moon")) {
    theme === "dark"
      ? (toggleThemeButton.innerHTML += '<i class="fas fa-sun"></i>')
      : (toggleThemeButton.innerHTML += '<i class="fas fa-moon"></i>');
  }

  theme === "dark"
    ? (toggleThemeButton.innerHTML = toggleThemeButton.innerHTML.replace("fa-moon", "fa-sun"))
    : (toggleThemeButton.innerHTML = toggleThemeButton.innerHTML.replace("fa-sun", "fa-moon"));
  console.log(`Toggle theme button text updated to ${theme}`);
}

toggleLanguageButton.addEventListener("click", () => {
  const currentLanguage = getPreferredLanguage();
  const newLanguage = currentLanguage === "en" ? "sv" : "en";
  document.documentElement.lang = newLanguage;
  updateToggleLanguageButtonText();
  updateLanguage();
  console.log(`Language toggled to ${newLanguage}`);
});

// get language from the html lang attribute
function getPreferredLanguage() {
  let language = localStorage.getItem("language");
  if (language === null) {
    console.log("No preferred language found in localStorage");
    language = "en";
    console.log(language);
    localStorage.setItem("language", language); // Set default language in localStorage
  }
  console.log(`Preferred language: ${language}`);
  return language;
}

function updateToggleLanguageButtonText() {
  if (!toggleLanguageButton.innerHTML.includes("sv") && !toggleLanguageButton.innerHTML.includes("en")) {
    toggleLanguageButton.innerHTML += localStorage.getItem("language");
    document.documentElement.lang = localStorage.getItem("language");
    return;
  }
  let preferred = getPreferredLanguage();
  if (preferred === "en") {
    toggleLanguageButton.innerHTML = toggleLanguageButton.innerHTML.replace("sv", "en");
  } else {
    toggleLanguageButton.innerHTML = toggleLanguageButton.innerHTML.replace("en", "sv");
  }
  console.log(`Toggle language button text updated to ${preferred}`);
}

// Update all language of the page
function updateLanguage() {
  const lang = getPreferredLanguage();
  const elements = document.querySelectorAll(`[data-${lang}]`);
  elements.forEach((element) => {
    element.innerHTML = element.dataset[lang];
  });
  console.log(`Language updated to ${lang}`);
}

// Apply the stored or system theme on page load
// applyTheme(getPreferredTheme());
// applyLanguage(getPreferredLanguage());
// console.log("Page loaded and theme/language applied");