var navbarContent = document.getElementById("navItems");

function toggleMenu () {
    if(navbarContent.style.display !== "flex") {
        navbarContent.style.display = "flex";
        navbarContent.style.flexDirection = "row";
    } else {
        navbarContent.style.display = "none";
    }
}