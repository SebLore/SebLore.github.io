var navbarContent = document.getElementById("navItems");

function toggleMenu () {
    if(navbarContent.style.display !== "flex") {
        navbarContent.style.display = "flex";
        navbarContent.style.flexDirection = "row";
    } else {
        navbarContent.style.display = "none";
    }
}

/**
 * Toggle the visibility of the navbar when the user scrolls up or down
 * and move the page content up or down accordingly.
 */
let lastScrollY = window.scrollY;
const navbar = document.querySelector(".navbar");
const page = document.querySelector(".page");

window.addEventListener("scroll", () => {
    if (window.scrollY > lastScrollY) {
        // Scrolling down
        navbar.style.transform = "translateY(-100%)";
        const offset = navbar.offsetHeight;
        // page.style.transform = `translateY(-${offset}px)`;
    } else {
        // Scrolling up
        navbar.style.transform = "translateY(0)";
        // page.style.transform = "translateY(0)";
    }
    lastScrollY = window.scrollY;
});