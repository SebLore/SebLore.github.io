

// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {
  // step 1: construct the outer class
  const page = document.querySelector(".page");
  const pageContent = document.querySelector(".page-content");
  
  page.classList.add("hidden");
  if (!page) {
    console.error("Page element not found. Navbar cannot not be added.");
    return;
  }

  const navbar = document.createElement("nav");
  navbar.id = "navbar";
  navbar.className = "navbar fixed-top";

  const container = document.createElement("div");
  container.className = "container";

  const logoContainer = document.createElement("div");
  logoContainer.className = "logo-container";
  logoContainer.id = "logo-container";

  logoContainer.innerHTML = `
    <a class="logo" href="/">
        <img src="/assets/img/logo.png" alt="Logo" style="max-width: 40px;">
        <span class="logo-text">seblore</span>
    </a>
  `;
  container.appendChild(logoContainer);

  const navCenter = document.createElement("div");
  navCenter.className = "nav-center";

  const menuItems = document.createElement("div");
  menuItems.className = "menuItems";
  menuItems.id = "menuItems";
  menuItems.innerHTML = `
    <ul class="nav navbar-nav">
        <li class="nav-item"><a class="nav-link" href="/about.html">HOME</a></li>
        <li class="nav-item"><a class="nav-link" href="/about.html">ABOUT</a></li>
        <li class="nav-item"><a class="nav-link" href="/projects.html">PROJECTS</a></li>
        <li class="nav-item"><a class="nav-link" href="/cv.html">RESUME</a></li>
    </ul>
  `;
  navCenter.appendChild(menuItems);
  container.appendChild(navCenter);

  const externalsContainer = document.createElement("div");
  externalsContainer.className = "externals-container";
  externalsContainer.innerHTML = `<div class="externals-container">
                <ul id="externals" class="nav navbar-nav">
                    <li class="navitem">
                        <a class="nav-link" title="GitHub" href="https://github.com/SebLore">
                            <i class="fa-brands fa-github"></i>
                        </a>
                    </li>
                    <li class="navitem">
                        <a class="nav-link" href="https://linkedin.com/in/sebastian-lorensson">
                            <i class="fa-brands fa-linkedin-in fa-2"></i>
                        </a>
                    </li>
                    <li class="navitem">
                        <a class="nav-link" href="mailto:sebastian.lorensson@gmail.com">
                            <i class="fa fa-envelope"></i>
                        </a>
                    </li>
                </ul>
        </div>
        `;

  container.appendChild(externalsContainer);
  navbar.appendChild(container);
  page.prepend(navbar);

  // offset the page content to account for the navbar height
  // pageContent.classList.add("pt-3");
  // pageContent.classList.add("my-3");

  /* show loading spinner while the page is loading */
  window.addEventListener('load', () => {
    const spinner = document.getElementById("spinner-container");

    // wait for spinner to be removed before showing the page
    if (spinner) {
      console.log("Spinner found, removing it and showing the page.");

      document.body.removeChild(spinner);
      page.classList.remove("hidden");
    }
    // if spinner is not present, just remove the hidden class
    else {
      console.log("Spinner not found, removing hidden class from page.");
      page.classList.remove("hidden");
    }
  });

});
