(function () {
  const currentPath = window.location.pathname;
  const isEnglishHome = currentPath === "/" || currentPath === "/index.html";
  let savedLanguage = null;

  try {
    savedLanguage = window.localStorage.getItem("site-language");
  } catch (error) {
    // Language detection still works when storage is unavailable.
  }

  const browserLanguage = navigator.languages && navigator.languages.length
    ? navigator.languages[0]
    : navigator.language;
  const prefersGerman = typeof browserLanguage === "string"
    && browserLanguage.toLowerCase().startsWith("de");

  if (isEnglishHome && (savedLanguage === "de" || (!savedLanguage && prefersGerman))) {
    window.location.replace("/de/" + window.location.search + window.location.hash);
    return;
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-language-choice]").forEach(function (link) {
      link.addEventListener("click", function () {
        try {
          window.localStorage.setItem("site-language", link.dataset.languageChoice);
        } catch (error) {
          // The link still changes language when storage is unavailable.
        }
      });
    });
  });
})();
