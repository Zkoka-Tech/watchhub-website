(function () {
  "use strict";

  var navToggle = document.querySelector(".nav-toggle");
  var siteNav = document.getElementById("site-nav");

  function closeNav(options) {
    if (!navToggle || !siteNav) return;
    siteNav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    if (options && options.restoreFocus) navToggle.focus();
  }

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", function () {
      var isOpen = siteNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    siteNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        closeNav();
      });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && siteNav.classList.contains("is-open")) {
        closeNav({ restoreFocus: true });
      }
    });

    document.addEventListener("click", function (event) {
      if (!siteNav.classList.contains("is-open")) return;
      if (siteNav.contains(event.target) || navToggle.contains(event.target)) return;
      closeNav();
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth >= 1024) closeNav();
    });
  }

  var accordionItems = document.querySelectorAll(".accordion-item");

  accordionItems.forEach(function (item) {
    var trigger = item.querySelector(".accordion-trigger");
    if (!trigger) return;

    trigger.addEventListener("click", function () {
      var opening = !item.classList.contains("is-open");

      accordionItems.forEach(function (otherItem) {
        var otherTrigger = otherItem.querySelector(".accordion-trigger");
        otherItem.classList.remove("is-open");
        if (otherTrigger) otherTrigger.setAttribute("aria-expanded", "false");
      });

      if (opening) {
        item.classList.add("is-open");
        trigger.setAttribute("aria-expanded", "true");
      }
    });
  });

  var hero = document.querySelector(".hero");
  var header = document.querySelector(".site-header");

  if (hero && header && "IntersectionObserver" in window) {
    var headerObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        header.classList.toggle("is-scrolled", !entry.isIntersecting);
      });
    }, { threshold: 0.02 });

    headerObserver.observe(hero);
  } else if (header) {
    var updateHeader = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    };
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
  }
})();
