/**
 * accordion.js - FAQ Accordion functionality
 * Accessible accordion with hidden attributes, ARIA expanded state,
 * and dynamic height recalculation on resize / orientation change.
 */
document.addEventListener('DOMContentLoaded', () => {
  const triggers = document.querySelectorAll('.accordion-trigger');
  
  if (triggers.length === 0) return;

  // Initialize initial state: ensure collapsed panels are hidden from a11y tree
  triggers.forEach(trigger => {
    const item = trigger.closest('.accordion-item');
    const content = item ? item.querySelector('.accordion-content') : null;
    const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

    if (content) {
      if (isExpanded) {
        content.hidden = false;
        content.style.maxHeight = content.scrollHeight + 'px';
        item.classList.add('active');
      } else {
        content.hidden = true;
        content.style.maxHeight = '0';
        item.classList.remove('active');
      }
    }
  });

  const closeItem = (trigger) => {
    const item = trigger.closest('.accordion-item');
    const content = item ? item.querySelector('.accordion-content') : null;
    if (!content) return;

    item.classList.remove('active');
    trigger.setAttribute('aria-expanded', 'false');
    content.style.maxHeight = '0';

    const onTransitionEnd = () => {
      content.removeEventListener('transitionend', onTransitionEnd);
      if (trigger.getAttribute('aria-expanded') === 'false') {
        content.hidden = true;
      }
    };
    content.addEventListener('transitionend', onTransitionEnd);
    setTimeout(onTransitionEnd, 300); // Fallback
  };

  const openItem = (trigger) => {
    const item = trigger.closest('.accordion-item');
    const content = item ? item.querySelector('.accordion-content') : null;
    if (!content) return;

    content.hidden = false;
    // Force layout reflow before measuring
    void content.offsetHeight;

    item.classList.add('active');
    trigger.setAttribute('aria-expanded', 'true');
    content.style.maxHeight = content.scrollHeight + 'px';
  };

  const closeAll = (exceptTrigger) => {
    triggers.forEach(trigger => {
      if (trigger !== exceptTrigger && trigger.getAttribute('aria-expanded') === 'true') {
        closeItem(trigger);
      }
    });
  };

  triggers.forEach((trigger, index) => {
    // Click event
    trigger.addEventListener('click', () => {
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
      
      // Close others to keep a clean, focused accordion on phones
      closeAll(trigger);
      
      if (!isExpanded) {
        openItem(trigger);
      } else {
        closeItem(trigger);
      }
    });

    // Keyboard navigation
    trigger.addEventListener('keydown', (e) => {
      let nextTrigger = null;
      
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          nextTrigger = triggers[(index + 1) % triggers.length];
          break;
        case 'ArrowUp':
          e.preventDefault();
          nextTrigger = triggers[(index - 1 + triggers.length) % triggers.length];
          break;
        case 'Home':
          e.preventDefault();
          nextTrigger = triggers[0];
          break;
        case 'End':
          e.preventDefault();
          nextTrigger = triggers[triggers.length - 1];
          break;
      }
      
      if (nextTrigger) {
        nextTrigger.focus();
      }
    });
  });

  // Recalculate heights on resize or orientation change so text is never cut off
  let resizeTimeout;
  const updateExpandedHeights = () => {
    triggers.forEach(trigger => {
      if (trigger.getAttribute('aria-expanded') === 'true') {
        const item = trigger.closest('.accordion-item');
        const content = item ? item.querySelector('.accordion-content') : null;
        if (content) {
          content.style.maxHeight = content.scrollHeight + 'px';
        }
      }
    });
  };

  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(updateExpandedHeights, 100);
  }, { passive: true });

  window.addEventListener('orientationchange', () => {
    setTimeout(updateExpandedHeights, 200);
  }, { passive: true });
});
