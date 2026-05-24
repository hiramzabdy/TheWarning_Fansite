/**
 * GSAP-powered scroll reveal animations.
 * Triggers staggered reveals when sections enter the viewport.
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initScrollReveals() {
  // ── Reveal elements with .reveal class ──
  const reveals = document.querySelectorAll('.reveal');
  reveals.forEach((el) => {
    gsap.fromTo(el,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    );
  });

  // ── Section labels — fade in ──
  const labels = document.querySelectorAll('.section-label-anim');
  labels.forEach((label) => {
    gsap.fromTo(label,
      { opacity: 0, x: -20 },
      {
        opacity: 1, x: 0, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: label, start: 'top 90%' },
      }
    );
  });

  // ── Timeline items staggered ──
  const timelineItems = document.querySelectorAll('.timeline-item-anim');
  timelineItems.forEach((item, i) => {
    gsap.fromTo(item,
      { opacity: 0, x: -30 },
      {
        opacity: 1, x: 0, duration: 0.7,
        delay: i * 0.08,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
      }
    );
  });

  // ── Stat cards stagger ──
  const statCards = document.querySelectorAll('.stat-card-anim');
  statCards.forEach((card, i) => {
    gsap.fromTo(card,
      { opacity: 0, scale: 0.9, y: 20 },
      {
        opacity: 1, scale: 1, y: 0, duration: 0.5,
        delay: i * 0.1,
        ease: 'back.out(1.4)',
        scrollTrigger: {
          trigger: card,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
      }
    );
  });

  // ── Album cards stagger ──
  const albumCards = document.querySelectorAll('.album-card-anim');
  albumCards.forEach((card, i) => {
    gsap.fromTo(card,
      { opacity: 0, y: 50 },
      {
        opacity: 1, y: 0, duration: 0.6,
        delay: i * 0.12,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
      }
    );
  });

  // ── Quote cards ──
  const quoteCards = document.querySelectorAll('.quote-card-anim');
  quoteCards.forEach((card, i) => {
    gsap.fromTo(card,
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0, duration: 0.7,
        delay: i * 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      }
    );
  });

  // ── Stats counter animation ──
  const counters = document.querySelectorAll('.stat-number-anim');
  counters.forEach((counter) => {
    const target = parseInt(counter.dataset.target || '0', 10);
    const suffix = counter.dataset.suffix || '';
    ScrollTrigger.create({
      trigger: counter,
      start: 'top 90%',
      onEnter: () => {
        gsap.to(counter, {
          innerText: target,
          duration: 2,
          ease: 'power2.out',
          snap: { innerText: 1 },
          onUpdate: () => {
            const val = parseInt(counter.innerText, 10);
            counter.innerText = val.toLocaleString() + suffix;
          },
          onComplete: () => {
            counter.innerText = target.toLocaleString() + suffix;
          },
        });
      },
      once: true,
    });
  });
}
