/* loader.js */
function initLoader() {
  const overlay = document.getElementById('loader');
  if (!overlay) return;

  // Show immediately (in case HTML defaults hide it)
  document.body.classList.add('loading');
  overlay.setAttribute('aria-hidden', 'false');

  // Hide when content is ready
  const hide = () => {
    overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('loading');
  };
  // DOM ready / images aren’t critical here
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    requestAnimationFrame(hide);
  } else {
    window.addEventListener('DOMContentLoaded', hide);
  }

  // Handle bfcache (back/forward) restores
  window.addEventListener('pageshow', (e) => { if (e.persisted) hide(); });

  // Intercept internal links to show loader during navigation
  const isSameHost = (url) => {
    try { return new URL(url, location.href).origin === location.origin; }
    catch { return false; }
  };

  document.querySelectorAll('a[href]').forEach(a => {
    const href = a.getAttribute('href');
    if (!href) return;
    // Skip anchors, new tabs, or non-GET-ish links
    if (href.startsWith('#') || a.target === '_blank' || href.startsWith('mailto:') || href.startsWith('tel:')) return;

    a.addEventListener('click', (e) => {
      // Only show loader for same-origin full navigations
      if (!isSameHost(href)) return;
      // Don’t reload same page
      const dest = new URL(href, location.href);
      if (dest.pathname === location.pathname && dest.search === location.search) return;
      // Show loader and let the browser navigate
      overlay.setAttribute('aria-hidden', 'false');
      document.body.classList.add('loading');
      // No preventDefault — we want native nav right away
    });
  });
}
