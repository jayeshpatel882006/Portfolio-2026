"use strict";

/* ═══════════════════════════════════════════════════════
   1. LOADER
═══════════════════════════════════════════════════════ */
(function initLoader() {
  const loader = document.getElementById("loader");
  window.addEventListener("load", () => {
    setTimeout(() => {
      loader.classList.add("hidden");
      document.body.style.overflow = "";
    }, 1600);
  });
  // Prevent scroll during load
  document.body.style.overflow = "hidden";
})();

/* ═══════════════════════════════════════════════════════
   2. CUSTOM CURSOR
═══════════════════════════════════════════════════════ */
(function initCursor() {
  const dot = document.getElementById("cursor-dot");
  const ring = document.getElementById("cursor-ring");
  if (!dot || !ring) return;

  let mouseX = 0,
    mouseY = 0;
  let ringX = 0,
    ringY = 0;
  const ease = 0.15;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + "px";
    dot.style.top = mouseY + "px";
  });

  // Ring trails slightly behind
  function animateRing() {
    ringX += (mouseX - ringX) * ease;
    ringY += (mouseY - ringY) * ease;
    ring.style.left = ringX + "px";
    ring.style.top = ringY + "px";
    requestAnimationFrame(animateRing);
  }
  animateRing();
})();

/* ═══════════════════════════════════════════════════════
   3. HERO CANVAS — Floating particle network
═══════════════════════════════════════════════════════ */
(function initCanvas() {
  const canvas = document.getElementById("heroCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let particles = [];
  let animId;
  const NUM_PARTICLES = 60;
  const MAX_DIST = 130;

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  function getColor() {
    return document.documentElement.dataset.theme === "light"
      ? "0, 150, 200"
      : "0, 212, 255";
  }

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = (Math.random() - 0.5) * 0.6;
      this.r = Math.random() * 1.8 + 0.8;
      this.opacity = Math.random() * 0.6 + 0.2;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }
    draw() {
      const c = getColor();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${c}, ${this.opacity})`;
      ctx.fill();
    }
  }

  function init() {
    particles = [];
    for (let i = 0; i < NUM_PARTICLES; i++) particles.push(new Particle());
  }

  function drawLines() {
    const c = getColor();
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          const alpha = (1 - dist / MAX_DIST) * 0.25;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${c}, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    drawLines();
    animId = requestAnimationFrame(animate);
  }

  resize();
  init();
  animate();

  window.addEventListener("resize", () => {
    resize();
    particles.forEach((p) => {
      if (p.x > canvas.width) p.x = Math.random() * canvas.width;
      if (p.y > canvas.height) p.y = Math.random() * canvas.height;
    });
  });
})();

/* ═══════════════════════════════════════════════════════
   4. NAVBAR — scroll effects + active section
═══════════════════════════════════════════════════════ */
(function initNavbar() {
  const navbar = document.getElementById("navbar");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section[id]");

  // Scrolled class for glass effect
  window.addEventListener(
    "scroll",
    () => {
      if (window.scrollY > 60) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
      highlightActive();
    },
    { passive: true },
  );

  // Active nav link based on scroll position
  function highlightActive() {
    let current = "";
    sections.forEach((sec) => {
      const top = sec.offsetTop - 100;
      if (window.scrollY >= top) current = sec.id;
    });
    navLinks.forEach((link) => {
      link.classList.toggle(
        "active",
        link.getAttribute("href") === `#${current}`,
      );
    });
  }
})();

/* ═══════════════════════════════════════════════════════
   5. HAMBURGER MENU
═══════════════════════════════════════════════════════ */
(function initHamburger() {
  const btn = document.getElementById("hamburger");
  const links = document.getElementById("navLinks");
  if (!btn || !links) return;

  btn.addEventListener("click", () => {
    const isOpen = links.classList.toggle("open");
    btn.classList.toggle("open", isOpen);
    btn.setAttribute("aria-expanded", isOpen);
  });

  // Close on link click
  links.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      links.classList.remove("open");
      btn.classList.remove("open");
    });
  });
})();

/* ═══════════════════════════════════════════════════════
   6. TYPING ANIMATION
═══════════════════════════════════════════════════════ */
(function initTyping() {
  const el = document.getElementById("typingText");
  if (!el) return;

  const roles = [
    "Cloud Computing Student",
    "Full Stack Developer",
    "Problem Solver",
    "DevOps Enthusiast",
    "Open Source Contributor",
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let deleting = false;
  const TYPING_SPEED = 80;
  const DELETING_SPEED = 45;
  const PAUSE_END = 1800;
  const PAUSE_START = 400;

  function type() {
    const current = roles[roleIdx];

    if (!deleting) {
      el.textContent = current.slice(0, ++charIdx);
      if (charIdx === current.length) {
        deleting = true;
        return setTimeout(type, PAUSE_END);
      }
    } else {
      el.textContent = current.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        return setTimeout(type, PAUSE_START);
      }
    }

    setTimeout(type, deleting ? DELETING_SPEED : TYPING_SPEED);
  }

  setTimeout(type, 800);
})();

/* ═══════════════════════════════════════════════════════
   7. SCROLL REVEAL — Intersection Observer
═══════════════════════════════════════════════════════ */
(function initReveal() {
  const els = document.querySelectorAll(
    ".reveal-up, .reveal-left, .reveal-right",
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
  );

  els.forEach((el) => observer.observe(el));
})();

