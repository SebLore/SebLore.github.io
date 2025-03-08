var navbarContent = document.getElementById("navItems");

function toggleMenu () {
    if(navbarContent.style.display !== "flex") {
        navbarContent.style.display = "flex";
        navbarContent.style.flexDirection = "row";
    } else {
        navbarContent.style.display = "none";
    }
}

let lastScrollY = window.scrollY;
const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {
    if (window.scrollY > lastScrollY) {
        // Scrolling down
        navbar.style.transform = "translateY(-100%)";
    } else {
        // Scrolling up
        navbar.style.transform = "translateY(0)";
    }
    lastScrollY = window.scrollY;
});
