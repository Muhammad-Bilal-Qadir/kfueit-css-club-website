/**
 * KFUEIT CSS Club — script.js
 * Fixes applied:
 *  - Preloader: hard 3-second max timeout so it ALWAYS hides,
 *    even if external CDN fonts/icons are slow or offline.
 *  - AOS reveal: immediate reveal for above-the-fold elements
 *    so hero content is never stuck invisible.
 *  - All other features intact.
 */

'use strict';

/* ================================================================
   1. PRELOADER
   Hides after load OR after 3 s max — whichever comes first.
   Uses a fallback timeout so slow/offline CDNs can't block it.
   ================================================================ */
(function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  let hidden = false;

  const hide = () => {
    if (hidden) return;
    hidden = true;

    preloader.style.opacity    = '0';
    preloader.style.visibility = 'hidden';
    preloader.style.transition = 'opacity 0.5s ease, visibility 0.5s ease';

    // Remove from DOM after transition so it can never block clicks
    setTimeout(() => {
      if (preloader.parentNode) preloader.parentNode.removeChild(preloader);
    }, 550);
  };

  // Hide when everything (including images/fonts) is loaded
  if (document.readyState === 'complete') {
    setTimeout(hide, 200);
  } else {
    window.addEventListener('load', () => setTimeout(hide, 300));
  }

  // Hard fallback: always hide after 3 seconds no matter what
  setTimeout(hide, 3000);
})();


/* ================================================================
   2. NAVBAR — scrolled class + mobile collapse auto-close
   ================================================================ */
(function initNavbar() {
  const nav     = document.getElementById('mainNav');
  const navMenu = document.getElementById('navMenu');
  if (!nav) return;

  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (navMenu) {
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        const toggler = nav.querySelector('.navbar-toggler');
        if (toggler && getComputedStyle(toggler).display !== 'none') {
          try {
            const bsCollapse = window.bootstrap &&
              bootstrap.Collapse.getOrCreateInstance(navMenu);
            if (bsCollapse) bsCollapse.hide();
          } catch (e) { /* Bootstrap not loaded yet — safe to ignore */ }
        }
      });
    });
  }
})();


/* ================================================================
   3. ACTIVE NAV LINK ON SCROLL
   ================================================================ */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('#mainNav .nav-link[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  const setActive = (id) => {
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + id);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
  );

  sections.forEach(sec => observer.observe(sec));
})();


/* ================================================================
   4. SMOOTH SCROLLING — uses scrollIntoView so the browser
      automatically honours the CSS scroll-margin-top on each
      section, giving pixel-perfect alignment with zero manual
      offset arithmetic.
   ================================================================ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      // scrollIntoView respects CSS scroll-margin-top automatically.
      // #home scrolls to absolute top so the full hero is visible.
      if (targetId === '#home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();


/* ================================================================
   5. SCROLL-TO-TOP BUTTON (injected if not in HTML)
   ================================================================ */
