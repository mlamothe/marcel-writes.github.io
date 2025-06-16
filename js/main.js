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
ml("account", "1285228");

// Custom form handler
document.addEventListener('DOMContentLoaded', function() {
  const customEmailInput = document.getElementById('custom-email');
  const customSubmitBtn = document.getElementById('custom-submit');
  
  function submitToMailerLite(email) {
    // Wait for MailerLite to be ready
    if (typeof ml !== 'undefined') {
      // Find the hidden MailerLite form
      const mlForm = document.querySelector('.ml-embedded[data-form="mdQuFX"]');
      
      if (mlForm) {
        // Wait a bit for MailerLite form to initialize
        setTimeout(() => {
          // Try to find the email input in the MailerLite form
          const mlEmailInput = mlForm.querySelector('input[type="email"]');
          
          if (mlEmailInput) {
            // Set the email value and trigger submission
            mlEmailInput.value = email;
            
            // Try to find and click the submit button
            const mlSubmitBtn = mlForm.querySelector('button[type="submit"], input[type="submit"]');
            if (mlSubmitBtn) {
              mlSubmitBtn.click();
            }
          } else {
            // Fallback: use MailerLite API directly
            ml('subscribe', {
              email: email,
              form: 'mdQuFX'
            });
          }
        }, 500);
      }
    }
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
    submitToMailerLite(email);
    
    // Show success message
    setTimeout(() => {
      alert('Thank you for subscribing!');
      customEmailInput.value = '';
      customSubmitBtn.disabled = false;
      customSubmitBtn.textContent = '→';
    }, 1000);
  });
  
  // Handle Enter key in email input
  customEmailInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      customSubmitBtn.click();
    }
  });
});
