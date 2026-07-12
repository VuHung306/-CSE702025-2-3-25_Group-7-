// Main interactive behavior for the SmartLibrary home page.

(document => {
  const header = document.querySelector('.site-header');
  const navLinks = document.querySelector('.nav-links');
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const searchForm = document.querySelector('.search-bar');
  const searchInput = document.querySelector('.search-bar input');
  const buttons = document.querySelectorAll('button, a');

  // Add a small sticky effect when the page is scrolled.
  const handleScroll = () => {
    if (!header) return;

    if (window.scrollY > 20) {
      header.style.background = 'rgba(255, 255, 255, 0.98)';
      header.style.boxShadow = '0 6px 20px rgba(15, 23, 42, 0.08)';
    } else {
      header.style.background = 'rgba(255, 255, 255, 0.96)';
      header.style.boxShadow = '0 4px 20px rgba(15, 23, 42, 0.06)';
    }
  };

  // Toggle the mobile navigation menu when the hamburger button is clicked.
  const toggleMobileMenu = () => {
    if (!navLinks || !mobileMenuToggle) return;

    const isOpen = navLinks.classList.toggle('is-open');
    mobileMenuToggle.setAttribute('aria-expanded', String(isOpen));
  };

  // Close the menu when switching to a wider screen.
  const handleResponsiveMenu = () => {
    if (!navLinks || !mobileMenuToggle) return;

    if (window.innerWidth <= 700) {
      mobileMenuToggle.style.display = 'inline-block';
      navLinks.classList.remove('is-open');
      mobileMenuToggle.setAttribute('aria-expanded', 'false');
    } else {
      mobileMenuToggle.style.display = 'none';
      navLinks.classList.remove('is-open');
      mobileMenuToggle.setAttribute('aria-expanded', 'false');
    }
  };

  // Highlight the current page in the navbar.
  const highlightActiveLink = () => {
    const links = document.querySelectorAll('.nav-links a');
    if (!links.length) return;

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    links.forEach(link => {
      const linkPage = link.getAttribute('href').split('/').pop() || 'index.html';
      if (linkPage === currentPage) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  };

  // Add simple hover feedback for buttons and links.
  const addHoverFeedback = () => {
    buttons.forEach(button => {
      button.addEventListener('mouseenter', () => {
        button.style.transform = 'translateY(-2px)';
        button.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';
      });

      button.addEventListener('mouseleave', () => {
        button.style.transform = 'translateY(0)';
      });
    });
  };

  // Smooth scrolling for in-page links.
  const addSmoothScrolling = () => {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', event => {
        const targetId = link.getAttribute('href');
        if (!targetId || targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (!targetElement) return;

        event.preventDefault();
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  };

  // Show a simple notification when the search box is empty.
  const showSearchNotice = () => {
    if (!searchForm || !searchInput) return;

    searchForm.addEventListener('submit', event => {
      event.preventDefault();

      if (searchInput.value.trim() === '') {
        let notice = document.querySelector('.search-notice');

        if (!notice) {
          notice = document.createElement('div');
          notice.className = 'search-notice';
          notice.style.marginTop = '0.8rem';
          notice.style.padding = '0.75rem 1rem';
          notice.style.background = '#dbeafe';
          notice.style.color = '#1d4ed8';
          notice.style.borderRadius = '999px';
          notice.style.display = 'inline-block';
          notice.textContent = 'Vui lòng nhập từ khóa trước khi tìm kiếm.';
          searchForm.appendChild(notice);
        }

        setTimeout(() => {
          if (notice) notice.remove();
        }, 2200);
      } else {
        searchInput.value = '';
        alert('Tìm kiếm demo đã được gửi.');
      }
    });
  };

  // Create and manage the scroll-to-top button.
  const createScrollTopButton = () => {
    const button = document.createElement('button');
    button.className = 'scroll-top-btn';
    button.setAttribute('aria-label', 'Cuộn lên đầu trang');
    button.innerHTML = '↑';
    button.style.position = 'fixed';
    button.style.right = '1.2rem';
    button.style.bottom = '1.2rem';
    button.style.display = 'none';
    button.style.border = 'none';
    button.style.borderRadius = '999px';
    button.style.background = '#2563eb';
    button.style.color = '#ffffff';
    button.style.width = '48px';
    button.style.height = '48px';
    button.style.cursor = 'pointer';
    button.style.boxShadow = '0 8px 20px rgba(37, 99, 235, 0.25)';
    button.style.zIndex = '2000';

    document.body.appendChild(button);

    window.addEventListener('scroll', () => {
      button.style.display = window.scrollY > 400 ? 'block' : 'none';
    });

    button.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  // Initialize all page interactions.
  const init = () => {
    const logout = () => {
      localStorage.removeItem('smartlibrary-user');
      localStorage.removeItem('smartlibrary-borrow-cart');
      const isPageInsidePagesFolder = window.location.pathname.includes('/pages/');
      window.location.href = isPageInsidePagesFolder ? '../index.html' : 'index.html';
    };

    handleResponsiveMenu();
    handleScroll();
    highlightActiveLink();
    addHoverFeedback();
    addSmoothScrolling();
    showSearchNotice();
    createScrollTopButton();

    // Keep the login state visible on every page. The login page stores this
    // object after a successful API response.
    const savedUser = localStorage.getItem('smartlibrary-user');
    const navCta = document.querySelector('.nav-cta');
    if (savedUser && navCta) {
      try {
        const user = JSON.parse(savedUser);
        const isAdmin = user.role && user.role.name === 'ADMIN';
        const isLibrarian = user.role && user.role.name.toUpperCase() === 'LIBRARIAN';
        const isPageInsidePagesFolder = window.location.pathname.includes('/pages/');
        const pagePrefix = isPageInsidePagesFolder ? '' : 'pages/';
        navCta.textContent = `Xin chào, ${user.username}`;
        navCta.href = `${pagePrefix}${(isAdmin || isLibrarian) ? 'admin.html' : 'profile.html'}`;

        const logoutButton = document.createElement('button');
        logoutButton.type = 'button';
        logoutButton.className = 'nav-cta logout-btn';
        logoutButton.textContent = 'Đăng xuất';
        logoutButton.style.marginLeft = '0.5rem';
        logoutButton.addEventListener('click', logout);
        navCta.insertAdjacentElement('afterend', logoutButton);
      } catch (_) {
        localStorage.removeItem('smartlibrary-user');
      }
    }

    document.querySelectorAll('a[href="#logout"]').forEach(link => {
      link.addEventListener('click', event => {
        event.preventDefault();
        logout();
      });
    });

    if (mobileMenuToggle) {
      mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }
  };

  window.addEventListener('scroll', handleScroll);
  window.addEventListener('resize', handleResponsiveMenu);
  init();
})(document);
