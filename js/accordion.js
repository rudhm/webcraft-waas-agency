/**
 * accordion.js - FAQ Accordion functionality
 */
document.addEventListener('DOMContentLoaded', () => {
  const triggers = document.querySelectorAll('.accordion-trigger');
  
  if (triggers.length === 0) return;

  const closeAll = (exceptTrigger) => {
    triggers.forEach(trigger => {
      if (trigger !== exceptTrigger) {
        const item = trigger.closest('.accordion-item');
        const content = item.querySelector('.accordion-content');
        
        item.classList.remove('active');
        trigger.setAttribute('aria-expanded', 'false');
        if (content) {
          content.style.maxHeight = '0';
        }
      }
    });
  };

  triggers.forEach((trigger, index) => {
    // Click event
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.accordion-item');
      const content = item.querySelector('.accordion-content');
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
      
      // Close others
      closeAll(trigger);
      
      // Toggle current
      if (!isExpanded) {
        item.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
        if (content) {
          content.style.maxHeight = content.scrollHeight + 'px';
        }
      } else {
        item.classList.remove('active');
        trigger.setAttribute('aria-expanded', 'false');
        if (content) {
          content.style.maxHeight = '0';
        }
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
});
