

document.addEventListener("DOMContentLoaded", () => {
  const $ = (selector, parent = document) =>
    parent.querySelector(selector);

  const $$ = (selector, parent = document) =>
    [...parent.querySelectorAll(selector)];

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // 1. INITIALIZE ICONS
  function refreshIcons() {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  refreshIcons();

  // 2. PAGE ENTRANCE + HERO TITLE
  document.body.classList.add("page-ready");

  const heroTitle = $(".hero-title");

  if (heroTitle) {
    heroTitle.classList.add("title-animated");
  }

  // 3. MOBILE MENU
  const menuToggle = $("#menuToggle");
  const nav = $("#nav");

  function closeMenu() {
    if (!menuToggle || !nav) return;

    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    menuToggle.innerHTML = '<i data-lucide="menu"></i>';

    refreshIcons();
  }

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");

      menuToggle.setAttribute(
        "aria-expanded",
        String(isOpen)
      );

      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation" : "Open navigation"
      );

      menuToggle.innerHTML = isOpen
        ? '<i data-lucide="x"></i>'
        : '<i data-lucide="menu"></i>';

      refreshIcons();
    });

    $$(".nav-link", nav).forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });

    document.addEventListener("click", (event) => {
      if (
        nav.classList.contains("open") &&
        !nav.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        closeMenu();
      }
    });
  }

  // 4. CINEMATIC SCROLL REVEALS
  const revealItems = $$(".reveal");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => {
      item.classList.add("visible");
    });
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -30px 0px"
      }
    );

    revealItems.forEach((item, index) => {
      // Consecutive items appear one after another.
      const delay = Math.min(index % 4, 3) * 90;

      item.style.transitionDelay = `${delay}ms`;
      revealObserver.observe(item);
    });
  }

  // 5. SKILL BARS ANIMATION
  const skillsSection = $("#skills");
  const skillBars = $$(".skill-track span");

  function animateSkillBars() {
    skillBars.forEach((bar, index) => {
      const target = bar.dataset.width || "0%";

      if (!reduceMotion) {
        bar.style.transitionDelay = `${index * 120}ms`;
      }

      bar.style.width = target;
    });
  }

  if (
    skillsSection &&
    "IntersectionObserver" in window &&
    !reduceMotion
  ) {
    const skillObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateSkillBars();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    skillObserver.observe(skillsSection);
  } else {
    animateSkillBars();
  }

  // 6. SCROLL PROGRESS BAR
  const progress = $("#scrollProgress");
  let scrollScheduled = false;

  function updateScrollProgress() {
    const root = document.documentElement;

    const maxScroll =
      root.scrollHeight - window.innerHeight;

    const currentScroll = Math.max(0, window.scrollY);

    const percent = maxScroll > 0
      ? Math.min(100, (currentScroll / maxScroll) * 100)
      : 0;

    if (progress) {
      progress.style.width = `${percent}%`;
    }

    scrollScheduled = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!scrollScheduled) {
        scrollScheduled = true;
        window.requestAnimationFrame(updateScrollProgress);
      }
    },
    { passive: true }
  );

  updateScrollProgress();

  // 7. ACTIVE NAVIGATION LINK
  const pageSections = $$("main section[id]");
  const navLinks = $$(".nav-link");

  if ("IntersectionObserver" in window) {
    const activeSectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          navLinks.forEach((link) => {
            const isActive =
              link.getAttribute("href") ===
              `#${entry.target.id}`;

            link.classList.toggle("active", isActive);

            if (isActive) {
              link.setAttribute("aria-current", "location");
            } else {
              link.removeAttribute("aria-current");
            }
          });
        });
      },
      {
        rootMargin: "-30% 0px -60% 0px",
        threshold: 0
      }
    );

    pageSections.forEach((section) => {
      activeSectionObserver.observe(section);
    });
  }

  // 8. PROFILE PHOTO
  const profilePhoto = $("#profilePhoto");

  if (profilePhoto) {
    const showPhoto = () => {
      if (profilePhoto.naturalWidth > 0) {
        profilePhoto.classList.add("loaded");
      }
    };

    profilePhoto.addEventListener("load", showPhoto);

    profilePhoto.addEventListener("error", () => {
      profilePhoto.classList.remove("loaded");
    });

    if (profilePhoto.complete) {
      showPhoto();
    }
  }

  // 9. SUBTLE 3D HOVER EFFECT ON CARDS
  // Desktop pointer devices only.
  const canHover =
    window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (canHover && !reduceMotion) {
    const tiltCards = $$(".project-card, .mini-card");

    tiltCards.forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();

        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;

        const rotateY = (x - 0.5) * 4;
        const rotateX = (0.5 - y) * 4;

        card.style.transform =
          `perspective(800px) rotateX(${rotateX}deg) ` +
          `rotateY(${rotateY}deg) translateY(-4px)`;
      });

      card.addEventListener("pointerleave", () => {
        card.style.transform = "";
      });
    });
  }

  // 10. BUTTON CLICK FEEDBACK
  $$(".button, .project-link").forEach((button) => {
    button.addEventListener("click", () => {
      button.classList.remove("click-feedback");

      // Restart the CSS animation when clicked repeatedly.
      void button.offsetWidth;

      button.classList.add("click-feedback");

      window.setTimeout(() => {
        button.classList.remove("click-feedback");
      }, 350);
    });
  });

  // 11. CURRENT COPYRIGHT YEAR
  const year = $("#year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  // 12. RESET MOBILE MENU ON DESKTOP RESIZE
  const desktopQuery = window.matchMedia("(min-width: 701px)");

  desktopQuery.addEventListener("change", (event) => {
    if (event.matches) {
      closeMenu();
    }
  });
});
