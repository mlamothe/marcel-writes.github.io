// Book picker: on wide screens the selected book's details sit beside the
// covers; on narrow screens they open in a sheet that slides up from the bottom.
document.addEventListener("DOMContentLoaded", function () {
  const books = document.querySelector(".books");
  if (!books) return;

  const thumbs = Array.from(books.querySelectorAll(".book-thumb"));
  const details = books.querySelector(".book-details");
  const backdrop = books.querySelector(".sheet-backdrop");
  const closeButton = books.querySelector(".sheet-close");
  const sheetBar = books.querySelector(".sheet-bar");
  const narrow = window.matchMedia("(max-width: 759px)");
  const headerHeight = () => document.querySelector("header").offsetHeight;

  let sheetOpen = false;
  let openedFrom = null;

  function idFor(thumb) {
    return thumb.getAttribute("href").slice(1);
  }

  function select(id) {
    const article = document.getElementById(id);
    if (!article || !article.classList.contains("book-detail")) return false;
    books.querySelectorAll(".book-detail").forEach(function (a) {
      a.classList.toggle("is-selected", a === article);
    });
    thumbs.forEach(function (t) {
      if (idFor(t) === id) t.setAttribute("aria-current", "true");
      else t.removeAttribute("aria-current");
    });
    return true;
  }

  // Everything outside the sheet becomes inert while it's open.
  function backgroundElements() {
    return document.querySelectorAll(
      "body > header, body > footer, main > section:not(.books), .books > h2, .book-picker"
    );
  }

  function openSheet(id, thumb) {
    openedFrom = thumb || null;
    sheetOpen = true;
    details.scrollTop = 0;
    details.setAttribute("role", "dialog");
    details.setAttribute("aria-modal", "true");
    details.setAttribute("aria-labelledby", id + "-title");
    backdrop.hidden = false;
    backdrop.offsetHeight; // let the backdrop fade in rather than pop
    backdrop.classList.add("is-open");
    details.classList.add("is-open");
    document.documentElement.classList.add("sheet-open");
    backgroundElements().forEach(function (el) { el.inert = true; });
    closeButton.focus({ preventScroll: true });
  }

  function closeSheet() {
    if (!sheetOpen) return;
    sheetOpen = false;
    details.classList.remove("is-open");
    details.style.transform = "";
    details.removeAttribute("role");
    details.removeAttribute("aria-modal");
    details.removeAttribute("aria-labelledby");
    backdrop.classList.remove("is-open");
    document.documentElement.classList.remove("sheet-open");
    backgroundElements().forEach(function (el) { el.inert = false; });
    setTimeout(function () { if (!sheetOpen) backdrop.hidden = true; }, 300);
    if (openedFrom) openedFrom.focus({ preventScroll: true });
  }

  // Closing goes through history so the phone's Back button and the close
  // button behave the same way.
  function requestClose() {
    if (history.state && history.state.bookSheet) history.back();
    else closeSheet();
  }

  thumbs.forEach(function (thumb) {
    thumb.addEventListener("click", function (event) {
      event.preventDefault();
      const id = idFor(thumb);
      select(id);
      if (narrow.matches) {
        history.pushState({ bookSheet: id }, "", "#" + id);
        openSheet(id, thumb);
      } else {
        history.replaceState(null, "", "#" + id);
        if (details.getBoundingClientRect().top < headerHeight()) {
          details.scrollIntoView({ block: "start" });
        }
      }
    });
  });

  window.addEventListener("popstate", function (event) {
    const state = event.state;
    if (state && state.bookSheet && narrow.matches) {
      select(state.bookSheet);
      if (!sheetOpen) openSheet(state.bookSheet, null);
    } else {
      closeSheet();
    }
  });

  // A book link followed from elsewhere on the page (or typed into the URL).
  window.addEventListener("hashchange", function () {
    const id = location.hash.slice(1);
    if (!select(id)) return;
    if (narrow.matches) {
      history.replaceState({ bookSheet: id }, "", "#" + id);
      if (!sheetOpen) openSheet(id, null);
    } else {
      books.scrollIntoView({ block: "start" });
    }
  });

  closeButton.addEventListener("click", requestClose);
  backdrop.addEventListener("click", requestClose);
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && sheetOpen) requestClose();
  });

  narrow.addEventListener("change", function () {
    if (!narrow.matches) closeSheet();
  });

  // Swipe the sheet down to dismiss it, from the handle bar or when the
  // details are scrolled to the top.
  let startY = null;
  let dragY = 0;
  details.addEventListener("touchstart", function (event) {
    if (!sheetOpen) return;
    if (sheetBar.contains(event.target) || details.scrollTop <= 0) {
      startY = event.touches[0].clientY;
      dragY = 0;
    }
  }, { passive: true });
  details.addEventListener("touchmove", function (event) {
    if (startY === null) return;
    dragY = event.touches[0].clientY - startY;
    if (dragY > 0) {
      details.classList.add("is-dragging");
      details.style.transform = "translateY(" + dragY + "px)";
      if (event.cancelable) event.preventDefault();
    } else if (!sheetBar.contains(event.target)) {
      startY = null; // scrolling up through the text, not dragging
      details.classList.remove("is-dragging");
      details.style.transform = "";
    }
  }, { passive: false });
  details.addEventListener("touchend", function () {
    if (startY === null) return;
    startY = null;
    details.classList.remove("is-dragging");
    details.style.transform = "";
    if (dragY > 100) requestClose();
  });

  // Start with the book named in the URL, or the newest one.
  const initial = location.hash.slice(1);
  if (initial && select(initial)) {
    if (narrow.matches) {
      // Put a plain page entry underneath, so Back closes the sheet
      // instead of leaving the site.
      history.replaceState(null, "", location.pathname + location.search);
      history.pushState({ bookSheet: initial }, "", "#" + initial);
      openSheet(initial, thumbs.find(function (t) { return idFor(t) === initial; }));
    } else {
      requestAnimationFrame(function () { books.scrollIntoView({ block: "start" }); });
    }
  } else {
    select(idFor(thumbs[0]));
  }
});
