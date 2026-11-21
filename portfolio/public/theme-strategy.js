(function() {
  try {
    // The site is designed dark-first; a theme the visitor picked still wins.
    var theme = localStorage.getItem('theme');
    if (theme !== 'light' && theme !== 'dark') theme = 'dark';
    document.documentElement.classList.toggle('dark', theme === 'dark');
  } catch {}
})();
