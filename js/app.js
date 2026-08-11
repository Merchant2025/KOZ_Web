(() => {
  "use strict";
  document.documentElement.classList.replace("no-js", "js");

  document.addEventListener("DOMContentLoaded", () => {
    const menuButton = document.querySelector(".menu-button");
    const navigation = document.querySelector(".navigation");
    const year = document.getElementById("current-year");

    if (year) year.textContent = `© ${new Date().getFullYear()}`;

    if (menuButton && navigation) {
      const closeMenu = (restoreFocus = false) => {
        navigation.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
        if (restoreFocus) menuButton.focus();
      };

      menuButton.addEventListener("click", () => {
        const isOpen = navigation.classList.toggle("open");
        menuButton.setAttribute("aria-expanded", String(isOpen));
      });
      navigation.addEventListener("click", (event) => {
        if (event.target instanceof HTMLAnchorElement) closeMenu();
      });
      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && navigation.classList.contains("open")) {
          closeMenu(true);
        }
      });
    }
  });
})();
