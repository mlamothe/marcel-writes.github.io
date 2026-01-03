// MailerLite Universal
(function (w, d, e, u, f, l, n) {
  (w[f] =
    w[f] ||
    function () {
      (w[f].q = w[f].q || []).push(arguments);
    }),
    (l = d.createElement(e)),
    (l.async = 1),
    (l.src = u),
    (n = d.getElementsByTagName(e)[0]),
    n.parentNode.insertBefore(l, n);
})(
  window,
  document,
  "script",
  "https://assets.mailerlite.com/js/universal.js",
  "ml"
);

// Initialize MailerLite
ml("account", "1285228");

// Custom form handler
document.addEventListener('DOMContentLoaded', function() {
  const customEmailInput = document.getElementById('custom-email');
  const customSubmitBtn = document.getElementById('custom-submit');
  const originalBtnContent = customSubmitBtn.innerHTML;
  
  // Create notification function
  function showNotification(type = 'success') {
    // Remove any existing notifications
    const existingNotification = document.querySelector('.notification');
    const existingOverlay = document.querySelector('.notification-overlay');
    if (existingNotification) existingNotification.remove();
    if (existingOverlay) existingOverlay.remove();
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'notification-overlay';
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const title = type === 'success' ? 'Welcome aboard! 🎉' : 'Oops! Something went wrong';
    const content = type === 'success' ? 
      "You're all set! I'll keep you posted on new books and writing adventures." :
      "There was an issue subscribing your email. Please give it another try.";
    
    notification.innerHTML = `
      <h3>${title}</h3>
      <p>${content}</p>
      <button class="notification-close">Got it!</button>
    `;
    
    // Add to page
    document.body.appendChild(overlay);
    document.body.appendChild(notification);
    
    // Show with animation
    setTimeout(() => {
      overlay.classList.add('show');
      notification.classList.add('show');
    }, 10);
    
    // Close functionality
    function closeNotification() {
      notification.classList.remove('show');
      overlay.classList.remove('show');
      setTimeout(() => {
        if (notification.parentNode) notification.remove();
        if (overlay.parentNode) overlay.remove();
      }, 300);
    }
    
    notification.querySelector('.notification-close').addEventListener('click', closeNotification);
    overlay.addEventListener('click', closeNotification);
  }
  
  function submitToMailerLite(email) {
    // Wait for MailerLite form to load and submit via the embedded form
    const maxAttempts = 10;
    let attempts = 0;
    
    function trySubmit() {
      attempts++;
      const mlForm = document.querySelector('.ml-embedded[data-form="mdQuFX"]');
      
      if (mlForm) {
        // Look for the MailerLite form elements inside the embedded form
        const mlEmailInput = mlForm.querySelector('input[type="email"], input[name="fields[email]"]');
        const mlSubmitBtn = mlForm.querySelector('button, input[type="submit"]');
        
        if (mlEmailInput && mlSubmitBtn) {
          mlEmailInput.value = email;
          mlSubmitBtn.click();
          console.log('Email submitted via MailerLite form:', email);
          return true;
        }
      }
      
      if (attempts < maxAttempts) {
        setTimeout(trySubmit, 500);
        return false;
      } else {
        console.error('MailerLite form not found after', maxAttempts, 'attempts');
        return false;
      }
    }
    
    return trySubmit();
  }
  
  // Handle custom form submission
  customSubmitBtn.addEventListener('click', function(e) {
    e.preventDefault();
    
    const email = customEmailInput.value.trim();
    
    if (!email) {
      showNotification('error');
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showNotification('error');
      return;
    }
    
    // Disable button to prevent double submission
    customSubmitBtn.disabled = true;
    customSubmitBtn.textContent = '...';
    
    // Submit to MailerLite
    const success = submitToMailerLite(email);
    
    // Give feedback after attempting submission
    setTimeout(() => {
      if (success !== false) {
        showNotification('success');
        customEmailInput.value = '';
      } else {
        showNotification('error');
      }
      
      // Re-enable button
      customSubmitBtn.disabled = false;
      customSubmitBtn.innerHTML = originalBtnContent;
    }, 2000);
  });
  
  // Handle Enter key in email input
  customEmailInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      customSubmitBtn.click();
    }
  });

  // Handle book card clicks
  const bookCards = document.querySelectorAll('.book-card');
  bookCards.forEach(card => {
    card.addEventListener('click', function(e) {
      const link = card.querySelector('.book-title-link');
      if (link) {
        window.open(link.href, link.target);
      }
    });
  });

  // Handle Bluesky link click
  const blueskyLink = document.getElementById('bluesky-link');
  if (blueskyLink) {
    blueskyLink.addEventListener('click', function(e) {
      window.open('https://bsky.app/profile/marcel-writes.com', '_blank');
    });
  }
});
