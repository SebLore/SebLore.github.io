var navbarContent = document.getElementById("navItems");

function toggleMenu () {
    if(navbarContent.style.display !== "none") {
        navbarContent.style.display = "none";
    } else {
        navbarContent.style.display = "flex";
    }
}