(function initScrollTop() {
  let btn = document.getElementById('scrollTop');

  if (!btn) {
    btn = document.createElement('button');
    btn.id        = 'scrollTop';
    btn.title     = 'Back to top';
    btn.innerHTML = '<i class="bi bi-arrow-up"></i>';
    btn.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(btn);
  }

  const toggle = () => btn.classList.toggle('show', window.scrollY > 400);
  window.addEventListener('scroll', toggle, { passive: true });
  toggle();

  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();


/* ================================================================
   6. COUNTER ANIMATION
   Elements: .counter[data-target]
   Animates once when element scrolls into view.
   ================================================================ */
(function initCounters() {
  const counters = document.querySelectorAll('.counter[data-target]');
  if (!counters.length) return;

  const animateCounter = (el) => {
    const target   = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const steps    = 60;
    const interval = duration / steps;
    let   step     = 0;

    // ease-out quad
    const easeOut = (t) => t * (2 - t);

    const timer = setInterval(() => {
      step++;
      el.textContent = Math.round(easeOut(step / steps) * target).toLocaleString();
      if (step >= steps) {
        el.textContent = target.toLocaleString();
        clearInterval(timer);
      }
    }, interval);
  };

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  counters.forEach(c => observer.observe(c));
})();


/* ================================================================
   7. SCROLL-REVEAL  (lightweight, no external library needed)
   Immediately reveals elements already visible on load (hero),
   then reveals the rest as they scroll into view.
   ================================================================ */
(function initScrollReveal() {
  const elements = document.querySelectorAll('[data-aos]');
  if (!elements.length) return;

  const reveal = (el) => {
    const delay = parseInt(
      el.dataset.aosDelay || el.getAttribute('data-aos-delay') || '0',
      10
    );
    setTimeout(() => el.classList.add('aos-animate'), delay);
  };

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          reveal(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
  );

  elements.forEach(el => {
    // If already in viewport on page load, reveal immediately
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      reveal(el);
    } else {
      observer.observe(el);
    }
  });
})();


/* ================================================================
   8. DARK MODE TOGGLE
   Persists preference in localStorage.
   ================================================================ */
(function initDarkMode() {
  const html  = document.documentElement;
  const btn   = document.getElementById('darkModeToggle');
  const KEY   = 'kfueit-theme';

  const updateIcon = (button, isDark) => {
    if (!button) return;
    const icon = button.querySelector('i');
    if (icon) icon.className = isDark ? 'bi bi-sun-fill' : 'bi bi-moon-fill';
  };

  // Restore saved preference
  const saved = localStorage.getItem(KEY);
  if (saved === 'dark') {
    html.setAttribute('data-theme', 'dark');
    updateIcon(btn, true);
  }

  if (!btn) return;

  btn.addEventListener('click', () => {
    const isDark = html.getAttribute('data-theme') === 'dark';
    const next   = isDark ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem(KEY, next);
    updateIcon(btn, next === 'dark');
  });
})();


/* ================================================================
   9. FORM VALIDATION
   Real-time + on-submit validation for membership & contact forms.
   ================================================================ */
(function initFormValidation() {

  function validateField(field) {
    const value = field.value.trim();
    let valid = true;
    let msg   = '';

    if (field.required && !value) {
      valid = false; msg = 'This field is required.';
    } else if (field.type === 'email' && value) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        valid = false; msg = 'Enter a valid email address.';
      }
    } else if (field.type === 'tel' && value) {
      if (!/^[+]?[\d\s\-]{10,15}$/.test(value)) {
        valid = false; msg = 'Enter a valid phone number.';
      }
    } else if (field.minLength > 0 && value.length < field.minLength) {
      valid = false; msg = 'Minimum ' + field.minLength + ' characters required.';
    }

    field.classList.toggle('is-valid',   valid && !!value);
    field.classList.toggle('is-invalid', !valid);

    let feedback = field.nextElementSibling;
    if (!feedback || !feedback.classList.contains('invalid-feedback')) {
      feedback = document.createElement('div');
      feedback.className = 'invalid-feedback';
      field.insertAdjacentElement('afterend', feedback);
    }
    feedback.textContent = msg;

    return valid;
  }

  function attachValidation(form) {
    if (!form) return;
    const fields = form.querySelectorAll('input, select, textarea');

    fields.forEach(field => {
      field.addEventListener('blur',  () => validateField(field));
      field.addEventListener('input', () => {
        if (field.classList.contains('is-invalid')) validateField(field);
      });
    });

    form.addEventListener('submit', (e) => {
      let allValid = true;
      fields.forEach(field => { if (!validateField(field)) allValid = false; });

      if (!allValid) {
        e.preventDefault();
        e.stopPropagation();
        const firstInvalid = form.querySelector('.is-invalid');
        if (firstInvalid) {
          const navH = document.getElementById('mainNav')
            ? document.getElementById('mainNav').offsetHeight : 70;
          window.scrollTo({
            top: firstInvalid.getBoundingClientRect().top + window.scrollY - navH - 20,
            behavior: 'smooth'
          });
        }
      }
    });
  }

  attachValidation(document.getElementById('membershipForm'));
  attachValidation(document.getElementById('contactForm'));
  document.querySelectorAll('form.needs-validation').forEach(f => attachValidation(f));
})();


/* ================================================================
   EVENT GALLERY — Modal thumbnail builder + Lightbox
   ================================================================
   Fix log:
   - Grid ID now derived from modal's own id attribute (not forEach
     index) so it's immune to DOM reordering.
   - Broken image paths are tracked; lightbox skips them and only
     navigates through successfully loaded photos.
   - built flag now checks grid.children.length so a re-opened
     modal with cleared DOM rebuilds correctly.
   ================================================================ */
