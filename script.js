(function () {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const header = document.querySelector(".site-header");
  if (header) {
    function onScroll() {
      header.classList.toggle("is-scrolled", window.scrollY > 16);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  if (document.getElementById("who-i-am")) {
    const navMap = [
      { id: "top", nav: "top" },
      { id: "who-i-am", nav: "who" },
      { id: "skills", nav: "skills" },
      { id: "portfolio-hub", nav: "portfolio" },
      { id: "contact", nav: "contact" },
    ];

    function syncNavActive() {
      const links = document.querySelectorAll(".nav-link[data-nav]");
      if (!links.length) return;
      const y = window.scrollY + 150;
      let navKey = "top";
      for (let i = 0; i < navMap.length; i++) {
        const el = document.getElementById(navMap[i].id);
        if (el && y >= el.offsetTop) navKey = navMap[i].nav;
      }
      links.forEach(function (a) {
        a.classList.toggle("is-active", a.getAttribute("data-nav") === navKey);
      });
    }

    syncNavActive();
    window.addEventListener("scroll", syncNavActive, { passive: true });
  }

  const toggle = document.querySelector(".menu-toggle");
  const mobileNav = document.getElementById("mobile-nav");
  const mobileLinks = mobileNav ? mobileNav.querySelectorAll("a") : [];

  function setMenuOpen(open) {
    if (!toggle || !mobileNav) return;
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    if (open) mobileNav.removeAttribute("hidden");
    else mobileNav.setAttribute("hidden", "");
  }

  if (toggle && mobileNav) {
    toggle.addEventListener("click", function () {
      const open = toggle.getAttribute("aria-expanded") !== "true";
      setMenuOpen(open);
    });
    mobileLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        setMenuOpen(false);
      });
    });
  }

  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const fd = new FormData(contactForm);
      const name = String(fd.get("name") || "").trim();
      const email = String(fd.get("email") || "").trim();
      const message = String(fd.get("message") || "").trim();
      const subject = encodeURIComponent("Portfolio message from " + name);
      const body = encodeURIComponent(
        "Name: " + name + "\nEmail: " + email + "\n\n" + message
      );
      window.location.href =
        "mailto:geraldcarleen26@gmail.com?subject=" + subject + "&body=" + body;
    });
  }

  (function initHeroTyping() {
    const greetTarget = document.querySelector(".hero-greet-type");
    const titleTarget = document.querySelector(".hero-title-type");
    const greetCursor = document.querySelector(".hero-greet-cursor");
    const titleCursor = document.querySelector(".hero-title-cursor");
    const nameDot = document.querySelector(".hero-name-dot");
    if (!greetTarget || !titleTarget || !nameDot) return;

    const greetText = "Hi, I\u2019m";
    const nameText = "Carleen Edward Nyamanga";
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function finishA11y() {
      greetTarget.removeAttribute("aria-hidden");
      titleTarget.removeAttribute("aria-hidden");
      nameDot.removeAttribute("aria-hidden");
      nameDot.classList.add("is-revealed");
    }

    if (reduced) {
      greetTarget.textContent = greetText;
      titleTarget.textContent = nameText;
      if (greetCursor) greetCursor.style.display = "none";
      if (titleCursor) {
        titleCursor.classList.remove("is-on");
        titleCursor.style.display = "none";
      }
      finishA11y();
      return;
    }

    function wait(ms) {
      return new Promise(function (resolve) {
        setTimeout(resolve, ms);
      });
    }

    function typeInto(el, str, msPerChar) {
      return new Promise(function (resolve) {
        let i = 0;
        function tick() {
          if (i >= str.length) {
            resolve();
            return;
          }
          el.textContent += str.charAt(i);
          i += 1;
          setTimeout(tick, msPerChar);
        }
        tick();
      });
    }

    greetTarget.textContent = "";
    titleTarget.textContent = "";
    nameDot.classList.remove("is-revealed");
    if (titleCursor) titleCursor.classList.remove("is-on");

    (function run() {
      typeInto(greetTarget, greetText, 72)
        .then(function () {
          return wait(420);
        })
        .then(function () {
          if (greetCursor) greetCursor.style.display = "none";
          if (titleCursor) titleCursor.classList.add("is-on");
          return typeInto(titleTarget, nameText, 54);
        })
        .then(function () {
          if (titleCursor) {
            titleCursor.classList.remove("is-on");
            titleCursor.style.display = "none";
          }
          finishA11y();
        });
    })();
  })();

  const revealEls = document.querySelectorAll("[data-reveal]");
  if (!revealEls.length || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
    return;
  }

  const io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
  );

  revealEls.forEach(function (el) {
    io.observe(el);
  });
})();
