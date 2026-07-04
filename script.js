(function () {
  const products = [
    {
      number: "1",
      name: "Crushed Pineapple Sriracha",
      link: "#shop",
    },
    {
      number: "2",
      name: "Crushed Habanero Garlic",
      link: "#shop",
    },
    {
      number: "3",
      name: "Crushed Cherry Garlic",
      link: "#shop",
    },
  ];

  const body = document.body;
  const productEls = Array.from(document.querySelectorAll(".hero-product"));
  const productNumber = document.querySelector("[data-product-number]");
  const productName = document.querySelector("[data-product-name]");
  const productLink = document.querySelector("[data-product-link]");
  let currentProduct = 0;
  let carouselTimer = 0;

  function splitText(el) {
    const lines = el.dataset.lines
      ? el.dataset.lines.split("|").map((line) => line.trim()).filter(Boolean)
      : [el.textContent.trim().replace(/\s+/g, " ")];
    el.textContent = "";
    el.classList.add("split");
    let index = 0;

    lines.forEach((line, lineIndex) => {
      const lineSpan = document.createElement("span");
      lineSpan.className = "line";
      const words = line.split(" ");

      words.forEach((word, wordIndex) => {
        const wordSpan = document.createElement("span");
        wordSpan.className = "word";
        [...word].forEach((char) => {
          const charSpan = document.createElement("span");
          charSpan.className = "char";
          charSpan.style.setProperty("--char-index", index);
          charSpan.textContent = char;
          wordSpan.appendChild(charSpan);
          index += 1;
        });
        lineSpan.appendChild(wordSpan);
        if (wordIndex < words.length - 1) {
          lineSpan.appendChild(document.createTextNode(" "));
        }
      });

      el.appendChild(lineSpan);
      if (lineIndex < lines.length - 1) {
        el.appendChild(document.createTextNode("\n"));
      }
    });
  }

  document.querySelectorAll("[data-split]").forEach(splitText);

  function setProduct(nextIndex) {
    currentProduct = (nextIndex + products.length) % products.length;
    productEls.forEach((el, index) => {
      el.classList.toggle("is-active", index === currentProduct);
    });
    productNumber.textContent = products[currentProduct].number;
    productName.textContent = products[currentProduct].name;
    productLink.href = products[currentProduct].link;
  }

  function restartCarousel() {
    window.clearInterval(carouselTimer);
    carouselTimer = window.setInterval(() => setProduct(currentProduct + 1), 4300);
  }

  document.querySelector("[data-prev]").addEventListener("click", () => {
    setProduct(currentProduct - 1);
    restartCarousel();
  });

  document.querySelector("[data-next]").addEventListener("click", () => {
    setProduct(currentProduct + 1);
    restartCarousel();
  });

  function openDrawer(drawer) {
    document.querySelectorAll(".drawer.is-open").forEach((el) => el.classList.remove("is-open"));
    drawer.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    body.classList.add("drawer-open");
    document.querySelector("[data-scrim]").classList.add("is-open");
  }

  function closeDrawers() {
    document.querySelectorAll(".drawer").forEach((drawer) => {
      drawer.classList.remove("is-open");
      drawer.setAttribute("aria-hidden", "true");
    });
    body.classList.remove("drawer-open");
    document.querySelector("[data-scrim]").classList.remove("is-open");
  }

  document.querySelector("[data-menu-open]").addEventListener("click", () => openDrawer(document.querySelector("[data-menu]")));
  document.querySelector("[data-cart-open]").addEventListener("click", () => openDrawer(document.querySelector("[data-cart]")));
  document.querySelector("[data-menu-close]").addEventListener("click", closeDrawers);
  document.querySelector("[data-cart-close]").addEventListener("click", closeDrawers);
  document.querySelector("[data-scrim]").addEventListener("click", closeDrawers);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeDrawers();
  });

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const hash = link.getAttribute("href");
      if (!hash || hash === "#") return;
      const target = document.querySelector(hash);
      if (!target) return;
      event.preventDefault();
      closeDrawers();
      history.pushState(null, "", hash);
      const top = target.getBoundingClientRect().top + window.scrollY - 24;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });

  document.querySelectorAll("[data-add]").forEach((button) => {
    button.addEventListener("click", () => {
      button.classList.add("added");
      window.setTimeout(() => button.classList.remove("added"), 1300);
    });
  });

  const packButtons = Array.from(document.querySelectorAll("[data-pack]"));
  const packImages = Array.from(document.querySelectorAll("[data-pack-image]"));
  const packPrice = document.querySelector("[data-pack-price]");
  const packName = document.querySelector("[data-pack-name]");

  packButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const pack = button.dataset.pack;
      packButtons.forEach((item) => item.classList.toggle("is-active", item === button));
      packImages.forEach((img) => img.classList.toggle("is-active", img.dataset.packImage === pack));
      packPrice.textContent = pack === "6" ? "$58.00" : "$32.00";
      packName.textContent = pack === "6" ? "Six pack sauce arsenal" : "Crushed Pineapple Sriracha";
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
        }
      });
    },
    { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
  );

  document.querySelectorAll(".reveal, .split").forEach((el) => observer.observe(el));

  const reviewTrack = document.querySelector(".review-track");
  reviewTrack.innerHTML += reviewTrack.innerHTML;

  const why = document.querySelector("[data-why]");
  const whyTrack = document.querySelector("[data-why-track]");

  function updateWhyTrack() {
    if (!why || !whyTrack) return;
    const rect = why.getBoundingClientRect();
    const maxScroll = why.offsetHeight - window.innerHeight;
    const progress = Math.min(1, Math.max(0, -rect.top / Math.max(maxScroll, 1)));
    const distance = Math.max(0, whyTrack.scrollWidth - window.innerWidth + 80);
    whyTrack.style.transform = `translate3d(${-distance * progress}px, 0, 0)`;
  }

  let ticking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateWhyTrack();
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true }
  );

  window.addEventListener("resize", updateWhyTrack);

  window.addEventListener("load", () => {
    window.setTimeout(() => body.classList.add("loaded"), 650);
    setProduct(0);
    restartCarousel();
    updateWhyTrack();
  });
})();
