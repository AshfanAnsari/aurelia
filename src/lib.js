/* Shared helpers + the scroll/reveal/media behaviours that run once after mount.
   Ported 1:1 from the original single-file build. */

export const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const SAVE_DATA = !!(navigator.connection && navigator.connection.saveData);

/* Base-relative public paths — videos and images are real files, never data URIs. */
export const BASE = import.meta.env.BASE_URL;
export const media = (name) => BASE + name;
export const img = (name) => BASE + 'img/' + name;

export function inr(n) {
  return '₹' + Math.round(n).toLocaleString('en-IN');
}

export function isMobile() {
  return window.matchMedia('(max-width: 900px)').matches;
}

export function initReveal() {
  const els = document.querySelectorAll('.rv');
  if (!('IntersectionObserver' in window) || REDUCED) {
    els.forEach((e) => e.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    },
    { threshold: 0.05, rootMargin: '0px 0px 12% 0px' }
  );
  els.forEach((e) => io.observe(e));
  setTimeout(() => {
    document.querySelectorAll('.rv:not(.in)').forEach((e) => e.classList.add('in'));
  }, 1000);
}

export function initVideoPause() {
  if (!('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        const v = en.target;
        if (en.isIntersecting) {
          if (!v.dataset.hold) {
            const p = v.play();
            if (p && p.catch) p.catch(() => {});
          }
        } else {
          v.pause();
        }
      });
    },
    { threshold: 0.12 }
  );
  document.querySelectorAll('video').forEach((v) => io.observe(v));
}

export function initCounters() {
  const nums = document.querySelectorAll('[data-count]');
  if (!nums.length) return;
  function run(el) {
    const target = parseFloat(el.getAttribute('data-count'));
    const suffix = el.getAttribute('data-suffix') || '';
    if (REDUCED) {
      el.textContent = target + suffix;
      return;
    }
    let start = null;
    function step(ts) {
      if (!start) start = ts;
      const p = Math.min((ts - start) / 1400, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if (!('IntersectionObserver' in window)) {
    nums.forEach(run);
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          run(en.target);
          io.unobserve(en.target);
        }
      });
    },
    { threshold: 0.4 }
  );
  nums.forEach((n) => io.observe(n));
}

export function initSlimBar() {
  const bar = document.getElementById('slimBar');
  const hero = document.getElementById('hero');
  if (!bar || !hero) return;
  function onScroll() {
    const past = window.scrollY > hero.offsetTop + hero.offsetHeight - 90;
    bar.classList.toggle('show', past);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

export function initVanilla() {
  initReveal();
  initVideoPause();
  initCounters();
  initSlimBar();
}
