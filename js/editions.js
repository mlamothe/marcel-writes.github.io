// Translated editions.
// 1. Points every edition link (a[data-asin]) at the visitor's own Amazon store.
// 2. If the visitor's browser prefers a language we have an edition in (before English),
//    shows a short note at the top of each English page, written in that language. For
//    languages with their own page (LANDING), the note links there; otherwise to Amazon.
(function () {
  var EDITIONS = {
    "big-bare-island": {
      de: ["B0GX95T1DN", "Big Bare Island"]
    },
    "naked-nancy": {
      de: ["B0GHS9M8CY", "Nackte Nancy: Ein unvergesslicher Sommer"],
      es: ["B0GHS85Z87", "Nancy al Desnudo: Un Verano Inolvidable"],
      fr: ["B0GQTVJWYT", "Nancy au naturel : Un été inoubliable"],
      it: ["B0GHZRXVDZ", "Nancy Nuda: Un’estate da ricordare"],
      nl: ["B0GSTH25W6", "Blote Nancy: Een zomer om nooit te vergeten"],
      pt: ["B0GQQZBP4Q", "Nancy Nua: Um Verão Inesquecível"]
    },
    "the-naked-truth": {
      de: ["B0GWWKMQ56", "Die nackte Wahrheit"]
    },
    "the-oceans-daughter": {
      de: ["B0GGX5LBS2", "Die Tochter des Ozeans"]
    }
  };

  var TEXT = {
    de: { book: "Dieses Buch gibt es auch auf Deutsch:", home: "Meine Bücher gibt es auch auf Deutsch:", close: "Schließen" },
    es: { book: "Este libro también está disponible en español:", home: "También disponible en español:", close: "Cerrar" },
    fr: { book: "Ce livre existe aussi en français :", home: "Aussi disponible en français :", close: "Fermer" },
    it: { book: "Questo libro è disponibile anche in italiano:", home: "Disponibile anche in italiano:", close: "Chiudi" },
    nl: { book: "Dit boek is ook verkrijgbaar in het Nederlands:", home: "Ook verkrijgbaar in het Nederlands:", close: "Sluiten" },
    pt: { book: "Este livro também está disponível em português:", home: "Também disponível em português:", close: "Fechar" }
  };

  // Languages with their own page on this site. The note sends readers there (to the right book)
  // so they can read the description in their language before going to Amazon.
  var LANDING = {
    de: {
      page: "/de/",
      home: "Zur deutschen Seite",
      anchors: {
        "big-bare-island": "big-bare-island",
        "naked-nancy": "nackte-nancy",
        "the-naked-truth": "die-nackte-wahrheit",
        "the-oceans-daughter": "die-tochter-des-ozeans"
      }
    }
  };

  // The store for each language when we can't tell where the visitor lives.
  var LANGUAGE_STORE = { de: "amazon.de", es: "amazon.es", fr: "amazon.fr", it: "amazon.it", nl: "amazon.nl", pt: "amazon.com.br" };

  // Kindle accounts are tied to a country, so a reader should buy from their own store.
  var COUNTRY_STORE = {
    US: "amazon.com", CA: "amazon.ca", MX: "amazon.com.mx", BR: "amazon.com.br",
    GB: "amazon.co.uk", DE: "amazon.de", AT: "amazon.de", CH: "amazon.de",
    FR: "amazon.fr", ES: "amazon.es", PT: "amazon.es", IT: "amazon.it", NL: "amazon.nl",
    AU: "amazon.com.au", IN: "amazon.in", JP: "amazon.co.jp"
  };

  var tags = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || ""];

  function countryOf(tag) {
    var parts = String(tag).split("-").slice(1);
    for (var i = 0; i < parts.length; i++) {
      if (/^[A-Za-z]{2}$/.test(parts[i])) return parts[i].toUpperCase();
    }
    return null;
  }

  var visitorCountry = null;
  for (var t = 0; t < tags.length && !visitorCountry; t++) visitorCountry = countryOf(tags[t]);

  function storeUrl(lang, asin, country) {
    var store = COUNTRY_STORE[country] || LANGUAGE_STORE[lang] || "amazon.com";
    return "https://www." + store + "/dp/" + asin;
  }

  // 1. Edition links already in the page
  var links = document.querySelectorAll("a[data-asin]");
  for (var l = 0; l < links.length; l++) {
    links[l].href = storeUrl(links[l].getAttribute("hreflang"), links[l].getAttribute("data-asin"), visitorCountry);
  }

  // 2. A note in the visitor's own language (only on the English pages)
  if ((document.documentElement.lang || "en").toLowerCase().split("-")[0] !== "en") return;
  var slug = document.body.getAttribute("data-book");
  var slugs = slug ? [slug] : ["big-bare-island", "naked-nancy", "the-naked-truth", "the-oceans-daughter"];

  var lang = null, country = visitorCountry, found = [];
  for (var i = 0; i < tags.length && !lang; i++) {
    var base = String(tags[i]).split("-")[0].toLowerCase();
    if (base === "en") break; // they're happy in English; the page already lists the editions
    if (!TEXT[base]) continue;
    for (var s = 0; s < slugs.length; s++) {
      var edition = EDITIONS[slugs[s]] && EDITIONS[slugs[s]][base];
      if (edition) found.push({ asin: edition[0], title: edition[1], slug: slugs[s] });
    }
    if (found.length) {
      lang = base;
      country = countryOf(tags[i]) || visitorCountry;
    }
  }
  if (!lang) return;

  var closedKey = "editions-note-closed-" + lang;
  try { if (localStorage.getItem(closedKey)) return; } catch (e) {}

  var main = document.querySelector("main");
  if (!main) return;

  var note = document.createElement("aside");
  note.className = "lang-note";
  note.lang = lang;

  var inner = document.createElement("div");
  inner.className = "wrap lang-note-inner";

  var p = document.createElement("p");
  p.appendChild(document.createTextNode((slug ? TEXT[lang].book : TEXT[lang].home) + " "));

  // With a page in their language: link to it. Otherwise: straight to Amazon.
  var landing = LANDING[lang];
  var targets = [];
  if (landing && !slug) {
    targets.push({ href: landing.page, text: landing.home });
  } else {
    for (var f = 0; f < found.length; f++) {
      targets.push(landing
        ? { href: landing.page + "#" + landing.anchors[found[f].slug], text: found[f].title }
        : { href: storeUrl(lang, found[f].asin, country), text: found[f].title, external: true });
    }
  }

  for (var g = 0; g < targets.length; g++) {
    if (g) p.appendChild(document.createTextNode(" · "));
    var a = document.createElement("a");
    a.href = targets[g].href;
    if (targets[g].external) {
      a.target = "_blank";
      a.rel = "noopener noreferrer";
    }
    a.textContent = targets[g].text;
    if (targets.length === 1) {
      var arrow = document.createElement("span");
      arrow.setAttribute("aria-hidden", "true");
      arrow.textContent = " →";
      a.appendChild(arrow);
    }
    p.appendChild(a);
  }

  var close = document.createElement("button");
  close.type = "button";
  close.className = "lang-note-close";
  close.setAttribute("aria-label", TEXT[lang].close);
  close.textContent = "×";
  close.addEventListener("click", function () {
    note.remove();
    try { localStorage.setItem(closedKey, "1"); } catch (e) {}
  });

  inner.appendChild(p);
  inner.appendChild(close);
  note.appendChild(inner);
  main.insertBefore(note, main.firstChild);
})();
