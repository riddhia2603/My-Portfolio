// Lightweight interactions; no framework or build step required.
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Reveal content as it enters the viewport.
const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && !reducedMotion) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -25px 0px" });
  revealItems.forEach(item => {
    // Browsers may restore the previous scroll position on refresh. Make
    // already-passed content visible too, otherwise it can stay invisible.
    if (item.getBoundingClientRect().top < window.innerHeight) {
      item.classList.add("is-visible");
    } else {
      revealObserver.observe(item);
    }
  });
} else {
  revealItems.forEach(item => item.classList.add("is-visible"));
}

// Rotating text in the hero.
const roleElement = document.getElementById("typedRole");
const roles = ["web development", "creative problem solving", "learning by building", "programming fundamentals"];
if (roleElement && !reducedMotion) {
  let roleIndex = 0, charIndex = roles[0].length, deleting = true;
  function typeRole() {
    const current = roles[roleIndex];
    roleElement.textContent = current.slice(0, charIndex);
    let delay = deleting ? 42 : 78;
    if (deleting) {
      charIndex--;
      if (charIndex < 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        charIndex = 0;
        delay = 300;
      }
    } else {
      charIndex++;
      if (charIndex > roles[roleIndex].length) {
        deleting = true;
        delay = 1350;
      }
    }
    window.setTimeout(typeRole, delay);
  }
  window.setTimeout(typeRole, 1500);
}

// Mobile navigation with accessible state.
const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");
function closeMenu() {
  if (!menuToggle || !nav) return;
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
  nav.classList.remove("open");
  document.body.classList.remove("menu-open");
}
if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const open = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!open));
    menuToggle.setAttribute("aria-label", open ? "Open navigation" : "Close navigation");
    nav.classList.toggle("open", !open);
    document.body.classList.toggle("menu-open", !open);
  });
  nav.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
  window.addEventListener("resize", () => { if (window.innerWidth > 760) closeMenu(); });
}

// Scroll progress and back-to-top.
const progress = document.getElementById("scrollProgress");
const toTop = document.getElementById("toTop");
function updateScrollUI() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  if (progress) progress.style.width = `${scrollable > 0 ? window.scrollY / scrollable * 100 : 0}%`;
  if (toTop) toTop.classList.toggle("visible", window.scrollY > 450);
}
window.addEventListener("scroll", updateScrollUI, { passive: true });
updateScrollUI();
if (toTop) toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" }));
const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

// Certificate lightbox.
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxTitle = document.getElementById("lightboxTitle");
const lightboxClose = document.getElementById("lightboxClose");
document.querySelectorAll(".certificate-card").forEach(card => {
  card.addEventListener("click", () => {
    if (!lightbox || !lightboxImage) return;
    lightboxImage.src = card.dataset.image;
    lightboxImage.alt = card.dataset.title || "Certificate";
    if (lightboxTitle) lightboxTitle.textContent = card.dataset.title || "Certificate";
    if (typeof lightbox.showModal === "function") lightbox.showModal();
    else window.open(card.dataset.image, "_blank", "noopener");
  });
});
function closeLightbox() {
  if (lightbox && lightbox.open) lightbox.close();
}
if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
if (lightbox) {
  lightbox.addEventListener("click", event => { if (event.target === lightbox) closeLightbox(); });
  lightbox.addEventListener("close", () => { if (lightboxImage) lightboxImage.src = ""; });
}

// Subtle pointer glow on pointer-capable devices only.
if (window.matchMedia("(hover: hover) and (pointer: fine)").matches && !reducedMotion) {
  const glow = document.createElement("div");
  glow.setAttribute("aria-hidden", "true");
  glow.style.cssText = "position:fixed;left:0;top:0;width:220px;height:220px;pointer-events:none;z-index:0;border-radius:50%;background:radial-gradient(circle,rgba(169,155,255,.07),transparent 68%);transform:translate(-50%,-50%);opacity:0;transition:opacity .25s;";
  document.body.appendChild(glow);
  window.addEventListener("pointermove", event => {
    glow.style.left = `${event.clientX}px`;
    glow.style.top = `${event.clientY}px`;
    glow.style.opacity = "1";
  }, { passive: true });
  document.addEventListener("pointerleave", () => { glow.style.opacity = "0"; });
}


// A little art-directed movement: layered project cards respond gently to the pointer.
if (window.matchMedia("(hover: hover) and (pointer: fine)").matches && !reducedMotion) {
  document.querySelectorAll(".project-card, .skill-card").forEach(card => {
    card.addEventListener("pointermove", event => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.setProperty("--pointer-x", `${x * 12}px`);
      card.style.setProperty("--pointer-y", `${y * 12}px`);
    });
    card.addEventListener("pointerleave", () => {
      card.style.removeProperty("--pointer-x");
      card.style.removeProperty("--pointer-y");
    });
  });
  const art = document.querySelector(".hero-art");
  const frame = document.querySelector(".portrait-frame");
  if (art && frame) {
    art.addEventListener("pointermove", event => {
      const rect = art.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      frame.style.animation = "none";
      frame.style.transform = `rotate(3.5deg) rotateY(${x * 5}deg) rotateX(${-y * 5}deg) translate(${x * 4}px,${y * 4}px)`;
    });
    art.addEventListener("pointerleave", () => {
      frame.style.transform = "";
      frame.style.animation = "";
    });
  }
}
