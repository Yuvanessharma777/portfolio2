
document.addEventListener("DOMContentLoaded", () => {
  // Update footer year
  const year = document.getElementById("year");
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  // Dark / Light theme
  const themeToggle = document.getElementById("themeToggle");

  function updateThemeButton() {
    if (themeToggle) {
      themeToggle.textContent =
        document.body.classList.contains("light") ? "🌙" : "☀️";
    }
  }

  try {
    if (localStorage.getItem("portfolio-theme") === "light") {
      document.body.classList.add("light");
    }
  } catch (error) {
    // Theme still works if local storage is unavailable.
  }

  updateThemeButton();

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("light");

      try {
        localStorage.setItem(
          "portfolio-theme",
          document.body.classList.contains("light") ? "light" : "dark"
        );
      } catch (error) {
        // Continue without saving the preference.
      }

      updateThemeButton();
    });
  }

  // Mobile navigation
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.textContent = isOpen ? "✕" : "☰";
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.textContent = "☰";
      });
    });
  }

  // Typing animation
  const typedRole = document.getElementById("typedRole");
  const roles = [
    "Computer Science Student",
    "Web Developer",
    "Creative Learner"
  ];

  if (typedRole) {
    let roleIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function typeRole() {
      const currentRole = roles[roleIndex];

      if (!deleting) {
        charIndex++;
        typedRole.textContent = currentRole.slice(0, charIndex);

        if (charIndex >= currentRole.length) {
          deleting = true;
          setTimeout(typeRole, 1200);
          return;
        }
      } else {
        charIndex--;
        typedRole.textContent = currentRole.slice(0, charIndex);

        if (charIndex <= 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
        }
      }

      setTimeout(typeRole, deleting ? 45 : 90);
    }

    typeRole();
  }

  // Project filtering
  const filterButtons = document.querySelectorAll(".filter");
  const projects = document.querySelectorAll(".project");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.dataset.filter;

      filterButtons.forEach((item) => {
        item.classList.remove("active");
      });

      button.classList.add("active");

      projects.forEach((project) => {
        const matches =
          category === "all" || project.dataset.category === category;

        project.classList.toggle("hidden", !matches);
      });
    });
  });

  // Scroll reveal
  const revealElements = document.querySelectorAll(
    ".panel, .heading, .hero-text, .photo-card, .section-description"
  );

  revealElements.forEach((element) => {
    element.classList.add("reveal");
  });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealElements.forEach((element) => observer.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add("show"));
  }

  // Scroll progress and back-to-top button
  const progress = document.getElementById("progress");
  const topButton = document.getElementById("topButton");

  function handleScroll() {
    const scrollable =
      document.documentElement.scrollHeight - window.innerHeight;

    const percent =
      scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;

    if (progress) {
      progress.style.width = `${percent}%`;
    }

    if (topButton) {
      topButton.classList.toggle("visible", window.scrollY > 350);
    }
  }

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  if (topButton) {
    topButton.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Project card tilt effect on desktop
  const canHover = window.matchMedia("(hover: hover)").matches;

  if (canHover) {
    document.querySelectorAll(".project").forEach((card) => {
      card.addEventListener("mousemove", (event) => {
        if (card.classList.contains("hidden")) return;

        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const rotateY = ((x / rect.width) - 0.5) * 5;
        const rotateX = (0.5 - y / rect.height) * 5;

        card.style.transform =
          `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });
  }

  // Contact form
  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");

  // Add your real email address between the quotes.
  const ownerEmail = "";

  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const name = document.getElementById("name").value.trim();
      const senderEmail = document.getElementById("email").value.trim();
      const message = document.getElementById("message").value.trim();

      if (!name || !senderEmail || !message) {
        formStatus.textContent = "Please fill in all fields.";
        return;
      }

      if (!ownerEmail) {
        formStatus.textContent =
          "Please add your email address to the ownerEmail variable in script.js.";
        return;
      }

      const subject = encodeURIComponent(`Portfolio message from ${name}`);
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${senderEmail}\n\nMessage:\n${message}`
      );

      formStatus.textContent = "Opening your email application...";

      window.location.href =
        `mailto:${ownerEmail}?subject=${subject}&body=${body}`;
    });
  }
});
