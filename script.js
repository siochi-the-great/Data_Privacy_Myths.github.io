document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-bs-toggle="collapse"]').forEach(el => {
      const icon = el.querySelector('.rotate');
      const targetId = el.getAttribute('href');
  
      el.addEventListener('click', () => {
        setTimeout(() => {
          const target = document.querySelector(targetId);
          if (target.classList.contains('show')) {
            icon.classList.add('down');
          } else {
            icon.classList.remove('down');
          }
        }, 200);
      });
    });
  });
  