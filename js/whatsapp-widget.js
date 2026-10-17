/**
 * whatsapp-widget.js - Floating WhatsApp widget functionality
 * Uses universal wa.me links without user-agent sniffing.
 * Visible from first paint; desktop tooltip shown briefly if supported.
 */
document.addEventListener('DOMContentLoaded', () => {
  const widget = document.querySelector('.whatsapp-widget');
  const tooltip = document.querySelector('.whatsapp-tooltip');
  
  if (!widget) return;

  // Ensure widget is marked visible
  widget.classList.add('visible');

  // Show desktop tooltip briefly if not dismissed previously and device supports hover
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (tooltip && canHover && !sessionStorage.getItem('waTooltipDismissed')) {
    setTimeout(() => {
      tooltip.classList.add('visible');
      
      setTimeout(() => {
        tooltip.classList.remove('visible');
        sessionStorage.setItem('waTooltipDismissed', 'true');
      }, 5000);
    }, 1500);
  }
});
