/* ==========================================================================
   Heart to Heart Lanka (H2H) — script.js
   Vanilla JS: nav, mobile menu, quick exit, scroll reveal, counters,
   FAQ accordion, contact form validation.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Sticky header shadow on scroll ---------- */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      if (window.scrollY > 8) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Mobile menu ---------- */
  var menuToggle = document.querySelector('.menu-toggle');
  var mobileMenu = document.querySelector('.mobile-menu');
  var menuClose = document.querySelector('.mobile-menu-close');

  function openMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    menuToggle && menuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    menuToggle && menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  menuToggle && menuToggle.addEventListener('click', openMenu);
  menuClose && menuClose.addEventListener('click', closeMenu);
  mobileMenu && mobileMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (entry.isIntersecting) {
          setTimeout(function () {
            entry.target.classList.add('in-view');
          }, (i % 6) * 80);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
  }

  /* ---------- Animated counters ---------- */
  var counters = document.querySelectorAll('[data-counter]');
  if (counters.length) {
    var animateCounter = function (el) {
      var target = parseInt(el.getAttribute('data-counter'), 10) || 0;
      var duration = 1400;
      var start = null;
      var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) { el.textContent = target.toLocaleString() + (el.getAttribute('data-suffix') || ''); return; }
      function step(ts) {
        if (!start) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var value = Math.floor(eased * target);
        el.textContent = value.toLocaleString() + (el.getAttribute('data-suffix') || '');
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    };
    if ('IntersectionObserver' in window) {
      var counterIo = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterIo.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      counters.forEach(function (el) { counterIo.observe(el); });
    } else {
      counters.forEach(animateCounter);
    }
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var btn = item.querySelector('.faq-question');
    var answer = item.querySelector('.faq-answer');
    if (!btn || !answer) return;
    btn.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');
      // Close siblings within the same FAQ group
      var group = item.closest('.faq-list');
      if (group) {
        group.querySelectorAll('.faq-item.open').forEach(function (openItem) {
          if (openItem !== item) {
            openItem.classList.remove('open');
            openItem.querySelector('.faq-answer').style.maxHeight = null;
            openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
          }
        });
      }
      if (isOpen) {
        item.classList.remove('open');
        answer.style.maxHeight = null;
        btn.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ---------- Contact form validation ---------- */
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    var successBox = document.getElementById('formSuccess');

    var validators = {
      name: function (v) { return v.trim().length >= 2; },
      email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); },
      phone: function (v) { return v.trim() === '' || /^[0-9+\-\s()]{7,15}$/.test(v.trim()); },
      subject: function (v) { return v.trim().length >= 2; },
      message: function (v) { return v.trim().length >= 10; }
    };

    var messages = {
      name: 'Please enter your name (at least 2 characters).',
      email: 'Please enter a valid email address.',
      phone: 'Please enter a valid phone number, or leave this blank.',
      subject: 'Please let us know the subject of your message.',
      message: 'Please enter a message of at least 10 characters.'
    };

    function showError(field, show) {
      var input = contactForm.querySelector('[name="' + field + '"]');
      var errorEl = contactForm.querySelector('.field-error[data-for="' + field + '"]');
      if (!input) return;
      if (show) {
        input.classList.add('error');
        input.setAttribute('aria-invalid', 'true');
        if (errorEl) { errorEl.textContent = messages[field]; errorEl.classList.add('show'); }
      } else {
        input.classList.remove('error');
        input.removeAttribute('aria-invalid');
        if (errorEl) errorEl.classList.remove('show');
      }
    }

    Object.keys(validators).forEach(function (field) {
      var input = contactForm.querySelector('[name="' + field + '"]');
      if (!input) return;
      input.addEventListener('blur', function () {
        showError(field, !validators[field](input.value));
      });
    });

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;
      Object.keys(validators).forEach(function (field) {
        var input = contactForm.querySelector('[name="' + field + '"]');
        if (!input) return;
        var ok = validators[field](input.value);
        showError(field, !ok);
        if (!ok) valid = false;
      });

      if (!valid) {
        var firstError = contactForm.querySelector('.error');
        if (firstError) firstError.focus();
        return;
      }

      // No backend wired up yet — simulate a successful, confidential submission.
      contactForm.reset();
      if (successBox) {
        successBox.classList.add('show');
        successBox.setAttribute('tabindex', '-1');
        successBox.focus();
        successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

});
