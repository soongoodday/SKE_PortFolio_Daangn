// shared/theme-toggle.js
(function(){
  const KEY = 'theme';
  const root = document.documentElement;

  function apply(theme, animate=false){
    if(animate){
      root.classList.add('theme-anim');
      window.setTimeout(()=>root.classList.remove('theme-anim'), 260);
    }
    if(theme === 'dark'){
      root.setAttribute('data-theme','dark');
    }else{
      root.removeAttribute('data-theme'); // light = default
    }
    const btn = document.getElementById('themeToggleBtn');
    if(btn){
      const isDark = theme === 'dark';
      btn.setAttribute('aria-pressed', String(isDark));
      btn.dataset.theme = theme;
      btn.querySelector('.label') && (btn.querySelector('.label').textContent = isDark ? 'Dark' : 'Light');
    }
  }

  function getInitial(){
    const saved = localStorage.getItem(KEY);
    if(saved === 'dark' || saved === 'light') return saved;
    // default light (per request), but respect OS if you want:
    // return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    return 'light';
  }

  function toggle(){
    const now = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const next = now === 'dark' ? 'light' : 'dark';
    localStorage.setItem(KEY, next);
    apply(next, true);
  }

  window.__theme = { apply, toggle };

  document.addEventListener('DOMContentLoaded', function(){
    apply(getInitial(), false);

    const btn = document.getElementById('themeToggleBtn');
    if(btn){
      btn.addEventListener('click', toggle);
    }
  });
})();
