/**
 * This script is used to load translations from a JSON file and apply them to the page.
 * It also allows the user to toggle between English and Swedish translations.

 */

var translations = {}; // Store translations

// Load translations from the JSON file
function loadTranslations() {
  fetch("translations.json")
    .then((response) => response.json())
    .then((data) => {
      translations = data; // Store translations in global object
      const language = localStorage.getItem("language") || getPreferredLanguage(); // Use language saved in localStorage or default to English
      applyLanguage(language);
    })
    .catch((error) => {
      console.error("Error loading translations:", error);
    });
}
// Apply selected language's translations
function applyLanguage(lang) {
  if (!translations[lang]) {
    console.error(`Language not found: ${lang}`);
    return
  } else {
  console.log(`Applying translations for ${lang}`);
  }
  // Apply translations to all elements with a data-key attribute
  document.querySelectorAll("[id]").forEach((element) => {
    // console.log(element);
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

      } else if (typeof (value) === "string") {
        element.textContent = value;
      }
    }
  });

  // Save the selected language to localStorage
  localStorage.setItem("language", lang);
}

// Add event listeners for language toggling
document.getElementById("toggle-language").addEventListener("click", () => {
  const currentLanguage = localStorage.getItem("language") || "en";
  const newLanguage = currentLanguage === "en" ? "sv" : "en"; // Toggle between English and Swedish
  applyLanguage(newLanguage);
  localStorage.setItem("language", newLanguage); // Save selected language
});

document.addEventListener("DOMContentLoaded", loadTranslations); // Load translations on page load

/*
*  Path: script.js
*/

const toggleThemeButton = document.getElementById("toggle-theme");
const toggleLanguageButton = document.getElementById("toggle-language");
updateToggleThemeButtonText();
updateToggleLanguageButtonText();

// get all skill-level class items
const skillLevelItems = document.querySelectorAll(".skill-level");

// for each skillLevelFill container, set the width of the fill to the value of the innerHTML,
// with 0 being none and 100 being 100% width
function skillLevelFill() {
  skillLevelItems.forEach((item) => {
    const level = item.querySelector(".skill-level-fill").innerHTML;
    fill.style.width = level;
  });
}

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
}





toggleThemeButton.addEventListener("click", () => {
  const currentTheme = getPreferredTheme();
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  applyTheme(newTheme);
  updateToggleThemeButtonText();
});

function updateToggleThemeButtonText() {
    // get preferred theme
    const theme = getPreferredTheme();
    
    if(!toggleThemeButton.innerHTML.includes("fa-sun") && !toggleThemeButton.innerHTML.includes("fa-moon")) {
      theme === "dark" 
      ? toggleThemeButton.innerHTML += '<i class="fas fa-sun"></i>' 
      : toggleThemeButton.innerHTML += '<i class="fas fa-moon"></i>';  
    }

    theme === "dark"
    ? (toggleThemeButton.innerHTML = toggleThemeButton.innerHTML.replace("fa-moon", "fa-sun"))
    : (toggleThemeButton.innerHTML = toggleThemeButton.innerHTML.replace("fa-sun", "fa-moon"));
}

// function updateToggleThemeButtonText() {
//   if (!toggleThemeButton.innerHTML.includes("🌙") && !toggleThemeButton.innerHTML.includes("☀️")) {
//     toggleThemeButton.innerHTML += "🌙";
//   }
//   getPreferredTheme() === "dark"
//     ? (toggleThemeButton.innerHTML = toggleThemeButton.innerHTML.replace("🌙", "☀️"))
//     : (toggleThemeButton.innerHTML = toggleThemeButton.innerHTML.replace("☀️", "🌙"));
// }



toggleLanguageButton.addEventListener("click", () => {
  const currentLanguage = getPreferredLanguage();
  const newLanguage = currentLanguage === "en" ? "sv" : "en";
  document.documentElement.lang = newLanguage;
  updateToggleLanguageButtonText();
  updateLanguage();
});

// get language from the html lang attribute
function getPreferredLanguage() {
  return document.documentElement.lang;
}


function updateToggleLanguageButtonText() {
  if (!toggleLanguageButton.innerHTML.includes("sv") && !toggleLanguageButton.innerHTML.includes("en")) {
    toggleLanguageButton.innerHTML += "en";
  }
  getPreferredLanguage() === "en"
    ? toggleLanguageButton.innerHTML = toggleLanguageButton.innerHTML.replace("sv", "en")
    : toggleLanguageButton.innerHTML = toggleLanguageButton.innerHTML.replace("en", "sv");
}

// Update all language of the page
function updateLanguage() {
  const lang = getPreferredLanguage();
  // const lang = language === "en" ? "en" : "sv";
  const elements = document.querySelectorAll(`[data-${lang}]`);
  elements.forEach((element) => {
    element.innerHTML = element.dataset[lang];
  });

}

// Apply the stored or system theme on page load
applyTheme(getPreferredTheme());
applyLanguage(getPreferredLanguage());