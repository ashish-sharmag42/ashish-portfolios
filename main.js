const header = document.getElementById("header");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const navAnchors = [...document.querySelectorAll(".nav-links a[href^='#']")];
const revealItems = document.querySelectorAll(".reveal");
const year = document.getElementById("year");

year.textContent = new Date().getFullYear();

function updateHeader() {
  header.classList.toggle("scrolled", window.scrollY > 18);
}
updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

function closeMenu() {
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open menu");
  navLinks.classList.remove("open");
  document.body.classList.remove("menu-open");
}

menuToggle.addEventListener("click", () => {
  const open = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!open));
  menuToggle.setAttribute("aria-label", open ? "Open menu" : "Close menu");
  navLinks.classList.toggle("open", !open);
  document.body.classList.toggle("menu-open", !open);
});

navAnchors.forEach(a => a.addEventListener("click", closeMenu));

const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (reduced || !("IntersectionObserver" in window)) {
  revealItems.forEach(el => el.classList.add("visible"));
} else {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach(el => revealObserver.observe(el));
}

const sections = [...document.querySelectorAll("main section[id]")];
if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navAnchors.forEach(a => a.classList.toggle("active", a.getAttribute("href") === `#${entry.target.id}`));
    });
  }, { rootMargin: "-42% 0px -50% 0px" });
  sections.forEach(section => sectionObserver.observe(section));
}

// Animated metrics
const metricValues = document.querySelectorAll("[data-count]");
if ("IntersectionObserver" in window && !reduced) {
  const countObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.count);
      const suffix = el.dataset.suffix || "";
      const start = performance.now();
      const duration = 850;

      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = `${Math.round(target * eased)}${suffix}`;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      countObserver.unobserve(el);
    });
  }, { threshold: 0.7 });
  metricValues.forEach(el => countObserver.observe(el));
} else {
  metricValues.forEach(el => el.textContent = `${el.dataset.count}${el.dataset.suffix || ""}`);
}

// Recommendations
const quoteSlides = [...document.querySelectorAll(".quote-slide")];
let quoteIndex = 0;

function showQuote(index) {
  quoteIndex = (index + quoteSlides.length) % quoteSlides.length;
  quoteSlides.forEach((slide, i) => slide.classList.toggle("active", i === quoteIndex));
}
document.getElementById("quotePrev").addEventListener("click", () => showQuote(quoteIndex - 1));
document.getElementById("quoteNext").addEventListener("click", () => showQuote(quoteIndex + 1));

// Case-study modal
const caseData = {
  agents: {
    kicker: "ENTERPRISE AI",
    title: "Multi-Agent AI Framework for Enterprise Decision Orchestration",
    summary: "A conceptual enterprise architecture designed to coordinate intelligent agents, retrieval, predictive models and governance-aware automation around complex business decisions.",
    challenge: "Enterprise decisions are distributed across systems, policies, data sources and teams, making end-to-end automation difficult.",
    approach: "Combine LLM reasoning, RAG, semantic memory, specialist agents, predictive analytics and policy-aware orchestration.",
    value: "A reusable operating model for faster decisions, better context sharing and intelligent automation with human governance.",
    tags: ["Agentic AI", "RAG", "LLMs", "Semantic Memory", "Orchestration"]
  },
  revenue: {
    kicker: "AIRLINE COMMERCIAL",
    title: "AI for Revenue Management & Revenue Integrity",
    summary: "Using AI and machine learning to improve forecasting, dynamic pricing, seat inventory decisions and revenue protection.",
    challenge: "Demand, fares, inventory and customer behavior move continuously, while leakage and manual rules reduce commercial agility.",
    approach: "Apply forecasting, segmentation, anomaly detection and decision support around pricing and inventory workflows.",
    value: "More responsive commercial decisions, stronger revenue integrity and a foundation for increasingly dynamic optimization.",
    tags: ["Forecasting", "Dynamic Pricing", "Machine Learning", "Revenue Integrity"]
  },
  retailing: {
    kicker: "AIRLINE RETAILING",
    title: "Generative AI + Offer & Order Management",
    summary: "Exploring the combination of modern airline offer/order capabilities and generative AI to create more relevant, flexible customer journeys.",
    challenge: "Legacy airline commerce is fragmented across fares, ancillaries, servicing and multiple transaction records.",
    approach: "Use offer/order platforms as the commerce foundation, then apply AI to personalization, content, servicing and decision support.",
    value: "A more retail-oriented airline experience with richer offers, simpler order management and stronger personalization.",
    tags: ["Offer & Order", "Generative AI", "Personalization", "Airline Retailing"]
  },
  innovation: {
    kicker: "INNOVATION",
    title: "AI-Powered Innovation Initiatives",
    summary: "A structured approach to ideating, evaluating and prototyping technology opportunities across airline operations and customer experience.",
    challenge: "Innovation programs can generate many ideas without a consistent method for prioritizing business value and feasibility.",
    approach: "Frame use cases, evaluate value and feasibility, prototype quickly, and use AI/ML capabilities to test high-potential concepts.",
    value: "Faster experimentation, better prioritization and a clearer path from idea to scalable business capability.",
    tags: ["Innovation", "Microsoft AI", "Experimentation", "Customer Experience"]
  }
};

const modal = document.getElementById("caseModal");
const modalKicker = document.getElementById("modalKicker");
const modalTitle = document.getElementById("modalTitle");
const modalSummary = document.getElementById("modalSummary");
const modalChallenge = document.getElementById("modalChallenge");
const modalApproach = document.getElementById("modalApproach");
const modalValue = document.getElementById("modalValue");
const modalTags = document.getElementById("modalTags");
let lastFocused = null;

function openModal(key) {
  const data = caseData[key];
  if (!data) return;
  lastFocused = document.activeElement;
  modalKicker.textContent = data.kicker;
  modalTitle.textContent = data.title;
  modalSummary.textContent = data.summary;
  modalChallenge.textContent = data.challenge;
  modalApproach.textContent = data.approach;
  modalValue.textContent = data.value;
  modalTags.innerHTML = data.tags.map(tag => `<span>${tag}</span>`).join("");
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  modal.querySelector(".modal-close").focus();
}

function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  if (lastFocused) lastFocused.focus();
}

document.querySelectorAll("[data-case]").forEach(card => {
  card.addEventListener("click", () => openModal(card.dataset.case));
});
document.querySelectorAll("[data-close-modal]").forEach(el => el.addEventListener("click", closeModal));

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeMenu();
    if (modal.classList.contains("open")) closeModal();
  }
});
