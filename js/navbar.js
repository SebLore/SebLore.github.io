// This script fetches the navbar HTML from a separate file and injects it into the page
window.addEventListener("DOMContentLoaded", () => {
  fetch("/html/_navbar.html")
    .then(res => res.text())
    .then(data => {
      document.getElementById("navbar-container").innerHTML = data;
    });
});
