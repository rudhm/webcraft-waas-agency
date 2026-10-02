/**
 * whatsapp-widget.js - Floating WhatsApp widget functionality
 */
document.addEventListener('DOMContentLoaded', () => {
  const widget = document.querySelector('.whatsapp-widget');
  const tooltip = document.querySelector('.whatsapp-tooltip');
  const phoneNumber = '919999999999'; // Base phone number
  const defaultMessage = "Hi, I'm interested in a new website.";
  
  if (!widget) return;

  // Determine device type
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // Set appropriate class for styling if needed
  if (isMobile) {
    widget.classList.add('is-mobile');
  } else {
    widget.classList.add('is-desktop');
  }

  // Construct WhatsApp URL based on device
  const waUrl = isMobile 
    ? `api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(defaultMessage)}`
    : `web.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(defaultMessage)}`;
    
  // Set the link
  const widgetLink = widget.tagName.toLowerCase() === 'a' ? widget : widget.querySelector('a');
  if (widgetLink) {
    widgetLink.href = `https://${waUrl}`;
    widgetLink.target = '_blank';
    widgetLink.rel = 'noopener noreferrer';
  }

  // Handle widget appearance
  const showWidget = () => {
    widget.classList.add('visible', 'animate-entrance');
    
    // Show tooltip if not dismissed previously
    if (tooltip && !sessionStorage.getItem('waTooltipDismissed')) {
      setTimeout(() => {
        tooltip.classList.add('visible');
        
        // Hide tooltip after a few seconds
        setTimeout(() => {
          tooltip.classList.remove('visible');
          sessionStorage.setItem('waTooltipDismissed', 'true');
        }, 5000);
      }, 500);
    }
  };

  // Logic for when to show widget
  if (isMobile) {
    // On mobile, wait for significant scroll or longer delay
    let hasShown = false;
    
    const checkScroll = () => {
      if (!hasShown && window.scrollY > window.innerHeight * 0.5) {
        showWidget();
        hasShown = true;
        window.removeEventListener('scroll', checkScroll);
      }
    };
    
    window.addEventListener('scroll', checkScroll, { passive: true });
    
    // Fallback delay just in case they don't scroll
    setTimeout(() => {
      if (!hasShown) {
        showWidget();
        hasShown = true;
        window.removeEventListener('scroll', checkScroll);
      }
    }, 8000);
  } else {
    // Desktop: show after 3 seconds
    setTimeout(showWidget, 3000);
  }

  // Pulse effect on scroll past 50%
  let pulseTriggered = false;
  window.addEventListener('scroll', () => {
    if (!pulseTriggered && widget.classList.contains('visible')) {
      const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      
      if (scrollPercentage > 50) {
        widget.classList.add('pulse-attention');
        pulseTriggered = true;
        
        // Remove pulse class after animation completes to allow it to trigger again on hover
        setTimeout(() => {
          widget.classList.remove('pulse-attention');
        }, 2000);
      }
    }
  }, { passive: true });

  // Handle tooltip manual dismiss
  if (tooltip) {
    const closeBtn = tooltip.querySelector('.close-tooltip');
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        tooltip.classList.remove('visible');
        sessionStorage.setItem('waTooltipDismissed', 'true');
      });
    }
  }
});
