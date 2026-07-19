/* ============================================================
   ZHANG Zimo — Portfolio
   Interactions, animations, dark mode, scroll effects
   ============================================================ */

(function () {
  'use strict';

  // ============ DOM Elements ============
  const html = document.documentElement;
  const navbar = document.getElementById('navbar');
  const themeToggle = document.getElementById('themeToggle');
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const customCursor = document.getElementById('customCursor');

  // ============ Theme Management ============
  const savedTheme = localStorage.getItem('theme') || 'light';
  html.setAttribute('data-theme', savedTheme);

  themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });

  // ============ Mobile Menu ============
  menuToggle.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.contains('open');
    if (isOpen) {
      mobileMenu.classList.remove('open');
      menuToggle.classList.remove('active');
      document.body.style.overflow = '';
    } else {
      mobileMenu.classList.add('open');
      menuToggle.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  });

  // Close mobile menu on link click
  mobileMenu.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      menuToggle.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // ============ Custom Cursor ============
  if (customCursor && window.matchMedia('(min-width: 810px)').matches) {
    let cursorVisible = false;
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!cursorVisible) {
        cursorVisible = true;
        customCursor.classList.add('visible');
      }
    });

    document.addEventListener('mouseleave', () => {
      cursorVisible = false;
      customCursor.classList.remove('visible');
    });

    // Hover effect on interactive elements
    const interactiveEls = document.querySelectorAll('a, button, .project-card, input, textarea');
    interactiveEls.forEach(el => {
      el.addEventListener('mouseenter', () => customCursor.classList.add('hover-link'));
      el.addEventListener('mouseleave', () => customCursor.classList.remove('hover-link'));
    });

    // Smooth cursor animation
    function animateCursor() {
      cursorX += (mouseX - cursorX) * 0.2;
      cursorY += (mouseY - cursorY) * 0.2;
      customCursor.style.left = cursorX + 'px';
      customCursor.style.top = cursorY + 'px';
      requestAnimationFrame(animateCursor);
    }
    requestAnimationFrame(animateCursor);
  }

  // ============ Scroll-based Navigation Effects ============
  let lastScrollY = 0;
  let scrollTicking = false;

  function updateNav() {
    const scrollY = window.scrollY;

    // Add scrolled class
    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Hide/show on scroll direction
    if (scrollY > lastScrollY && scrollY > 200) {
      navbar.classList.add('hidden');
      // Close mobile menu if open
      if (mobileMenu.classList.contains('open')) {
        mobileMenu.classList.remove('open');
        menuToggle.classList.remove('active');
        document.body.style.overflow = '';
      }
    } else if (scrollY < lastScrollY) {
      navbar.classList.remove('hidden');
    }

    // Update active nav link based on scroll position
    updateActiveNavLink(scrollY);

    lastScrollY = scrollY;
    scrollTicking = false;
  }

  function updateActiveNavLink(scrollY) {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    let currentSection = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (scrollY >= sectionTop) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-page') === currentSection) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      requestAnimationFrame(updateNav);
      scrollTicking = true;
    }
  });

  // ============ Scroll-triggered Appear Animations ============
  const appearEls = document.querySelectorAll('.appear, .project-card, .hero-greeting, .hero-quote, .hero-philosophy, .about-text-large, .about-text, .p1-hero, .p1-awards, .p1-context, .p1-characters, .p1-stills, .p2-sec, .p2-hero');

  const appearObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  appearEls.forEach(el => {
    appearObserver.observe(el);
  });


  // Homepage hero staggered entrance (runs once on load)
  const heroIntro = document.querySelector('.hero-intro');
  const heroQuote = document.querySelector('.hero-quote');
  const heroPhil = document.querySelector('.hero-philosophy');
  [heroIntro, heroQuote, heroPhil].forEach(function(el, i) {
    if (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
      el.style.transitionDelay = (i * 0.15) + 's';
      requestAnimationFrame(function() { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; });
    }
  });

  // ============ Parallax Effect on Project Images ============
  const projectCards = document.querySelectorAll('.project-card');

  projectCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const img = card.querySelector('.project-image');
      if (img) {
        img.style.transform = `scale(1.03) translate(${x * 8}px, ${y * 8}px)`;
      }
    });

    card.addEventListener('mouseleave', (e) => {
      const img = card.querySelector('.project-image');
      if (img) {
        img.style.transform = '';
      }
    });
  });

  // ============ Smooth Page Navigation ============
  // Intercept internal links for SPA-like transitions
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="./"]');
    if (!link) return;
    // Allow normal navigation for project pages
    if (link.getAttribute('href').startsWith('./projects/')) return;

    e.preventDefault();
    const href = link.getAttribute('href');

    // Page transition animation
    const transition = document.querySelector('.page-transition');
    if (transition) {
      transition.classList.add('active');
      setTimeout(() => {
        window.location.href = href;
      }, 500);
    } else {
      window.location.href = href;
    }
  });

  // ============ Keyboard Navigation ============
  document.addEventListener('keydown', (e) => {
    // Escape to close mobile menu
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      mobileMenu.classList.remove('open');
      menuToggle.classList.remove('active');
      document.body.style.overflow = '';
    }

    // 'T' to toggle theme
    if (e.key === 't' && !e.target.matches('input, textarea')) {
      const current = html.getAttribute('data-theme');
      const next = current === 'light' ? 'dark' : 'light';
      html.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    }
  });

  // ============ Performance: Lazy load images ============
  if ('loading' in HTMLImageElement.prototype) {
    // Browser supports native lazy loading — already applied in HTML
  } else {
    // Fallback: IntersectionObserver-based lazy loading
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
          }
          imageObserver.unobserve(img);
        }
      });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
  }

  console.log('%c ZHANG Zimo — Portfolio %c Ready ',
    'background: #8181e6; color: #fff; padding: 4px 8px; border-radius: 4px 0 0 4px;',
    'background: #303030; color: #fff; padding: 4px 8px; border-radius: 0 4px 4px 0;');
})();
