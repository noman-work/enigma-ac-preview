/* Enigma Air Conditioning — homepage prototype script (vanilla JS, no libraries) */
(function () {
  'use strict';

  /* ------------------------------------------------------------------
     CLIENT DETAILS — add these once the client confirms them.
     While phoneTel is empty, Call Now explains that the number is still
     to be added instead of opening the dialler.
     ------------------------------------------------------------------ */
  var SITE = {
    phoneDisplay: '07957 623335',
    phoneTel: '+447957623335',
    email: ''           // e.g. 'info@enigmaairconditioning.co.uk'
  };

  var NAV_BREAKPOINT = 1024; // px — desktop navigation from this width up

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Phone + email ---------- */
  function applyContactDetails() {
    document.querySelectorAll('[data-phone-text]').forEach(function (el) {
      if (SITE.phoneDisplay) el.textContent = SITE.phoneDisplay;
    });
    document.querySelectorAll('[data-email]').forEach(function (el) {
      if (SITE.email) {
        el.textContent = SITE.email;
        el.setAttribute('href', 'mailto:' + SITE.email);
      } else {
        var wrap = el.closest('[data-email-wrap]');
        (wrap || el).hidden = true;
      }
    });
    document.querySelectorAll('[data-phone-link]').forEach(function (el) {
      if (SITE.phoneTel) {
        el.setAttribute('href', 'tel:' + SITE.phoneTel);
        return;
      }
      el.setAttribute('href', 'tel:');
      el.addEventListener('click', function (e) {
        e.preventDefault();
        toast('The phone number hasn’t been added to this prototype yet. On the live site, Call Now opens your phone’s dialler.');
      });
    });
  }

  var toastEl;
  function toast(msg) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'toast';
      toastEl.setAttribute('role', 'status');
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.classList.add('is-visible');
    clearTimeout(toastEl._t);
    toastEl._t = setTimeout(function () { toastEl.classList.remove('is-visible'); }, 4500);
  }

  /* ---------- Mobile navigation ---------- */
  function initNav() {
    var toggle = document.querySelector('.nav-toggle');
    var nav = document.getElementById('site-nav');
    var header = document.querySelector('.site-header');
    if (!toggle || !nav) return;
    function setOpen(open) {
      if (open && header) {
        document.documentElement.style.setProperty('--nav-top', Math.round(header.getBoundingClientRect().bottom) + 'px');
      }
      toggle.setAttribute('aria-expanded', String(open));
      document.body.classList.toggle('nav-open', open);
    }
    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && document.body.classList.contains('nav-open')) { setOpen(false); toggle.focus(); }
    });
    window.matchMedia('(min-width: ' + NAV_BREAKPOINT + 'px)').addEventListener('change', function (m) {
      if (m.matches) setOpen(false);
    });
  }

  /* ---------- In-page links: scroll, then move focus for keyboard users ---------- */
  function initAnchors() {
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute('href').slice(1);
      var target = id && document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      history.replaceState(null, '', '#' + id);
      var focusEl = target.querySelector('[data-focus-target]') || target;
      if (!focusEl.hasAttribute('tabindex')) focusEl.setAttribute('tabindex', '-1');
      focusEl.focus({ preventScroll: true });
    });
  }

  /* ---------- Mobile action bar hides while the form is on screen ---------- */
  function initActionBar() {
    var bar = document.querySelector('.action-bar');
    var form = document.getElementById('quote-form');
    if (!bar || !form || !('IntersectionObserver' in window)) return;
    new IntersectionObserver(function (entries) {
      bar.classList.toggle('is-hidden', entries[0].isIntersecting);
    }, { threshold: 0.05 }).observe(form);
  }

  /* ---------- Quote form: front-end validation only ---------- */
  function initForm() {
    var form = document.querySelector('.quote-form');
    if (!form) return;
    var success = document.querySelector('.form-success');

    var rules = {
      name: function (v) { return v.trim().length >= 2 || 'Enter your name.'; },
      phone: function (v) {
        if (!v.trim()) return 'Enter a phone number.';
        var digits = v.replace(/[^\d]/g, '');
        return (digits.length >= 10 && digits.length <= 13 && /^[\d\s()+-]+$/.test(v.trim())) || 'Enter a UK phone number, for example 07700 900123.';
      },
      email: function (v) {
        if (!v.trim()) return 'Enter your email address.';
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || 'Enter an email address like name@example.co.uk.';
      },
      location: function (v) { return v.trim().length >= 2 || 'Enter a postcode or town.'; },
      property: function (v) { return !!v || 'Choose a property type.'; },
      service: function (v) { return !!v || 'Choose the service you need.'; }
    };

    function isRadio(name) {
      var els = form.elements[name];
      return !!(els && els.length && els[0] && els[0].type === 'radio');
    }
    function valueOf(name) {
      if (isRadio(name)) {
        var c = form.querySelector('input[name="' + name + '"]:checked');
        return c ? c.value : '';
      }
      return form.elements[name].value;
    }
    function firstEl(name) { return isRadio(name) ? form.elements[name][0] : form.elements[name]; }

    function check(name) {
      var res = rules[name](valueOf(name));
      var el = firstEl(name);
      var err = document.getElementById('f-' + name + '-error');
      var wrap = el.closest('.field');
      var targets = isRadio(name) ? form.querySelectorAll('input[name="' + name + '"]') : [el];
      var ok = res === true;
      targets.forEach(function (t) { if (ok) t.removeAttribute('aria-invalid'); else t.setAttribute('aria-invalid', 'true'); });
      if (err) err.textContent = ok ? '' : res;
      if (wrap) wrap.classList.toggle('has-error', !ok);
      return ok;
    }

    Object.keys(rules).forEach(function (name) {
      if (isRadio(name)) {
        form.querySelectorAll('input[name="' + name + '"]').forEach(function (r) {
          r.addEventListener('change', function () { check(name); });
        });
        return;
      }
      var el = form.elements[name];
      el.addEventListener('blur', function () { if (el.value) check(name); });
      el.addEventListener('input', function () { if (el.getAttribute('aria-invalid') === 'true') check(name); });
      el.addEventListener('change', function () { if (el.tagName === 'SELECT') check(name); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var firstInvalid = null;
      Object.keys(rules).forEach(function (name) {
        if (!check(name) && !firstInvalid) firstInvalid = firstEl(name);
      });
      var summary = form.querySelector('.form-summary');
      if (firstInvalid) {
        if (summary) summary.textContent = 'Some details need attention. Check the fields marked below.';
        firstInvalid.focus();
        return;
      }
      if (summary) summary.textContent = '';
      /* DEMO ONLY — nothing is sent. In WordPress, replace with a Kadence
         Form block (email notification + spam protection). */
      form.hidden = true;
      success.hidden = false;
      var n = success.querySelector('[data-success-name]');
      if (n) n.textContent = form.elements['name'].value.trim().split(' ')[0];
      success.focus();
    });

    var reset = document.querySelector('[data-form-reset]');
    if (reset) reset.addEventListener('click', function () {
      form.reset();
      form.hidden = false;
      success.hidden = true;
      form.elements['name'].focus();
    });
  }

  /* ---------- Project filters (only on pages that have them) ---------- */
  function initFilters() {
    var group = document.querySelector('.filters');
    if (!group) return;
    var items = document.querySelectorAll('[data-cat]');
    var status = document.querySelector('[data-filter-status]');
    group.addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-filter]');
      if (!btn) return;
      var f = btn.getAttribute('data-filter');
      group.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
      var shown = 0;
      items.forEach(function (el) {
        var show = f === 'all' || el.getAttribute('data-cat').split(' ').indexOf(f) > -1;
        el.hidden = !show;
        if (show) shown++;
      });
      if (status) status.textContent = shown + ' photographs shown';
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var y = document.querySelector('[data-year]');
    if (y) y.textContent = new Date().getFullYear();
    applyContactDetails();
    initNav();
    initAnchors();
    initActionBar();
    initForm();
    initFilters();
  });
})();
