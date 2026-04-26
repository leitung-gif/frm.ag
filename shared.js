/* ═══════════════════════════════════════════════
   FORUM AARGAU — SHARED JAVASCRIPT
   Loader, Lenis, GSAP, Nav, Cookie Consent, Form
   ═══════════════════════════════════════════════ */
(function () {
  'use strict';

  // ── 1. LOADING SCREEN ─────────────────────
  const loader = document.getElementById('loader');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('done');
        setTimeout(() => loader.style.display = 'none', 900);
      }, 600);
    });
  }

  // ── VIDEO FALLBACK ──────────────────────────
  document.querySelectorAll('video').forEach(vid => {
    vid.addEventListener('error', function() {
      // Show fallback image if available
      const fallback = this.parentElement.querySelector('.hero-fallback');
      if (fallback) fallback.style.display = 'block';
      this.style.display = 'none';
    }, true);
  });

  // ── 2. LENIS SMOOTH SCROLL ────────────────
  if (typeof Lenis !== 'undefined') {
    const lenis = new Lenis({ duration: 1.2, smoothWheel: true });
    function raf(t) { lenis.raf(t); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(t => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    }
  }

  // ── 3. HEADER SCROLL BEHAVIOR ─────────────
  const header = document.getElementById('site-header');
  if (header) {
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const cur = window.pageYOffset;
      if (cur > 120 && cur > lastScroll) header.classList.add('hide');
      else header.classList.remove('hide');
      lastScroll = cur;
    }, { passive: true });
  }

  // ── 4. BURGER MENU ────────────────────────
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      const isOpen = mobileMenu.classList.contains('open');
      document.body.style.overflow = isOpen ? 'hidden' : '';
      burger.setAttribute('aria-expanded', isOpen);
    });
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        burger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ── 5. GSAP ANIMATIONS ───────────────────
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    // Hero parallax
    const heroMedia = document.querySelector('.hero-media img, .hero-media video');
    if (heroMedia) {
      gsap.to(heroMedia, {
        yPercent: 15, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', scrub: true }
      });
    }
    // Hero title reveal
    gsap.from('.gs-title', { y: '110%', duration: 1.5, stagger: .15, ease: 'power4.out', delay: .8 });

    // Generic scroll up reveals
    gsap.utils.toArray('.gs-up').forEach(el => {
      gsap.fromTo(el,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: .9, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 87%' }
        }
      );
    });

    // Split blocks
    gsap.utils.toArray('.gs-slide-left').forEach(el => {
      gsap.from(el, { x: '-40%', opacity: 0, duration: 1.4, ease: 'power4.out',
        scrollTrigger: { trigger: el, start: 'top 78%' }
      });
    });
    gsap.utils.toArray('.gs-slide-right').forEach(el => {
      gsap.from(el, { x: '40%', opacity: 0, duration: 1.4, ease: 'power4.out',
        scrollTrigger: { trigger: el, start: 'top 78%' }
      });
    });

    // Thema rows
    gsap.utils.toArray('.gs-thema').forEach((el, i) => {
      gsap.from(el, {
        x: i % 2 === 0 ? '-15%' : '15%', opacity: 0, duration: 1.1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 82%' }
      });
    });
  }

  // ── 6. COOKIE CONSENT ─────────────────────
  const cookieBanner = document.getElementById('cookie-banner');
  if (cookieBanner) {
    if (!localStorage.getItem('fa_cookies')) {
      setTimeout(() => cookieBanner.classList.add('show'), 1500);
    }
    cookieBanner.querySelectorAll('.cookie-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        localStorage.setItem('fa_cookies', btn.dataset.action || 'accepted');
        cookieBanner.classList.remove('show');
      });
    });
  }

  // ── 7. FORM HANDLER ──────────────────────
  const joinForm = document.getElementById('joinForm');
  if (joinForm) {
    joinForm.addEventListener('submit', e => {
      e.preventDefault();
      const btn = joinForm.querySelector('.btn-submit');
      const orig = btn.textContent;
      btn.textContent = 'VIELEN DANK!';
      btn.style.background = '#16a34a';
      setTimeout(() => { btn.textContent = orig; btn.style.background = ''; }, 3000);
    });
  }

  // ── 8. FAQ ACCORDION ─────────────────────
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    if (q && a) {
      q.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        // Close all
        document.querySelectorAll('.faq-item.open').forEach(open => {
          open.classList.remove('open');
          open.querySelector('.faq-a').style.maxHeight = '0';
        });
        if (!isOpen) {
          item.classList.add('open');
          a.style.maxHeight = a.scrollHeight + 'px';
        }
      });
    }
  });

  // ── 9. SMOOTH ANCHOR SCROLLING ────────────
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    });
  });

}());
