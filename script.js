/* ===========================================================================
   DeliTime landing page.

   Two small jobs, both progressive enhancements: the page is complete and
   correct with this file blocked. The theme has already been applied by the
   inline script in <head> — this only wires up the control that changes it.
=========================================================================== */
(function () {
  "use strict";

  var STORAGE_KEY = "theme";
  var VALID = ["system", "light", "dark"];

  /**
   * The stored preference.
   *
   * Wrapped because `localStorage` is not merely empty in a private window or
   * with site data blocked — the accessor itself throws, and an exception here
   * would take the theme control down with it.
   */
  function read() {
    try {
      var value = localStorage.getItem(STORAGE_KEY);
      return VALID.indexOf(value) === -1 ? "system" : value;
    } catch (e) {
      return "system";
    }
  }

  function write(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      /* Nothing to do: the choice still applies for this page view, it just
         will not survive a reload. Better than refusing to switch at all. */
    }
  }

  /**
   * Applies a preference.
   *
   * The attribute is the single source of truth for the whole page: the
   * palette resolves from it in CSS, and so does which segment of the control
   * reads as active — so nothing here has to touch a class or re-render a
   * button, and the server-rendered markup and the DOM can never disagree.
   *
   * "system" is deliberately its own value rather than being resolved to a
   * concrete palette here. Only CSS can see `prefers-color-scheme`, and
   * resolving it in script would freeze the page against the desktop it is
   * meant to follow.
   */
  function apply(theme) {
    document.documentElement.setAttribute("data-theme", theme);
  }

  var toggle = document.querySelector(".theme-toggle");
  if (toggle) {
    // Re-assert the stored value: the <head> script set it already, but this
    // also repairs the attribute if markup shipped with something else.
    apply(read());

    toggle.addEventListener("click", function (event) {
      var button = event.target.closest(".theme-toggle__btn");
      if (!button) return;

      var theme = button.value;
      if (VALID.indexOf(theme) === -1) return;

      apply(theme);
      write(theme);
    });
  }

  // The copyright year, so the footer does not go stale on its own.
  var year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());
})();