(function initEventGallery() {

  /* --- Lightbox elements --- */
  const lb        = document.getElementById('egmLightbox');
  const lbImg     = document.getElementById('egmLbImg');
  const lbCounter = document.getElementById('egmLbCounter');
  const lbClose   = document.getElementById('egmLbClose');
  const lbPrev    = document.getElementById('egmLbPrev');
  const lbNext    = document.getElementById('egmLbNext');

  if (!lb) return;

  /* loadedPhotos: only paths whose <img> loaded successfully */
  let loadedPhotos = [];
  let currentIndex = 0;

  function showPhoto(index) {
    if (!loadedPhotos.length) return;
    currentIndex = (index + loadedPhotos.length) % loadedPhotos.length;
    lbImg.src = loadedPhotos[currentIndex];
    lbCounter.textContent = (currentIndex + 1) + ' / ' + loadedPhotos.length;
  }

  function openLightbox(photos, startIndex) {
    loadedPhotos = photos;           /* receive only the loaded subset */
    lb.classList.add('active');
    document.body.style.overflow = 'hidden';
    showPhoto(startIndex);
  }

  function closeLightbox() {
    lb.classList.remove('active');
    document.body.style.overflow = '';
    lbImg.src = '';
  }

  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click',  () => showPhoto(currentIndex - 1));
  lbNext.addEventListener('click',  () => showPhoto(currentIndex + 1));

  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('active')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  showPhoto(currentIndex - 1);
    if (e.key === 'ArrowRight') showPhoto(currentIndex + 1);
  });

  lb.addEventListener('click', (e) => {
    if (e.target === lb) closeLightbox();
  });

  /* --- Build thumbnail grids --- */
  document.querySelectorAll('.event-gallery-modal').forEach((modal) => {

    /*
     * FIX: Derive grid ID from the modal's own id, not forEach index.
     * eventModal1 → egmGrid1, eventModal2 → egmGrid2, etc.
     */
    const gridId = modal.id.replace('eventModal', 'egmGrid');

    modal.addEventListener('show.bs.modal', () => {
      const grid = document.getElementById(gridId);
      if (!grid) {
        console.warn('Event gallery: grid not found for', gridId);
        return;
      }

      /* Skip rebuild if thumbnails already rendered */
      if (grid.children.length > 0) return;

      /* Parse photo paths */
      let allPaths = [];
      try {
        allPaths = JSON.parse(modal.dataset.photos || '[]');
      } catch (err) {
        console.warn('Event gallery: invalid JSON in data-photos on', modal.id);
        return;
      }

      if (!allPaths.length) return;

      /*
       * successPaths keeps track of images that loaded OK so the
       * lightbox never tries to display a broken image.
       */
      const successPaths = [];

      allPaths.forEach((src, idx) => {
        const cell = document.createElement('div');
        cell.className = 'egm-thumb';
        cell.setAttribute('role', 'button');
        cell.setAttribute('tabindex', '0');
        cell.setAttribute('aria-label', 'View photo ' + (idx + 1));

        const img = document.createElement('img');
        img.alt     = 'Event photo ' + (idx + 1);
        img.loading = 'lazy';

        img.onload = () => {
          /* Track successfully loaded paths */
          successPaths.push(src);
        };

        img.onerror = () => {
          /* Replace broken img with placeholder icon */
          img.remove();
          const ph = document.createElement('div');
          ph.className = 'egm-thumb-placeholder';
          ph.innerHTML = '<i class="bi bi-image"></i>';
          cell.appendChild(ph);
          /* Remove click handler so placeholder doesn't open lightbox */
          cell.style.cursor = 'default';
          cell.replaceWith(cell.cloneNode(true)); /* strip listeners */
        };

        /* Set src AFTER attaching handlers */
        img.src = src;
        cell.appendChild(img);

        /* Click opens lightbox using only loaded images */
        cell.addEventListener('click', () => {
          if (!successPaths.length) return;
          /* Find position of this src in successPaths */
          const pos = successPaths.indexOf(src);
          openLightbox([...successPaths], pos >= 0 ? pos : 0);
        });

        cell.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            cell.click();
          }
        });

        grid.appendChild(cell);
      });
    });

    modal.addEventListener('hide.bs.modal', closeLightbox);
  });

})();
