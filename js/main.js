/**
 * main.js - Core site functionality for WebCraft
 */
document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Toggle & Focus Management
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const header = document.querySelector('.header');
  const body = document.body;

  if (mobileMenuToggle && mobileMenu) {
    const closeBtn = mobileMenu.querySelector('.mobile-menu-close');

    const openMenu = () => {
      mobileMenuToggle.setAttribute('aria-expanded', 'true');
      mobileMenuToggle.setAttribute('aria-label', 'Close menu');
      mobileMenuToggle.classList.add('active');
      mobileMenu.classList.add('is-open');
      if (header) header.classList.add('is-menu-open');
      body.classList.add('no-scroll');

      // Focus first element or close button
      const firstFocusable = closeBtn || mobileMenu.querySelector('a, button');
      if (firstFocusable) {
        setTimeout(() => firstFocusable.focus(), 50);
      }
    };

    const closeMenu = (restoreFocus = true) => {
      if (!mobileMenu.classList.contains('is-open')) return;
      mobileMenuToggle.setAttribute('aria-expanded', 'false');
      mobileMenuToggle.setAttribute('aria-label', 'Open menu');
      mobileMenuToggle.classList.remove('active');
      mobileMenu.classList.remove('is-open');
      if (header) header.classList.remove('is-menu-open');
      body.classList.remove('no-scroll');

      if (restoreFocus && mobileMenuToggle) {
        mobileMenuToggle.focus();
      }
    };

    const toggleMenu = () => {
      const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closeMenu(true);
      } else {
        openMenu();
      }
    };

    mobileMenuToggle.addEventListener('click', toggleMenu);
    if (closeBtn) {
      closeBtn.addEventListener('click', () => closeMenu(true));
    }

    // Close on nav link click
    const navLinks = mobileMenu.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => closeMenu(false));
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
        closeMenu(true);
      }
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (mobileMenu.classList.contains('is-open') && !mobileMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
        closeMenu(true);
      }
    });

    // Focus trap while open
    mobileMenu.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      const focusables = Array.from(
        mobileMenu.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
      ).filter(el => !el.hasAttribute('disabled') && el.offsetParent !== null);

      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });

    // Close on back/forward cache restore
    window.addEventListener('pageshow', () => closeMenu(false));
  }

  // Header Scroll Effect
  let lastScrollY = window.scrollY;
  let ticking = false;

  const updateHeader = () => {
    if (header) {
      if (window.scrollY > 50) {
        header.classList.add('header--scrolled');
      } else {
        header.classList.remove('header--scrolled');
      }
    }
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    lastScrollY = window.scrollY;
    if (!ticking) {
      window.requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }, { passive: true });
  // Initial check
  updateHeader();

  // Intersection Observer for Animations
  const animateElements = document.querySelectorAll('.animate-on-scroll');
  
  if (animateElements.length > 0 && 'IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    animateElements.forEach(el => observer.observe(el));
  } else {
    // Fallback for older browsers
    animateElements.forEach(el => el.classList.add('animated'));
  }

  // Active Navigation
  const currentPath = window.location.pathname;
  const navItems = document.querySelectorAll('nav a');
  navItems.forEach(item => {
    if (item.getAttribute('href') === currentPath || (currentPath === '/' && item.getAttribute('href') === 'index.html')) {
      item.classList.add('active');
    }
  });

  // Form Handling
  const contactForm = document.querySelector('.contact-form, form[name="contact"]');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Simulate form submission success
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.textContent : 'Submit';
      
      if (submitBtn) {
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
      }

      setTimeout(() => {
        // Success state
        if (submitBtn) {
          submitBtn.textContent = 'Message Sent!';
          submitBtn.classList.add('success');
        }
        
        // Show success message if a container exists
        const formMessage = contactForm.querySelector('.form-message') || document.createElement('div');
        if (!contactForm.querySelector('.form-message')) {
          formMessage.className = 'form-message success-message';
          contactForm.appendChild(formMessage);
        }
        formMessage.textContent = 'Thank you for your message. We will get back to you shortly.';
        
        contactForm.reset();

        // Reset button after 3 seconds
        setTimeout(() => {
          if (submitBtn) {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            submitBtn.classList.remove('success');
          }
          if (formMessage.parentNode) {
            formMessage.parentNode.removeChild(formMessage);
          }
        }, 3000);
      }, 1000);
    });
  }
});
