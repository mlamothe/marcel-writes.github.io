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
      alert('Please enter your email address');
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address');
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
        alert('Thank you for subscribing!');
        customEmailInput.value = '';
      } else {
        alert('There was an error submitting your email. Please try again.');
      }
      
      // Re-enable button
      customSubmitBtn.disabled = false;
      customSubmitBtn.textContent = '→';
    }, 2000);
  });
  
  // Handle Enter key in email input
  customEmailInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      customSubmitBtn.click();
    }
  });
});
