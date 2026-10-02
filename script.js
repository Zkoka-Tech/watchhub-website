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

  // Scroll reveal — siblings inside the same parent cascade in sequence.
  var revealEls = document.querySelectorAll("[data-reveal]");
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (revealEls.length && "IntersectionObserver" in window && !reduceMotion) {
    document.documentElement.classList.add("reveal-ready");
    revealEls.forEach(function (el) {
      var siblings = Array.prototype.filter.call(el.parentElement.children, function (child) {
        return child.hasAttribute("data-reveal");
      });
      var index = siblings.indexOf(el);
      if (index > 0) el.style.setProperty("--reveal-delay", Math.min(index * 0.08, 0.4) + "s");
    });

    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });

    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  // Highlight the nav link for the section currently in view.
  var navLinks = siteNav ? siteNav.querySelectorAll('a[href^="#"]') : [];
  var spySections = Array.prototype.map.call(navLinks, function (link) {
    return document.querySelector(link.getAttribute("href"));
  }).filter(Boolean);

  if (spySections.length && "IntersectionObserver" in window) {
    var spyObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          var active = link.getAttribute("href") === "#" + entry.target.id;
          link.classList.toggle("is-active", active);
          if (active) link.setAttribute("aria-current", "true");
          else link.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });

    spySections.forEach(function (section) { spyObserver.observe(section); });
  }

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
