// ---------- Theme toggle (remembers choice) ----------
const root = document.documentElement;
const themeBtn = document.getElementById("themeToggle");

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  themeBtn.textContent = theme === "dark" ? "☀️" : "🌙";
}

let savedTheme = null;
try { savedTheme = localStorage.getItem("theme"); } catch (e) {}
applyTheme(savedTheme || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));

themeBtn.addEventListener("click", () => {
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  applyTheme(next);
  try { localStorage.setItem("theme", next); } catch (e) {}
});

// ---------- Mobile menu ----------
const menu = document.getElementById("menu");
const menuToggle = document.getElementById("menuToggle");

menuToggle.addEventListener("click", () => {
  const open = menu.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", open);
});
menu.querySelectorAll("a").forEach((link) =>
  link.addEventListener("click", () => {
    menu.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  })
);

// ---------- Scroll reveal ----------
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

// ---------- Active nav link on scroll ----------
const navLinks = document.querySelectorAll(".menu a:not(.btn)");
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((l) =>
          l.classList.toggle("active", l.getAttribute("href") === "#" + entry.target.id)
        );
      }
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);
document.querySelectorAll("main section[id]").forEach((s) => sectionObserver.observe(s));

// ---------- Contact form (opens the visitor's email app) ----------
const form = document.getElementById("contactForm");
const statusEl = document.getElementById("formStatus");
const MY_EMAIL = "shaunmalemela@gmail.com";

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const fields = ["name", "email", "message"].map((id) => document.getElementById(id));
  let valid = true;

  fields.forEach((f) => {
    const ok = f.value.trim() !== "" && (f.type !== "email" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value));
    f.classList.toggle("invalid", !ok);
    if (!ok) valid = false;
  });

  if (!valid) {
    statusEl.textContent = "Please fill in all fields with valid details.";
    statusEl.className = "form-status error";
    return;
  }

  const [name, email, message] = fields.map((f) => f.value.trim());
  const subject = encodeURIComponent("Portfolio enquiry from " + name);
  const body = encodeURIComponent(message + "\n\nFrom: " + name + " (" + email + ")");
  window.location.href = `mailto:${MY_EMAIL}?subject=${subject}&body=${body}`;

  statusEl.textContent = "Thanks! Your email app should open with the message ready to send.";
  statusEl.className = "form-status ok";
  form.reset();
});

// ---------- Footer year ----------
document.getElementById("year").textContent = new Date().getFullYear();
