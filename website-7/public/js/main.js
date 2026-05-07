// Cookie consent banner
function setupCookieConsent() {
  const banner = document.querySelector('.cookie-consent');
  if (!banner) return;

  const accepted = localStorage.getItem('cookies-accepted');
  if (accepted) {
    banner.style.display = 'none';
  }

  document.querySelectorAll('[data-action="accept-cookies"]').forEach(btn => {
    btn.addEventListener('click', () => {
      localStorage.setItem('cookies-accepted', 'true');
      banner.style.display = 'none';
    });
  });

  document.querySelectorAll('[data-action="reject-cookies"]').forEach(btn => {
    btn.addEventListener('click', () => {
      banner.style.display = 'none';
    });
  });
}

// Newsletter popup
function setupNewsletterPopup() {
  const popup = document.querySelector('.newsletter-popup');
  if (!popup) return;

  const closeBtn = popup.querySelector('.popup-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      popup.style.display = 'none';
    });
  }

  const form = popup.querySelector('form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = form.querySelector('input[type="email"]');
      if (emailInput && emailInput.value) {
        localStorage.setItem('newsletter-signed', 'true');
        localStorage.setItem('newsletter-email', emailInput.value);
        popup.style.display = 'none';
        showNotification('Thank you for subscribing!');
      }
    });
  }
}

// Related articles modal
function setupRelatedArticlesModal() {
  const modal = document.querySelector('.related-articles-modal');
  if (!modal) return;

  const closeBtn = modal.querySelector('.modal-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  }

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
}

// Show notification
function showNotification(message) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: #4caf50;
    color: white;
    padding: 16px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    z-index: 9999;
    max-width: 300px;
  `;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.3s ease';
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

// Back navigation
function setupBackNavigation() {
  const backLinks = document.querySelectorAll('.back-link');
  backLinks.forEach(link => {
    if (link.href === '#') {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        window.history.back();
      });
    }
  });
}

// Smooth scrolling for anchor links
function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });
}

// Mobile menu toggle (if hamburger menu exists)
function setupMobileMenu() {
  const hamburger = document.querySelector('.hamburger-menu');
  const menu = document.querySelector('.navbar .menu');

  if (hamburger && menu) {
    hamburger.addEventListener('click', () => {
      menu.classList.toggle('active');
    });
  }
}

// Initialize all functionality on page load
document.addEventListener('DOMContentLoaded', () => {
  setupCookieConsent();
  setupNewsletterPopup();
  setupRelatedArticlesModal();
  setupBackNavigation();
  setupSmoothScroll();
  setupMobileMenu();
});
