"use strict";

const body = document.body;
const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const backToTop = document.querySelector(".back-to-top");
const heroVideo = document.querySelector(".hero-video");
const mouseLight = document.querySelector(".mouse-light");

const dismissLoader = () => body.classList.add("loaded");
document.addEventListener("DOMContentLoaded", () => window.setTimeout(dismissLoader, 250));
window.addEventListener("load", dismissLoader, { once: true });
window.setTimeout(dismissLoader, 2200);

const updateScrollState = () => {
  const scrolled = window.scrollY > 28;
  header?.classList.toggle("scrolled", scrolled);
  backToTop?.classList.toggle("visible", window.scrollY > 650);

  if (heroVideo && window.innerWidth > 768) {
    heroVideo.style.transform = `translateY(${window.scrollY * 0.12}px) scale(1.05)`;
  }
};

window.addEventListener("scroll", updateScrollState, { passive: true });
updateScrollState();

menuButton?.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  body.classList.toggle("menu-open", open);
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "關閉選單" : "開啟選單");
});

navLinks?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    body.classList.remove("menu-open");
    menuButton?.setAttribute("aria-expanded", "false");
  });
});

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("is-visible");
    observer.unobserve(entry.target);
  });
}, { threshold: 0.12, rootMargin: "0px 0px -45px" });

document.querySelectorAll(".reveal").forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
  revealObserver.observe(element);
});

const counterObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const element = entry.target;
    const target = Number(element.dataset.target || 0);
    const start = performance.now();
    const duration = 1100;

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = String(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
    observer.unobserve(element);
  });
}, { threshold: 0.6 });

document.querySelectorAll(".counter").forEach((counter) => counterObserver.observe(counter));

document.querySelectorAll(".faq-list details").forEach((detail) => {
  detail.addEventListener("toggle", () => {
    if (!detail.open) return;
    document.querySelectorAll(".faq-list details[open]").forEach((other) => {
      if (other !== detail) other.open = false;
    });
  });
});

document.querySelectorAll(".ripple").forEach((button) => {
  button.addEventListener("click", (event) => {
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const wave = document.createElement("span");
    wave.className = "ripple-wave";
    wave.style.width = wave.style.height = `${size}px`;
    wave.style.left = `${event.clientX - rect.left - size / 2}px`;
    wave.style.top = `${event.clientY - rect.top - size / 2}px`;
    button.appendChild(wave);
    wave.addEventListener("animationend", () => wave.remove());
  });
});

if (mouseLight && window.matchMedia("(pointer: fine)").matches) {
  window.addEventListener("pointermove", (event) => {
    mouseLight.style.left = `${event.clientX}px`;
    mouseLight.style.top = `${event.clientY}px`;
  }, { passive: true });
}

const sakuraLayer = document.querySelector(".sakura-layer");
if (sakuraLayer && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  for (let index = 0; index < 16; index += 1) {
    const petal = document.createElement("span");
    petal.className = "petal";
    petal.style.left = `${Math.random() * 100}%`;
    petal.style.setProperty("--drift", `${Math.random() * 220 - 110}px`);
    petal.style.animationDuration = `${10 + Math.random() * 12}s`;
    petal.style.animationDelay = `${Math.random() * -18}s`;
    petal.style.transform = `scale(${0.55 + Math.random() * 0.8})`;
    sakuraLayer.appendChild(petal);
  }
}

const ctaBackground = document.querySelector(".cta-bg");
if (ctaBackground && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  window.addEventListener("scroll", () => {
    const rect = ctaBackground.parentElement.getBoundingClientRect();
    if (rect.bottom > 0 && rect.top < window.innerHeight) {
      ctaBackground.style.transform = `translateY(${rect.top * -0.035}px) scale(1.08)`;
    }
  }, { passive: true });
}

document.getElementById("year").textContent = String(new Date().getFullYear());
