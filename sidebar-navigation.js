// sidebar-navigation.js

document.addEventListener('DOMContentLoaded', () => {
  const sidebarLinks = document.querySelectorAll('.sidebar a');
  const mainContent = document.querySelector('.main-content');

  // Load page content dynamically
  function loadContent(url, pushToHistory = true) {
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to fetch ${url} (Status: ${response.status})`);
        }
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
        } else {
          console.warn('No .main-content found in loaded page.');
        }
      })
      .catch(err => {
        console.error('Error loading content:', err);
        alert('Failed to load the page. Please try again.');
      });
  }

  // Update active link styling
  function updateActiveLink(currentUrl) {
    sidebarLinks.forEach(link => {
      const linkUrl = link.getAttribute('href');
      if (linkUrl === currentUrl) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // Handle sidebar link clicks
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

  // On initial load, highlight active link
  const initialPage = window.location.pathname.split('/').pop() || 'index.html';
  updateActiveLink(initialPage);
});