/* ═══════════════════════════════════════════════════════
   8. SKILL BARS — animate on scroll
═══════════════════════════════════════════════════════ */
(function initSkillBars() {
  const bars = document.querySelectorAll(".skill-fill");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const width = bar.dataset.width || "0";
          // Small delay so CSS transition is visible
          requestAnimationFrame(() => {
            bar.style.width = width + "%";
          });
          observer.unobserve(bar);
        }
      });
    },
    { threshold: 0.3 },
  );

  bars.forEach((bar) => observer.observe(bar));
})();

/* ═══════════════════════════════════════════════════════
   9. COUNTER ANIMATION
═══════════════════════════════════════════════════════ */
(function initCounters() {
  const counters = document.querySelectorAll(".counter-value");

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const start = performance.now();

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }

    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 },
  );

  counters.forEach((c) => observer.observe(c));
})();

/* ═══════════════════════════════════════════════════════
   10. THEME TOGGLE
═══════════════════════════════════════════════════════ */
(function initTheme() {
  const btn = document.getElementById("themeToggle");
  const root = document.documentElement;
  const KEY = "portfolio-theme";

  // Load saved preference
  const saved = localStorage.getItem(KEY);
  if (saved) root.dataset.theme = saved;

  function updateIcon() {
    const icon = btn.querySelector(".theme-icon");
    if (icon) icon.textContent = root.dataset.theme === "light" ? "●" : "◑";
  }
  updateIcon();

  btn.addEventListener("click", () => {
    const isDark = root.dataset.theme !== "light";
    root.dataset.theme = isDark ? "light" : "dark";
    localStorage.setItem(KEY, root.dataset.theme);
    updateIcon();
  });
})();

/* ═══════════════════════════════════════════════════════
   11. BACK TO TOP
═══════════════════════════════════════════════════════ */
(function initBackToTop() {
  const btn = document.getElementById("backToTop");
  if (!btn) return;

  window.addEventListener(
    "scroll",
    () => {
      btn.classList.toggle("visible", window.scrollY > 500);
    },
    { passive: true },
  );

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();

/* ═══════════════════════════════════════════════════════
   12. CONTACT FORM
═══════════════════════════════════════════════════════ */
(function initForm() {
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const fname = form.fname.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (!fname || !email || !message) {
      showStatus("Please fill in all required fields.", "error");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showStatus("Please enter a valid email address.", "error");
      return;
    }

    // Simulate sending
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;

    setTimeout(() => {
      showStatus("✓ Message sent! I'll get back to you soon.", "success");
      form.reset();
      submitBtn.textContent = "Send Message →";
      submitBtn.disabled = false;
    }, 1400);
  });

  function showStatus(msg, type) {
    if (!status) return;
    status.textContent = msg;
    status.style.color = type === "error" ? "var(--accent-3)" : "var(--accent)";
    setTimeout(() => {
      status.textContent = "";
    }, 5000);
  }
})();

/* ═══════════════════════════════════════════════════════
   13. SMOOTH SCROLL for all anchor links
═══════════════════════════════════════════════════════ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href").slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
})();

/* ═══════════════════════════════════════════════════════
   14. CARD TILT EFFECT (subtle 3D hover on project cards)
═══════════════════════════════════════════════════════ */
(function initTilt() {
  const cards = document.querySelectorAll(".project-card, .expertise-card");

  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `translateY(-6px) rotateY(${dx * 4}deg) rotateX(${-dy * 4}deg)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
      card.style.transition =
        "transform 0.5s ease, border-color 0.3s ease, box-shadow 0.3s ease";
    });

    card.addEventListener("mouseenter", () => {
      card.style.transition =
        "transform 0.1s ease, border-color 0.3s ease, box-shadow 0.3s ease";
    });
  });
})();

/* ═══════════════════════════════════════════════════════
   15. SECTION BACKGROUND PULSE (subtle gradient shift)
═══════════════════════════════════════════════════════ */
(function initSectionPulse() {
  let hue = 180;
  const heroSection = document.getElementById("hero");
  if (!heroSection) return;

  // Subtle animated gradient overlay on hero
  const overlay = document.createElement("div");
  overlay.style.cssText = `
    position: absolute;
    inset: 0;
    pointer-events: none;
    opacity: 0.08;
    z-index: 1;
    background: radial-gradient(ellipse at 30% 50%, rgba(0,212,255,1) 0%, transparent 60%),
                radial-gradient(ellipse at 70% 50%, rgba(123,92,255,1) 0%, transparent 60%);
    animation: gradientShift 8s ease infinite alternate;
  `;

  const style = document.createElement("style");
  style.textContent = `
    @keyframes gradientShift {
      0%   { opacity: 0.06; transform: scale(1)   rotate(0deg); }
      50%  { opacity: 0.10; transform: scale(1.05) rotate(2deg); }
      100% { opacity: 0.06; transform: scale(1)   rotate(-2deg); }
    }
  `;
  document.head.appendChild(style);
  heroSection.appendChild(overlay);
})();

/* ═══════════════════════════════════════════════════════
   END OF SCRIPT
═══════════════════════════════════════════════════════ */
console.log(
  "%c✦ Portfolio loaded by Jayesh Patel",
  "color:#00d4ff;font-size:14px;font-weight:bold;",
);
