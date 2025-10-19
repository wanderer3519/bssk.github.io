// theme.js - handle theme toggle, persistence, and system preference
(function () {
  'use strict';

  const STORAGE_KEY = 'theme-preference';
  const TOGGLE_ID = 'theme-toggle';
  const DARK = 'dark';
  const LIGHT = 'light';

  function supportsLocalStorage() {
    try {
      const k = '__ls_test__';
      localStorage.setItem(k, k);
      localStorage.removeItem(k);
      return true;
    } catch (e) {
      return false;
    }
  }

  function applyTheme(theme, toggleEl) {
    if (theme === DARK) {
      document.documentElement.setAttribute('data-theme', DARK);
      if (toggleEl) toggleEl.textContent = 'Disable Dark';
    } else {
      document.documentElement.removeAttribute('data-theme');
      if (toggleEl) toggleEl.textContent = 'Enable Dark';
    }
  }

  function getSystemPrefersDark() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function init() {
    const toggle = document.getElementById(TOGGLE_ID);
    if (!toggle) return; // nothing to do

    const ls = supportsLocalStorage() ? localStorage : null;
    const saved = ls ? ls.getItem(STORAGE_KEY) : null;

    if (saved === DARK || saved === LIGHT) {
      applyTheme(saved, toggle);
    } else {
      applyTheme(getSystemPrefersDark() ? DARK : LIGHT, toggle);
    }

    // Listen for system changes and update only if user hasn't set a preference
    if (window.matchMedia) {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      mq.addEventListener ? mq.addEventListener('change', (e) => {
        const currentSaved = ls ? ls.getItem(STORAGE_KEY) : null;
        if (!currentSaved) applyTheme(e.matches ? DARK : LIGHT, toggle);
      }) : mq.addListener((e) => {
        const currentSaved = ls ? ls.getItem(STORAGE_KEY) : null;
        if (!currentSaved) applyTheme(e.matches ? DARK : LIGHT, toggle);
      });
    }

    toggle.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === DARK;
      const next = isDark ? LIGHT : DARK;
      applyTheme(next, toggle);
      if (ls) ls.setItem(STORAGE_KEY, next);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
