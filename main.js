/* ============================================
   TRADECRAFT WEB DESIGN — MAIN JAVASCRIPT
   ============================================ */

'use strict';

// ---- DOM Ready ----
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileNav();
  initScrollReveal();
  initWorkTabs();
  initContactForm();
  initSmoothScroll();
  initCounters();
});

/* ============================================
   NAVBAR — Scroll effect & active states
   ============================================ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  let lastScroll = 0;
  let ticking = false;

  function updateNavbar() {
    const scroll = window.scrollY;

    if (scroll > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScroll = scroll;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateNavbar);
      ticking = true;
    }
  }, { passive: true });

  // Active nav link highlight based on section
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.style.color = '';
          const href = link.getAttribute('href');
          if (href === `#${id}`) {
            link.style.color = 'var(--col-gold-lt)';
          }
        });
      }
    });
  }, {
    rootMargin: '-40% 0px -40% 0px',
    threshold: 0
  });

  sections.forEach(section => sectionObserver.observe(section));
}

/* ============================================
   MOBILE NAV
   ============================================ */
function initMobileNav() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  const navCta = document.querySelector('.nav-cta');
  const body = document.body;

  if (!hamburger || !navLinks) return;

  function openMenu() {
    hamburger.classList.add('active');
    navLinks.classList.add('open');
    if (navCta) navCta.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    body.style.overflow = 'hidden';
  }

  function closeMenu() {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
    if (navCta) navCta.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    if (hamburger.classList.contains('active')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close when a nav link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (
      navLinks.classList.contains('open') &&
      !navLinks.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      closeMenu();
    }
  });
}

/* ============================================
   SCROLL REVEAL — Intersection Observer
   ============================================ */
function initScrollReveal() {
  const revealEls = document.querySelectorAll(
    '.reveal, .reveal-left, .reveal-right, .stat-card, .value-item'
  );

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Don't unobserve — keep visible
      }
    });
  }, {
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.1
  });

  revealEls.forEach(el => revealObserver.observe(el));
}

/* ============================================
   WORK TABS
   ============================================ */
function initWorkTabs() {
  const tabBtns = document.querySelectorAll('.work-tab-btn');
  const tabContents = document.querySelectorAll('.work-tab-content');

  if (!tabBtns.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.dataset.tab;

      // Update button states
      tabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      // Update content panels
      tabContents.forEach(content => {
        content.classList.remove('active');
      });

      const targetContent = document.getElementById(`tab-panel-${targetTab}`);
      if (targetContent) {
        targetContent.classList.add('active');
      }
    });
  });
}

/* ============================================
   CONTACT FORM
   ============================================ */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const successMsg = document.getElementById('form-success');
  const submitBtn = document.getElementById('contact-submit-btn');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Basic validation
    const name = document.getElementById('contact-name');
    const email = document.getElementById('contact-email-input');
    const message = document.getElementById('contact-message');

    if (!validateField(name, 'Please enter your name')) return;
    if (!validateField(email, 'Please enter a valid email address', validateEmail)) return;
    if (!validateField(message, 'Please enter your message')) return;

    // Show loading state
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="spin" aria-hidden="true"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg> Sending...';
    submitBtn.disabled = true;

    // Remove any previous submission error
    const prevErr = form.querySelector('.submit-error');
    if (prevErr) prevErr.remove();

    try {
      const response = await fetch('https://formspree.io/f/mrenlnkj', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      });

      if (response.ok) {
        // Show success message
        form.style.display = 'none';
        if (successMsg) {
          successMsg.classList.add('show');
        }

        // Reset after 8 seconds
        setTimeout(() => {
          form.style.display = 'block';
          form.reset();
          if (successMsg) {
            successMsg.classList.remove('show');
          }
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
          clearFieldErrors(form);
        }, 8000);
      } else {
        // Server returned an error
        throw new Error('Server error');
      }
    } catch (err) {
      // Restore button and show an inline error
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;

      const errMsg = document.createElement('p');
      errMsg.className = 'submit-error';
      errMsg.textContent = 'Sorry, something went wrong. Please try again or email us directly.';
      errMsg.style.cssText = 'color:#fc8181;font-size:0.85rem;margin-top:0.75rem;';
      form.querySelector('.form-submit-row').appendChild(errMsg);
    }
  });

  // Real-time validation on blur
  form.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('blur', () => {
      if (field.required && field.value.trim() === '') {
        setFieldError(field, 'This field is required');
      } else if (field.type === 'email' && field.value && !validateEmail(field.value)) {
        setFieldError(field, 'Please enter a valid email address');
      } else {
        clearFieldError(field);
      }
    });

    field.addEventListener('input', () => {
      if (field.classList.contains('error')) {
        clearFieldError(field);
      }
    });
  });
}

function validateField(field, errorMsg, validator = null) {
  if (!field.value.trim() || (validator && !validator(field.value))) {
    setFieldError(field, errorMsg);
    field.focus();
    return false;
  }
  clearFieldError(field);
  return true;
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function setFieldError(field, message) {
  field.classList.add('error');
  field.style.borderColor = '#e53e3e';
  field.style.boxShadow = '0 0 0 3px rgba(229,62,62,0.15)';

  // Remove existing error message
  const existingError = field.parentNode.querySelector('.field-error');
  if (existingError) existingError.remove();

  const error = document.createElement('span');
  error.className = 'field-error';
  error.textContent = message;
  error.style.cssText = 'display:block;font-size:0.78rem;color:#fc8181;margin-top:0.3rem;';
  field.parentNode.appendChild(error);
}

function clearFieldError(field) {
  field.classList.remove('error');
  field.style.borderColor = '';
  field.style.boxShadow = '';
  const existingError = field.parentNode.querySelector('.field-error');
  if (existingError) existingError.remove();
}

function clearFieldErrors(form) {
  form.querySelectorAll('.field-error').forEach(e => e.remove());
  form.querySelectorAll('input, textarea').forEach(f => {
    f.classList.remove('error');
    f.style.borderColor = '';
    f.style.boxShadow = '';
  });
}

/* ============================================
   SMOOTH SCROLL
   ============================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (!target) return;

      e.preventDefault();
      const navbarHeight = document.getElementById('navbar')?.offsetHeight || 70;
      const targetPos = target.getBoundingClientRect().top + window.scrollY - navbarHeight;

      window.scrollTo({
        top: targetPos,
        behavior: 'smooth'
      });
    });
  });
}

/* ============================================
   COUNTER ANIMATION
   ============================================ */
function initCounters() {
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  if (!statNumbers.length) return;

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => counterObserver.observe(el));
}

function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1500;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(eased * target);
    el.textContent = `£${value.toLocaleString('en-GB')}`;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

/* ============================================
   ADD SPIN ANIMATION FOR LOADING ICON
   ============================================ */
const spinStyle = document.createElement('style');
spinStyle.textContent = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  .spin {
    animation: spin 1s linear infinite;
  }
`;
document.head.appendChild(spinStyle);