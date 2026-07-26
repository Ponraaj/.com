import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let stickyMaskFrame = 0;

function updateStickyContentMasks() {
  const headings = Array.from(
    document.querySelectorAll<HTMLElement>('.sticky-heading, .prose > h2'),
  );
  const activeHeadings = headings.filter((heading) => {
    const rect = heading.getBoundingClientRect();
    return rect.top <= 0 && rect.bottom > 0;
  });
  const targets = new Set<HTMLElement>();

  headings.forEach((heading) => {
    let sibling = heading.nextElementSibling;

    if (heading.classList.contains('sticky-heading')) {
      if (sibling instanceof HTMLElement) targets.add(sibling);
      return;
    }

    while (sibling && !sibling.matches('.sticky-heading, .prose > h2')) {
      if (sibling instanceof HTMLElement) targets.add(sibling);
      sibling = sibling.nextElementSibling;
    }
  });

  targets.forEach((target) => {
    const targetRect = target.getBoundingClientRect();
    const overlap = activeHeadings.reduce((maximum, heading) => {
      const headingRect = heading.getBoundingClientRect();
      return Math.max(maximum, headingRect.bottom - targetRect.top);
    }, 0);

    target.style.clipPath =
      overlap > 0 ? `inset(${Math.min(targetRect.height, overlap)}px 0 0)` : '';
  });
}

function scheduleStickyContentMasks() {
  if (stickyMaskFrame) return;

  stickyMaskFrame = requestAnimationFrame(() => {
    stickyMaskFrame = 0;
    updateStickyContentMasks();
  });
}

window.addEventListener('scroll', scheduleStickyContentMasks, {
  passive: true,
});
window.addEventListener('resize', scheduleStickyContentMasks);

function initScroll() {
  ScrollTrigger.getAll().forEach((st) => st.kill());

  const pageBg = document.querySelector('.page-bg');
  if (pageBg) {
    gsap.to(pageBg, {
      '--background-shift': '-15vh',
      ease: 'none',
      scrollTrigger: {
        trigger: pageBg,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      },
    });
  }

  const progressBar = document.querySelector('#reading-progress-bar');
  if (progressBar) {
    gsap.set(progressBar, { scaleX: 0 });
    gsap.to(progressBar, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5,
      },
    });
  }

  ScrollTrigger.refresh();
  scheduleStickyContentMasks();
}

document.addEventListener('astro:page-load', initScroll);

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initScroll);
} else {
  initScroll();
}
