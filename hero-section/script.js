/* Enigma Air Conditioning — hero section: mobile menu only (vanilla JS) */
(function () {
  'use strict';
  var toggle = document.querySelector('.nav-toggle');
  var header = document.querySelector('.site-header');
  if (!toggle) return;

  function setOpen(open) {
    if (open) document.documentElement.style.setProperty('--nav-top', Math.round(header.getBoundingClientRect().bottom) + 'px');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.querySelector('.visually-hidden').textContent = open ? 'Close menu' : 'Menu';
    document.body.classList.toggle('nav-open', open);
  }

  toggle.addEventListener('click', function () { setOpen(toggle.getAttribute('aria-expanded') !== 'true'); });
  document.getElementById('site-nav').addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && document.body.classList.contains('nav-open')) { setOpen(false); toggle.focus(); }
  });
  window.matchMedia('(min-width: 1024px)').addEventListener('change', function (m) { if (m.matches) setOpen(false); });
})();
