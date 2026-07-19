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
// accessible labels and button copy; MailerLite owns submission and responses.
document.addEventListener("DOMContentLoaded", function () {
  const embed = document.querySelector('.ml-embedded[data-form="mdQuFX"]');

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
      button.setAttribute("aria-label", "Keep me posted");
      button.textContent = "Keep me posted";
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
