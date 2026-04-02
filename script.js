const siteHeader = document.querySelector(".site-header");
const categoryLinks = document.querySelectorAll(".category-strip a");
const menuToggle = document.querySelector(".menu-toggle");
const mobilePanel = document.querySelector(".mobile-panel");
const mobileLinks = document.querySelectorAll(".mobile-links a");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#site-search");
const categoryCards = document.querySelectorAll(".category-card");
const anchorLinks = document.querySelectorAll('a[href^="#"]');

const syncHeaderShadow = () => {
  if (!siteHeader) return;
  siteHeader.classList.toggle("is-scrolled", window.scrollY > 8);
};

const closeMobileMenu = () => {
  if (!menuToggle || !mobilePanel) return;
  menuToggle.setAttribute("aria-expanded", "false");
  mobilePanel.classList.remove("is-open");
};

const activateCategory = (query) => {
  categoryLinks.forEach((link) => {
    link.classList.toggle("is-active", link.dataset.query === query);
  });
};

const clearHighlights = () => {
  categoryCards.forEach((card) => card.classList.remove("search-highlight"));
};

if (menuToggle && mobilePanel) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    mobilePanel.classList.toggle("is-open", !isOpen);
  });
}

mobileLinks.forEach((link) => {
  link.addEventListener("click", closeMobileMenu);
});

anchorLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");
    if (!targetId || targetId === "#") return;

    const target = document.querySelector(targetId);
    if (!target) return;

    event.preventDefault();
    const headerOffset = (siteHeader?.offsetHeight || 0) + 86;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - headerOffset;

    window.scrollTo({
      top: targetTop,
      behavior: "smooth",
    });

    closeMobileMenu();
  });
});

categoryLinks.forEach((link) => {
  link.addEventListener("click", () => {
    activateCategory(link.dataset.query);
  });
});

if (searchForm && searchInput) {
  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const query = searchInput.value.trim().toLowerCase();
    clearHighlights();

    if (!query) {
      activateCategory("");
      return;
    }

    const matchingCard = Array.from(categoryCards).find((card) =>
      card.dataset.search.toLowerCase().includes(query)
    );

    if (matchingCard) {
      matchingCard.classList.add("search-highlight");
      matchingCard.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      document.querySelector("#top-picks")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
}

window.addEventListener("scroll", syncHeaderShadow, { passive: true });
syncHeaderShadow();
