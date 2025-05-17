// sidebar-navigation.js

document.addEventListener('DOMContentLoaded', () => {
  const sidebarLinks = document.querySelectorAll('.sidebar a');

  function loadContent(url, push = true) {
    fetch(url)
      .then(res => res.text())
      .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const newContent = doc.querySelector('.main-content');
        const pageTitle = doc.title;

        if (newContent) {
          document.querySelector('.main-content').innerHTML = newContent.innerHTML;
          if (push) history.pushState({ url }, '', url);
          if (pageTitle) document.title = pageTitle;
          window.scrollTo({ top: 0, behavior: 'instant' }); // Optional: scroll to top manually
        }
      })
      .catch(err => {
        console.error('Failed to load content:', err);
        alert('Sorry, the content could not be loaded.');
      });
  }

  sidebarLinks.forEach(link => {
    link.addEventListener('click', event => {
      const url = link.getAttribute('href');

      // Avoid reloading current page
      if (window.location.pathname.endsWith(url)) return;

      event.preventDefault();
      loadContent(url);
    });
  });

  // Back/forward navigation
  window.addEventListener('popstate', event => {
    if (event.state?.url) {
      loadContent(event.state.url, false);
    }
  });
});
