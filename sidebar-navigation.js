// combined-navigation.js

document.addEventListener('DOMContentLoaded', () => {
  // Get the base URL for GitHub Pages
  // This handles both username.github.io and username.github.io/repo-name structures
  const getBaseUrl = () => {
    // Get current path
    const path = window.location.pathname;
    // For GitHub Pages with custom domain or username.github.io format
    if (path.indexOf('.github.io') > -1 || path === '/') {
      return '/';
    }
    // For username.github.io/repo-name format
    const pathSegments = path.split('/');
    if (pathSegments.length > 1) {
      return '/' + pathSegments[1] + '/';
    }
    return '/';
  };

  const baseUrl = getBaseUrl();

  function resolveUrl(url) {
    // If the URL is already absolute, return it as is
    if (url.startsWith('http')) return url;
    
    // If the URL starts with '/', it's relative to the domain root
    if (url.startsWith('/')) {
      const domain = window.location.origin;
      // For repo-based GitHub Pages, we need to adjust the path
      if (baseUrl !== '/') {
        // Remove any leading slash from URL to avoid double slashes
        return `${domain}${baseUrl}${url.replace(/^\//, '')}`;
      }
      return `${domain}${url}`;
    }

    // For relative URLs without leading slash
    const currentPath = window.location.pathname;
    const directory = currentPath.substring(0, currentPath.lastIndexOf('/') + 1);
    return `${window.location.origin}${directory}${url}`;
  }

  // Sidebar SPA-style navigation
  const sidebarLinks = document.querySelectorAll('.sidebar a');
  
  // Initialize navigation button handling
  attachNavigationListeners();
  
  

  function loadContent(url, push = true) {
    const resolvedUrl = resolveUrl(url);
    
    fetch(resolvedUrl)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.text();
      })
      .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const newContent = doc.querySelector('.main-content');
        const pageTitle = doc.title;

        if (newContent) {
          document.querySelector('.main-content').innerHTML = newContent.innerHTML;
          if (push) history.pushState({ url: resolvedUrl }, '', resolvedUrl);
          if (pageTitle) document.title = pageTitle;
          window.scrollTo({ top: 0, behavior: 'instant' });
          
          // Re-attach event listeners to the newly loaded next/prev buttons
          attachNavigationListeners();
        }
      })
      .catch(err => {
        console.error('Failed to load content:', err);
        alert('Sorry, the content could not be loaded.');
      });
  }
  
  // Function to attach event listeners to navigation buttons
  function attachNavigationListeners() {
    const newNavigationButtons = document.querySelectorAll('.navigation-buttons a, .next-button, .prev-button, a.next, a.previous');
    
    newNavigationButtons.forEach(button => {
      // Remove any existing event listeners first
      const newButton = button.cloneNode(true);
      button.parentNode.replaceChild(newButton, button);
      
      newButton.addEventListener('click', function(e) {
        const href = newButton.getAttribute('href');
        
        // Skip links that are external, anchors, or javascript functions
        if (!href || href.startsWith('http') || href.startsWith('#') || href.startsWith('javascript:')) {
          return;
        }
        
        e.preventDefault();
        
        // First scroll to top for immediate visual feedback
        window.scrollTo({ top: 0, behavior: 'instant' });
        
        // Use SPA navigation for next/prev buttons
        loadContent(href);
      });
    });
  }

  sidebarLinks.forEach(link => {
    link.addEventListener('click', event => {
      const url = link.getAttribute('href');
      const resolvedUrl = resolveUrl(url);
      
      // Check if this link should use SPA navigation or force a full reload
      const forceReload = link.hasAttribute('data-force-reload');
      
      // Avoid reloading current page
      if (window.location.href === resolvedUrl) return;

      event.preventDefault();
      
      if (forceReload) {
        // Force full page reload for this specific link
        // First scroll to top for immediate visual feedback
        window.scrollTo({ top: 0, behavior: 'instant' });
        window.location.href = resolvedUrl;
      } else {
        // Use SPA-style navigation
        loadContent(url);
      }
    });
  });

  // Back/forward navigation
  window.addEventListener('popstate', event => {
    if (event.state?.url) {
      loadContent(event.state.url, false);
    }
  });
  
  // Force full page reload for non-sidebar, non-navigation links
  document.querySelectorAll('a:not(.sidebar a):not(.navigation-buttons a):not(.next-button):not(.prev-button):not(a.next):not(a.previous)').forEach(link => {
    link.addEventListener('click', function(e) {
      const href = link.getAttribute('href');
      
      // Skip links that are external, anchors, or javascript functions
      if (!href || href.startsWith('http') || href.startsWith('#') || href.startsWith('javascript:')) {
        return;
      }
      
      const resolvedUrl = resolveUrl(href);
      
      // Skip if it's the current page
      if (window.location.href === resolvedUrl) {
        return;
      }
      
      e.preventDefault(); // prevent default browser behavior
      
      // First scroll to top for immediate visual feedback
      window.scrollTo({ top: 0, behavior: 'instant' });
      
      // Then trigger the full page load
      window.location.href = resolvedUrl;
    });
  });
  document.querySelectorAll('a:not(.sidebar a)').forEach(link => {
    link.addEventListener('click', function(e) {
      const href = link.getAttribute('href');
      
      // Skip links that are external, anchors, or javascript functions
      if (!href || href.startsWith('http') || href.startsWith('#') || href.startsWith('javascript:')) {
        return;
      }
      
      const resolvedUrl = resolveUrl(href);
      
      // Skip if it's the current page
      if (window.location.href === resolvedUrl) {
        return;
      }
      
      e.preventDefault(); // prevent default browser behavior
      
      // First scroll to top for immediate visual feedback
      window.scrollTo({ top: 0, behavior: 'instant' });
      
      // Then trigger the full page load
      window.location.href = resolvedUrl;
    });
  });
});