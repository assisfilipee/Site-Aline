(() => {
  const header = document.querySelector(".header");
  if (!header) return;

  const update = () => {
    const y = window.scrollY || document.documentElement.scrollTop || 0;

    // mobile responde mais rápido
    const limit = window.innerWidth <= 768 ? 10 : 50;

    header.classList.toggle("is-scrolled", y > limit);
  };

  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();
})();

(() => {
  const videos = Array.from(document.querySelectorAll(".ig-card--video video.ig-media"));
  if (!videos.length) return;

  // autoplay só quando visível (economiza bateria e CPU)
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const v = entry.target;
        if (entry.isIntersecting) {
          v.play().catch(() => {});
        } else {
          v.pause();
        }
      });
    },
    { threshold: 0.35 }
  );

  videos.forEach((v) => io.observe(v));

  // toggle botão
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-video-toggle]");
    if (!btn) return;

    const media = btn.closest(".ig-card__media");
    const v = media ? media.querySelector("video.ig-media") : null;
    if (!v) return;

    if (v.paused) {
      v.play().catch(() => {});
      btn.textContent = "❚❚";
    } else {
      v.pause();
      btn.textContent = "▶";
    }
  });
})();

/* ==================================================
   HERO SLIDER (1 imagem por vez / troca a cada 4s)
   - cria dots automaticamente
   - pausa no hover e no foco
   - respeita prefers-reduced-motion
================================================== */
(() => {
  const slider = document.querySelector("[data-slider]");
  if (!slider) return;

  const slides = Array.from(slider.querySelectorAll(".hero-slider__slide"));
  const dotsWrap = slider.querySelector(".hero-slider__dots");
  const interval = Number(slider.dataset.interval || 4000);

  if (slides.length <= 1) return;

  // respeita configurações de acessibilidade
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const tick = reduceMotion ? Math.max(interval, 8000) : interval;

  let index = slides.findIndex((s) => s.classList.contains("is-active"));
  if (index < 0) index = 0;

  // dots
  const dots = [];
  if (dotsWrap) {
    dotsWrap.innerHTML = "";
    slides.forEach((_, i) => {
      const dot = document.createElement("span");
      dot.className = "hero-slider__dot" + (i === index ? " is-active" : "");
      dotsWrap.appendChild(dot);
      dots.push(dot);
    });
  }

  const setActive = (next) => {
    slides[index].classList.remove("is-active");
    if (dots[index]) dots[index].classList.remove("is-active");

    index = next;

    slides[index].classList.add("is-active");
    if (dots[index]) dots[index].classList.add("is-active");
  };

  const next = () => setActive((index + 1) % slides.length);

  let timer = setInterval(next, tick);

  const pause = () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  };

  const play = () => {
    if (!timer) {
      timer = setInterval(next, tick);
    }
  };

  // pausa no hover/foco (premium + UX)
  slider.addEventListener("mouseenter", pause);
  slider.addEventListener("mouseleave", play);
  slider.addEventListener("focusin", pause);
  slider.addEventListener("focusout", play);
})();
