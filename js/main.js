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

// MailerLite renders the form asynchronously. This only applies the site's
// accessible labels and icon; MailerLite owns submission and response handling.
document.addEventListener("DOMContentLoaded", function () {
  const embed = document.querySelector('.ml-embedded[data-form="mdQuFX"]');
  const envelopeIcon = `
    <svg width="18" height="14" viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M2 4L10 12L22 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
      <path d="M2 4H22V16C22 17.1046 21.1046 18 20 18H4C2.89543 18 2 17.1046 2 16V4Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
    </svg>
  `;

  function enhanceMailerLiteForm() {
    const emailInput = embed.querySelector('input[name="fields[email]"]');
    const submitButtons = embed.querySelectorAll('button[type="submit"]');

    if (!emailInput || submitButtons.length === 0) {
      return false;
    }

    emailInput.id = "mailing-list-email";
    emailInput.placeholder = "Your email address";
    emailInput.autocomplete = "email";

    submitButtons.forEach(function (button) {
      button.setAttribute("aria-label", "Join the mailing list");
      button.innerHTML = envelopeIcon;
    });

    return true;
  }

  if (!enhanceMailerLiteForm()) {
    const observer = new MutationObserver(function () {
      if (enhanceMailerLiteForm()) {
        observer.disconnect();
      }
    });

    observer.observe(embed, { childList: true, subtree: true });
  }
});
