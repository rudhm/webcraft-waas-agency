/**
 * main.js - Core site functionality for WebCraft
 */
document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Toggle
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const body = document.body;

  if (mobileMenuToggle && mobileMenu) {
    const toggleMenu = () => {
      const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true' || false;
      mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
      mobileMenuToggle.classList.toggle('active');
      mobileMenu.classList.toggle('is-open');
      body.classList.toggle('no-scroll');
    };

    const closeMenu = () => {
      mobileMenuToggle.setAttribute('aria-expanded', 'false');
      mobileMenuToggle.classList.remove('active');
      mobileMenu.classList.remove('is-open');
      body.classList.remove('no-scroll');
    };

    mobileMenuToggle.addEventListener('click', toggleMenu);

    // Close on nav link click
    const navLinks = mobileMenu.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
        closeMenu();
      }
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (mobileMenu.classList.contains('is-open') && !mobileMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
        closeMenu();
      }
    });
  }

  // Smooth Scrolling
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  const header = document.querySelector('.header');

  anchorLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerHeight = header ? header.offsetHeight : 80;
        const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

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
