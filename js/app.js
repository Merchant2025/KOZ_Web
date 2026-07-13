(() => {
  "use strict";
  const menuButton = document.querySelector(".menu-button");
  const navigation = document.querySelector(".navigation");
  const year = document.getElementById("current-year");

  if (year) year.textContent = `© ${new Date().getFullYear()}`;

  if (menuButton && navigation) {
    menuButton.addEventListener("click", () => {
      const isOpen = navigation.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
    });
    navigation.addEventListener("click", (event) => {
      if (event.target instanceof HTMLAnchorElement) {
        navigation.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
      }
    });
  }
})();
