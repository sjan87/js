(() => {
  const header = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");
  const navLinks = [...document.querySelectorAll(".main-nav a")];
  const regionButtons = [...document.querySelectorAll(".region-card")];
  const explorer = document.getElementById("explorer");
  const countryList = document.getElementById("country-list");
  const explorerTitle = document.getElementById("explorer-title");
  const photoCards = [...document.querySelectorAll(".photo-card")];
  const hint = document.getElementById("gallery-hint");
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightbox-image");
  const lightboxCaption = document.getElementById("lightbox-caption");
  let activePhotos = [];
  let activeIndex = 0;

  document.getElementById("year").textContent = new Date().getFullYear();
  document.querySelector(".back-top").addEventListener("click", () => {
    window.scrollTo({top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth"});
  });

  menuToggle.addEventListener("click", () => {
    const open = menuToggle.getAttribute("aria-expanded") !== "true";
    menuToggle.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
  });
  navLinks.forEach(link => link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
  }));

  const countryNames = region => [...new Set(photoCards.filter(card => card.dataset.region === region).map(card => card.dataset.country))];
  function selectCountry(country, region) {
    countryList.querySelectorAll(".country-chip").forEach(button => {
      button.setAttribute("aria-pressed", String(button.dataset.country === country));
    });
    let visible = 0;
    photoCards.forEach(card => {
      const show = card.dataset.region === region && card.dataset.country === country;
      card.classList.toggle("is-visible", show);
      if (show) visible++;
    });
    hint.textContent = visible ? `${visible} photo${visible === 1 ? "" : "s"} from ${country}. Select a photo to view it larger.` : "No photos available yet.";
  }
  regionButtons.forEach(button => button.addEventListener("click", () => {
    const region = button.dataset.region;
    const alreadyOpen = button.getAttribute("aria-expanded") === "true";
    regionButtons.forEach(item => item.setAttribute("aria-expanded", "false"));
    button.setAttribute("aria-expanded", String(!alreadyOpen));
    if (alreadyOpen) {
      explorer.hidden = true;
      return;
    }
    explorer.hidden = false;
    explorerTitle.textContent = region;
    countryList.replaceChildren();
    photoCards.forEach(card => card.classList.remove("is-visible"));
    hint.textContent = "Select a country to see its photographs.";
    countryNames(region).forEach((country, index) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "country-chip";
      chip.dataset.country = country;
      chip.setAttribute("aria-pressed", "false");
      chip.textContent = country;
      chip.addEventListener("click", () => selectCountry(country, region));
      countryList.append(chip);
      if (index === 0) selectCountry(country, region);
    });
    explorer.scrollIntoView({behavior:"smooth",block:"start"});
  }));
  document.getElementById("close-explorer").addEventListener("click", () => {
    explorer.hidden = true;
    regionButtons.forEach(item => item.setAttribute("aria-expanded", "false"));
  });

  function showPhoto(index) {
    if (!activePhotos.length) return;
    activeIndex = (index + activePhotos.length) % activePhotos.length;
    const card = activePhotos[activeIndex];
    const img = card.querySelector("img");
    lightboxImage.src = img.src;
    lightboxImage.alt = img.alt;
    lightboxCaption.textContent = card.querySelector("h3").textContent;
  }
  photoCards.forEach(card => card.querySelector(".photo-open").addEventListener("click", () => {
    activePhotos = [...document.querySelectorAll(".photo-card.is-visible")];
    showPhoto(activePhotos.indexOf(card));
    lightbox.showModal();
  }));
  document.querySelector(".lightbox__close").addEventListener("click", () => lightbox.close());
  document.querySelector(".lightbox__prev").addEventListener("click", () => showPhoto(activeIndex - 1));
  document.querySelector(".lightbox__next").addEventListener("click", () => showPhoto(activeIndex + 1));
  lightbox.addEventListener("click", event => { if (event.target === lightbox) lightbox.close(); });
  document.addEventListener("keydown", event => {
    if (!lightbox.open) return;
    if (event.key === "ArrowLeft") showPhoto(activeIndex - 1);
    if (event.key === "ArrowRight") showPhoto(activeIndex + 1);
  });

  const sections = ["home","photos","about"].map(id => document.getElementById(id));
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`));
      }
    });
  }, {rootMargin:"-35% 0px -55% 0px"});
  sections.forEach(section => observer.observe(section));
})();