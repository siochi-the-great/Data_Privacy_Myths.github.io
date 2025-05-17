// sidebar-navigation.js

document.addEventListener('DOMContentLoaded', () => {
  const sidebarLinks = document.querySelectorAll('.sidebar a');
  const allLinks = document.querySelectorAll('a');
  const mainContent = document.querySelector('.main-content');

  // Load content dynamically
  function loadContent(url, pushToHistory = true) {
    fetch(url)
      .then(response => {
        if (!response.ok) throw new Error(`Failed to fetch ${url}`);
        return response.text();
      })
      .then(html => {
        const parser = new DOMParser();
        const newDoc = parser.parseFromString(html, 'text/html');
        const newContent = newDoc.querySelector('.main-content');
        const newTitle = newDoc.title;

        if (newContent && mainContent) {
          mainContent.innerHTML = newContent.innerHTML;
          document.title = newTitle || document.title;
          if (pushToHistory) {
            history.pushState({ url }, '', url);
          }
          window.scrollTo(0, 0);
          updateActiveLink(url);
        }
      })
      .catch(err => {
        console.error('Content load failed:', err);
        alert('Failed to load content.');
      });
  }

  // Update active link styling
  function updateActiveLink(currentUrl) {
    sidebarLinks.forEach(link => {
      const linkUrl = link.getAttribute('href');
      link.classList.toggle('active', linkUrl === currentUrl);
    });
  }

  // Attach click events to sidebar links (AJAX load)
  sidebarLinks.forEach(link => {
    link.addEventListener('click', event => {
      const url = link.getAttribute('href');
      const current = window.location.pathname.split('/').pop() || 'index.html';

      // Avoid reloading the same page
      if (url === current) return;

      event.preventDefault();
      loadContent(url);
    });
  });

  // Handle browser back/forward navigation
  window.addEventListener('popstate', event => {
    if (event.state?.url) {
      loadContent(event.state.url, false);
    }
  });

  // Fallback behavior for non-sidebar links (force full load)
  allLinks.forEach(link => {
    const href = link.getAttribute('href');
    const isInternal = href && !href.startsWith('http') && !href.startsWith('#');
    const isSidebarLink = link.closest('.sidebar');

    if (isInternal && !isSidebarLink) {
      link.addEventListener('click', e => {
        e.preventDefault();
        window.location.href = href;
      });
    }
  });

  // Highlight the active sidebar link on initial load
  const initial = window.location.pathname.split('/').pop() || 'index.html';
  updateActiveLink(initial);
});
