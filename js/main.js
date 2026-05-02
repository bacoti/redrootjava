/* ============================================
   RED ROOT JAVA - MAIN JAVASCRIPT
   Premium Ginger Powder Brand
   ============================================ */

/**
 * Main Application Module
 * Handles all interactive functionality using vanilla JavaScript
 */
const App = (() => {
  'use strict';

  // ============================================
  // CONFIGURATION
  // ============================================
  const CONFIG = {
    scrollThreshold: 50,
    revealOffset: 100,
    animationDuration: 300,
    debounceDelay: 10,
  };

  // ============================================
  // DOM CACHE
  // ============================================
  const DOM = {
    header: null,
    nav: null,
    menuToggle: null,
    navLinks: null,
    revealElements: null,
    smoothScrollLinks: null,
  };

  // ============================================
  // STATE
  // ============================================
  const state = {
    isMenuOpen: false,
    isScrolled: false,
    lastScrollY: 0,
  };

  // ============================================
  // UTILITY FUNCTIONS
  // ============================================

  /**
   * Debounce function to limit execution rate
   */
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  };

  /**
   * Throttle function for performance-critical operations
   */
  const throttle = (func, limit) => {
    let inThrottle;
    return (...args) => {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  };

  /**
   * Check if element is in viewport
   */
  const isInViewport = (element, offset = 0) => {
    const rect = element.getBoundingClientRect();
    return (
      rect.top <= (window.innerHeight || document.documentElement.clientHeight) - offset &&
      rect.bottom >= 0
    );
  };

  /**
   * Add class to element
   */
  const addClass = (element, className) => {
    if (element && !element.classList.contains(className)) {
      element.classList.add(className);
    }
  };

  /**
   * Remove class from element
   */
  const removeClass = (element, className) => {
    if (element && element.classList.contains(className)) {
      element.classList.remove(className);
    }
  };

  /**
   * Toggle class on element
   */
  const toggleClass = (element, className) => {
    if (element) {
      element.classList.toggle(className);
    }
  };

  // ============================================
  // HEADER & NAVIGATION MODULE
  // ============================================
  const Navigation = {
    /**
     * Initialize navigation features
     */
    init() {
      DOM.header = document.querySelector('.header');
      DOM.navLinks = document.querySelectorAll('.nav__link[href^="#"]');
      DOM.sections = document.querySelectorAll('section[id]');
      DOM.menuToggle = document.querySelector('.menu-toggle');
      DOM.nav = document.querySelector('.nav');

      if (!DOM.header) return;

      this.checkScroll();
      this.bindEvents();
      this.setupIntersectionObserver();
    },

    /**
     * Bind navigation events
     */
    bindEvents() {
      // Mobile menu toggle
      if (DOM.menuToggle && DOM.nav) {
        DOM.menuToggle.addEventListener('click', () => this.toggleMenu());
      }

      // Close menu on link click
      if (DOM.navLinks.length > 0) {
        DOM.navLinks.forEach(link => {
          link.addEventListener('click', () => {
            if (state.isMenuOpen) this.toggleMenu();
          });
        });
      }

      // Header scroll effect
      window.addEventListener('scroll', throttle(() => {
        this.checkScroll();
      }, 16), { passive: true });
    },

    /**
     * Setup IntersectionObserver for active navigation links
     */
    setupIntersectionObserver() {
      const options = {
        root: null,
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const currentId = entry.target.getAttribute('id');
            DOM.navLinks.forEach(link => {
              removeClass(link, 'nav__link--active');
              removeClass(link, 'bottom-nav__item--active');
              
              if (link.getAttribute('href') === `#${currentId}`) {
                if (link.classList.contains('nav__link')) {
                  addClass(link, 'nav__link--active');
                }
                if (link.classList.contains('bottom-nav__item')) {
                  addClass(link, 'bottom-nav__item--active');
                }
              }
            });
          }
        });
      }, options);

      DOM.sections.forEach(section => {
        observer.observe(section);
      });
    },

    /**
     * Toggle mobile menu
     */
    toggleMenu() {
      state.isMenuOpen = !state.isMenuOpen;
      
      const isExpanded = state.isMenuOpen;
      DOM.menuToggle.setAttribute('aria-expanded', isExpanded);
      
      toggleClass(DOM.nav, 'nav--active');
      toggleClass(DOM.menuToggle, 'menu-toggle--active');
      
      if (state.isMenuOpen) {
        addClass(document.body, 'no-scroll');
      } else {
        removeClass(document.body, 'no-scroll');
      }
    },

    /**
     * Check scroll position and update header
     */
    checkScroll() {
      const scrollY = window.scrollY;
      
      if (scrollY > CONFIG.scrollThreshold && !state.isScrolled) {
        state.isScrolled = true;
        addClass(DOM.header, 'header--scrolled');
      } else if (scrollY <= CONFIG.scrollThreshold && state.isScrolled) {
        state.isScrolled = false;
        removeClass(DOM.header, 'header--scrolled');
      }
      
      state.lastScrollY = scrollY;
    }
  };

  // ============================================
  // SMOOTH SCROLL MODULE
  // ============================================
  const SmoothScroll = {
    /**
     * Initialize smooth scrolling
     */
    init() {
      DOM.smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
      this.bindEvents();
    },

    /**
     * Bind smooth scroll events
     */
    bindEvents() {
      DOM.smoothScrollLinks.forEach(link => {
        link.addEventListener('click', (e) => this.handleClick(e, link));
      });
    },

    /**
     * Handle smooth scroll click
     */
    handleClick(e, link) {
      const href = link.getAttribute('href');

      // Skip if it's just "#"
      if (href === '#') return;

      const target = document.querySelector(href);

      if (target) {
        e.preventDefault();
        this.scrollTo(target);
      }
    },

    /**
     * Scroll to target element
     */
    scrollTo(target) {
      const headerHeight = DOM.header ? DOM.header.offsetHeight : 0;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });

      // Update active link after scroll completes
      setTimeout(() => {
        Navigation.updateActiveLink();
      }, 600);
    }
  };

  // ============================================
  // SCROLL REVEAL MODULE
  // ============================================
  const ScrollReveal = {
    /**
     * Initialize scroll reveal animations
     */
    init() {
      DOM.revealElements = document.querySelectorAll('.reveal, .reveal-stagger');

      if (DOM.revealElements.length === 0) return;

      this.setupObserver();
    },

    /**
     * Setup IntersectionObserver for reveal elements
     */
    setupObserver() {
      const options = {
        root: null,
        rootMargin: `0px 0px -${CONFIG.revealOffset}px 0px`,
        threshold: 0.1
      };

      const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            addClass(entry.target, 'reveal--visible');
            observer.unobserve(entry.target);
          }
        });
      }, options);

      DOM.revealElements.forEach(element => {
        observer.observe(element);
      });
    }
  };

  // ============================================
  // BUTTON EFFECTS MODULE
  // ============================================
  const ButtonEffects = {
    /**
     * Initialize button effects
     */
    init() {
      const buttons = document.querySelectorAll('.btn');
      buttons.forEach(btn => this.addRippleEffect(btn));
    },

    /**
     * Add ripple effect to button
     */
    addRippleEffect(button) {
      button.addEventListener('click', function (e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ripple = document.createElement('span');
        ripple.className = 'btn-ripple';
        ripple.style.cssText = `
          position: absolute;
          background: rgba(255,255,255,0.3);
          border-radius: 50%;
          transform: scale(0);
          animation: ripple 0.6s linear;
          left: ${x}px;
          top: ${y}px;
          width: 100px;
          height: 100px;
          margin-left: -50px;
          margin-top: -50px;
          pointer-events: none;
        `;

        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
      });
    }
  };

  // ============================================
  // COUNTER ANIMATION MODULE
  // ============================================
  const CounterAnimation = {
    /**
     * Initialize counter animations
     */
    init() {
      const counters = document.querySelectorAll('[data-counter]');

      if (counters.length === 0) return;

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });

      counters.forEach(counter => observer.observe(counter));
    },

    /**
     * Animate a single counter
     */
    animateCounter(element) {
      const target = parseInt(element.getAttribute('data-counter'));
      const suffix = element.getAttribute('data-suffix') || '';
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;

      const formatNumber = (num) => {
        return Math.floor(num).toLocaleString('id-ID');
      };

      const update = () => {
        current += step;
        if (current < target) {
          element.innerHTML = formatNumber(current) + (suffix ? `<span class="unit">${suffix}</span>` : '');
          requestAnimationFrame(update);
        } else {
          element.innerHTML = formatNumber(target) + (suffix ? `<span class="unit">${suffix}</span>` : '');
        }
      };

      update();
    }
  };

  // ============================================
  // TESTIMONIAL SLIDER MODULE
  // ============================================
  const TestimonialSlider = {
    currentIndex: 0,
    cards: null,
    autoplayInterval: null,

    /**
     * Initialize testimonial slider (for mobile)
     */
    init() {
      this.cards = document.querySelectorAll('.testimonial-card');

      if (this.cards.length <= 1) return;

      // Only activate slider on mobile
      if (window.innerWidth <= 768) {
        this.setupSlider();
        this.startAutoplay();
      }

      window.addEventListener('resize', debounce(() => {
        if (window.innerWidth <= 768) {
          this.startAutoplay();
        } else {
          this.stopAutoplay();
          this.resetSlider();
        }
      }, 200));
    },

    /**
     * Setup slider indicators
     */
    setupSlider() {
      const container = document.querySelector('.testimonials__grid');
      if (!container) return;

      // Create indicators
      const indicators = document.createElement('div');
      indicators.className = 'testimonial-indicators';
      indicators.style.cssText = `
        display: flex;
        justify-content: center;
        gap: 8px;
        margin-top: 24px;
      `;

      this.cards.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.className = 'testimonial-dot';
        dot.setAttribute('aria-label', `Go to testimonial ${index + 1}`);
        dot.style.cssText = `
          width: 10px;
          height: 10px;
          border-radius: 50%;
          border: none;
          background: ${index === 0 ? '#fff' : 'rgba(255,255,255,0.3)'};
          cursor: pointer;
          transition: background 0.3s ease;
        `;
        dot.addEventListener('click', () => this.goTo(index));
        indicators.appendChild(dot);
      });

      container.parentNode.appendChild(indicators);
    },

    /**
     * Go to specific slide
     */
    goTo(index) {
      this.currentIndex = index;
      this.cards.forEach((card, i) => {
        card.style.display = i === index ? 'block' : 'none';
      });
      this.updateIndicators();
    },

    /**
     * Update indicator dots
     */
    updateIndicators() {
      const dots = document.querySelectorAll('.testimonial-dot');
      dots.forEach((dot, index) => {
        dot.style.background = index === this.currentIndex ? '#fff' : 'rgba(255,255,255,0.3)';
      });
    },

    /**
     * Start autoplay
     */
    startAutoplay() {
      this.stopAutoplay();
      this.autoplayInterval = setInterval(() => {
        this.currentIndex = (this.currentIndex + 1) % this.cards.length;
        this.goTo(this.currentIndex);
      }, 5000);
    },

    /**
     * Stop autoplay
     */
    stopAutoplay() {
      if (this.autoplayInterval) {
        clearInterval(this.autoplayInterval);
      }
    },

    /**
     * Reset slider for desktop
     */
    resetSlider() {
      this.cards.forEach(card => card.style.display = '');
      const indicators = document.querySelector('.testimonial-indicators');
      if (indicators) indicators.remove();
    }
  };

  // ============================================
  // FORM HANDLING MODULE (for future use)
  // ============================================
  const FormHandler = {
    /**
     * Initialize form handling
     */
    init() {
      const forms = document.querySelectorAll('form');
      forms.forEach(form => this.setupForm(form));
    },

    /**
     * Setup individual form
     */
    setupForm(form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSubmit(form);
      });
    },

    /**
     * Handle form submission
     */
    handleSubmit(form) {
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      // Add your form submission logic here
      console.log('Form submitted:', data);

      // Show success message
      this.showMessage(form, 'Thank you! We will contact you soon.', 'success');
    },

    /**
     * Show form message
     */
    showMessage(form, message, type) {
      const existingMessage = form.querySelector('.form-message');
      if (existingMessage) existingMessage.remove();

      const messageEl = document.createElement('div');
      messageEl.className = `form-message form-message--${type}`;
      messageEl.textContent = message;
      messageEl.style.cssText = `
        padding: 12px 16px;
        margin-top: 16px;
        border-radius: 8px;
        font-size: 14px;
        background: ${type === 'success' ? '#d4edda' : '#f8d7da'};
        color: ${type === 'success' ? '#155724' : '#721c24'};
      `;

      form.appendChild(messageEl);

      setTimeout(() => messageEl.remove(), 5000);
    }
  };

  // ============================================
  // LAZY LOADING MODULE
  // ============================================
  const LazyLoad = {
    /**
     * Initialize lazy loading for images
     */
    init() {
      const images = document.querySelectorAll('img[data-src]');

      if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              this.loadImage(entry.target);
              imageObserver.unobserve(entry.target);
            }
          });
        }, { rootMargin: '50px' });

        images.forEach(img => imageObserver.observe(img));
      } else {
        // Fallback for older browsers
        images.forEach(img => this.loadImage(img));
      }
    },

    /**
     * Load a single image
     */
    loadImage(img) {
      const src = img.getAttribute('data-src');
      if (src) {
        img.src = src;
        img.removeAttribute('data-src');
        img.classList.add('loaded');
      }
    }
  };

  // ============================================
  // ACCESSIBILITY MODULE
  // ============================================
  const Accessibility = {
    /**
     * Initialize accessibility features
     */
    init() {
      this.setupSkipLink();
      this.setupFocusManagement();
      this.setupReducedMotion();
    },

    /**
     * Setup skip to content link
     */
    setupSkipLink() {
      const skipLink = document.querySelector('.skip-link');
      if (skipLink) {
        skipLink.addEventListener('click', (e) => {
          e.preventDefault();
          const target = document.querySelector(skipLink.getAttribute('href'));
          if (target) {
            target.tabIndex = -1;
            target.focus();
          }
        });
      }
    },

    /**
     * Manage focus states
     */
    setupFocusManagement() {
      // Add visible focus indicator only for keyboard navigation
      document.body.addEventListener('mousedown', () => {
        document.body.classList.add('using-mouse');
      });

      document.body.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
          document.body.classList.remove('using-mouse');
        }
      });
    },

    /**
     * Respect user's reduced motion preference
     */
    setupReducedMotion() {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

      const handleReducedMotion = (e) => {
        if (e.matches) {
          document.documentElement.style.setProperty('--transition-base', '0.01ms');
          document.documentElement.style.setProperty('--transition-slow', '0.01ms');
        }
      };

      handleReducedMotion(mediaQuery);
      mediaQuery.addEventListener('change', handleReducedMotion);
    }
  };

  // ============================================
  // PARALLAX EFFECT MODULE
  // ============================================
  const Parallax = {
    elements: null,

    /**
     * Initialize parallax effects
     */
    init() {
      this.elements = document.querySelectorAll('[data-parallax]');

      if (this.elements.length === 0) return;

      // Only enable parallax if user hasn't requested reduced motion
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        window.addEventListener('scroll', throttle(() => this.update(), 16));
      }
    },

    /**
     * Update parallax positions
     */
    update() {
      const scrollY = window.scrollY;

      this.elements.forEach(element => {
        const speed = parseFloat(element.getAttribute('data-parallax')) || 0.5;
        const offset = scrollY * speed;
        element.style.transform = `translateY(${offset}px)`;
      });
    }
  };

  // ============================================
  // MOUSE PARALLAX MODULE (NEW)
  // ============================================
  const MouseParallax = {
    elements: null,
    container: null,

    init() {
      this.container = document.querySelector('.hero');
      this.elements = document.querySelectorAll('[data-mouse-parallax]');

      if (!this.container || this.elements.length === 0) return;

      // Disable on mobile/touch devices
      if (window.matchMedia('(hover: none)').matches) return;

      this.bindEvents();
    },

    bindEvents() {
      this.container.addEventListener('mousemove', (e) => this.handleMouseMove(e));
      this.container.addEventListener('mouseleave', () => this.resetPositions());
    },

    handleMouseMove(e) {
      requestAnimationFrame(() => {
        const { width, height, left, top } = this.container.getBoundingClientRect();
        // Calculate mouse position relative to center of hero section
        // range: -0.5 to 0.5
        const x = (e.clientX - left) / width - 0.5;
        const y = (e.clientY - top) / height - 0.5;

        this.elements.forEach(el => {
          const speed = parseFloat(el.getAttribute('data-mouse-parallax')) || 20;
          const xOffset = x * speed;
          const yOffset = y * speed;

          el.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
        });
      });
    },

    resetPositions() {
      this.elements.forEach(el => {
        el.style.transform = 'translate(0, 0)';
      });
    }
  };

  // ============================================
  // BACK TO TOP MODULE
  // ============================================
  const BackToTop = {
    button: null,
    threshold: 300,

    /**
     * Initialize back to top functionality
     */
    init() {
      this.button = document.getElementById('backToTop');

      if (!this.button) return;

      this.bindEvents();
      this.checkVisibility();
    },

    /**
     * Bind events
     */
    bindEvents() {
      // Scroll event to show/hide button
      window.addEventListener('scroll', throttle(() => this.checkVisibility(), 100));

      // Click event to scroll to top
      this.button.addEventListener('click', () => this.scrollToTop());
    },

    /**
     * Check if button should be visible
     */
    checkVisibility() {
      if (window.scrollY > this.threshold) {
        this.button.classList.add('visible');
      } else {
        this.button.classList.remove('visible');
      }
    },

    /**
     * Scroll to top of page
     */
    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  // ============================================
  // FAQ ACCORDION MODULE
  // ============================================
  const FAQAccordion = {
    items: null,

    /**
     * Initialize FAQ accordion
     */
    init() {
      this.items = document.querySelectorAll('.faq__item');

      if (this.items.length === 0) return;

      this.bindEvents();
    },

    /**
     * Bind click events to FAQ questions
     */
    bindEvents() {
      this.items.forEach(item => {
        const question = item.querySelector('.faq__question');

        if (question) {
          question.addEventListener('click', () => this.toggleItem(item));

          // Keyboard accessibility
          question.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              this.toggleItem(item);
            }
          });
        }
      });
    },

    /**
     * Toggle FAQ item open/closed
     */
    toggleItem(item) {
      const isActive = item.classList.contains('faq__item--active');
      const question = item.querySelector('.faq__question');

      // Close all other items (accordion behavior)
      this.items.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('faq__item--active');
          const otherQuestion = otherItem.querySelector('.faq__question');
          if (otherQuestion) {
            otherQuestion.setAttribute('aria-expanded', 'false');
          }
        }
      });

      // Toggle current item
      if (isActive) {
        item.classList.remove('faq__item--active');
        question.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('faq__item--active');
        question.setAttribute('aria-expanded', 'true');
      }
    }
  };

  // ============================================
  // LOADING OVERLAY MODULE
  // ============================================
  const LoadingOverlay = {
    overlay: null,

    /**
     * Initialize loading overlay
     */
    init() {
      this.overlay = document.getElementById('loadingOverlay');

      if (!this.overlay) return;

      // Hide overlay when page is fully loaded
      window.addEventListener('load', () => this.hide());

      // Fallback: hide after 3 seconds max
      setTimeout(() => this.hide(), 3000);
    },

    /**
     * Hide the loading overlay
     */
    hide() {
      if (this.overlay) {
        this.overlay.classList.add('hidden');
      }
    },

    /**
     * Show the loading overlay
     */
    show() {
      if (this.overlay) {
        this.overlay.classList.remove('hidden');
      }
    }
  };

  // ============================================
  // COOKIE CONSENT MODULE
  // ============================================
  const CookieConsent = {
    banner: null,
    acceptBtn: null,
    declineBtn: null,
    storageKey: 'rrj_cookie_consent',

    /**
     * Initialize cookie consent
     */
    init() {
      this.banner = document.getElementById('cookieConsent');
      this.acceptBtn = document.getElementById('cookieAccept');
      this.declineBtn = document.getElementById('cookieDecline');

      if (!this.banner) return;

      this.bindEvents();
      this.checkConsent();
    },

    /**
     * Bind event listeners
     */
    bindEvents() {
      if (this.acceptBtn) {
        this.acceptBtn.addEventListener('click', () => this.accept());
      }

      if (this.declineBtn) {
        this.declineBtn.addEventListener('click', () => this.decline());
      }
    },

    /**
     * Check if user has already given consent
     */
    checkConsent() {
      const consent = this.getConsent();

      if (consent === null) {
        // Show banner after a short delay
        setTimeout(() => this.show(), 2000);
      }
    },

    /**
     * Get stored consent
     */
    getConsent() {
      try {
        return localStorage.getItem(this.storageKey);
      } catch (e) {
        return null;
      }
    },

    /**
     * Save consent
     */
    saveConsent(value) {
      try {
        localStorage.setItem(this.storageKey, value);
      } catch (e) {
        console.warn('Could not save cookie consent');
      }
    },

    /**
     * Show the banner
     */
    show() {
      if (this.banner) {
        this.banner.classList.add('visible');
      }
    },

    /**
     * Hide the banner
     */
    hide() {
      if (this.banner) {
        this.banner.classList.remove('visible');
        setTimeout(() => {
          this.banner.classList.add('hidden');
        }, 400);
      }
    },

    /**
     * Accept cookies
     */
    accept() {
      this.saveConsent('accepted');
      this.hide();
      console.log('🍪 Cookies accepted');
    },

    /**
     * Decline cookies
     */
    decline() {
      this.saveConsent('declined');
      this.hide();
      console.log('🍪 Cookies declined');
    }
  };

  // ============================================
  // IMAGE ERROR HANDLER MODULE
  // ============================================
  const ImageErrorHandler = {
    /**
     * Initialize image error handling
     */
    init() {
      this.handleExistingImages();
      this.observeNewImages();
    },

    /**
     * Handle errors for existing images
     */
    handleExistingImages() {
      const images = document.querySelectorAll('img');

      images.forEach(img => {
        // If image is already broken
        if (img.complete && img.naturalHeight === 0) {
          this.handleError(img);
        }

        // Add error listener
        img.addEventListener('error', () => this.handleError(img));
      });
    },

    /**
     * Handle image error
     */
    handleError(img) {
      const parent = img.parentElement;

      // Add error class to parent if it's a product card image
      if (parent && parent.classList.contains('product-card__image')) {
        parent.classList.add('img-error');
      }

      // Set fallback for other images
      if (!img.dataset.errorHandled) {
        img.dataset.errorHandled = 'true';
        console.warn(`Image failed to load: ${img.src}`);
      }
    },

    /**
     * Observe for dynamically added images
     */
    observeNewImages() {
      if (!('MutationObserver' in window)) return;

      const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
          mutation.addedNodes.forEach(node => {
            if (node.nodeName === 'IMG') {
              node.addEventListener('error', () => this.handleError(node));
            }
            if (node.querySelectorAll) {
              node.querySelectorAll('img').forEach(img => {
                img.addEventListener('error', () => this.handleError(img));
              });
            }
          });
        });
      });

      observer.observe(document.body, { childList: true, subtree: true });
    }
  };

  // ============================================
  // TABLE UX MODULE
  // ============================================
  const TableUX = {
    wrapper: null,
    container: null,
    scrollHint: null,

    /**
     * Initialize table UX features
     */
    init() {
      this.wrapper = document.querySelector('.comparison__table-wrapper');
      this.container = document.querySelector('.comparison__table-container');
      this.scrollHint = document.querySelector('.comparison__scroll-hint');

      if (!this.wrapper || !this.container) return;

      this.checkScroll();
      this.bindEvents();
    },

    /**
     * Bind scroll events
     */
    bindEvents() {
      this.wrapper.addEventListener('scroll', throttle(() => this.checkScroll(), 50));
      window.addEventListener('resize', debounce(() => this.checkScroll(), 100));

      // Hide hint on interaction
      this.wrapper.addEventListener('touchstart', () => {
        if (this.scrollHint) {
          this.scrollHint.style.opacity = '0';
          setTimeout(() => {
            this.scrollHint.style.display = 'none';
          }, 300);
        }
      }, { passive: true });
    },

    /**
     * Check scroll position and toggle shadow/hint
     */
    checkScroll() {
      const scrollLeft = this.wrapper.scrollLeft;
      const maxScroll = this.wrapper.scrollWidth - this.wrapper.clientWidth;

      // Toggle shadow
      if (scrollLeft < maxScroll - 10) {
        this.container.classList.add('show-scroll-shadow');
      } else {
        this.container.classList.remove('show-scroll-shadow');
      }

      // Toggle hint visibility based on checking if scrolling is needed
      if (maxScroll > 0 && scrollLeft === 0) {
        if (this.scrollHint && this.scrollHint.style.display !== 'none') {
          this.scrollHint.style.opacity = '1';
        }
      } else {
        if (this.scrollHint) {
          this.scrollHint.style.opacity = '0';
        }
      }
    }
  };

  // ============================================
  // INITIALIZATION
  // ============================================
  const init = () => {
    // Initialize all modules
    Navigation.init();
    SmoothScroll.init();
    ScrollReveal.init();
    ButtonEffects.init();
    CounterAnimation.init();
    TestimonialSlider.init();
    FormHandler.init();
    LazyLoad.init();
    Accessibility.init();
    Parallax.init();
    MouseParallax.init();
    BackToTop.init();
    FAQAccordion.init();
    LoadingOverlay.init();
    CookieConsent.init();
    ImageErrorHandler.init();
    TableUX.init();
    DynamicTestimonials.init();
    ProductModal.init();

    // Log initialization
    console.log('🌿 Red Root Java website initialized');
  };

  // Run initialization when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // ============================================
  // DYNAMIC TESTIMONIALS MODULE
  // Loads testimonials from API with static fallback
  // ============================================
  const DynamicTestimonials = {
    apiUrl: 'http://localhost:3000/api/testimonials',
    container: null,

    /**
     * Initialize dynamic testimonials loading
     */
    init() {
      this.container = document.getElementById('testimonials-grid');
      if (!this.container) return;

      // Try to load from API
      this.loadTestimonials();
    },

    /**
     * Load testimonials from API
     */
    async loadTestimonials() {
      try {
        const response = await fetch(this.apiUrl + '?limit=6');
        const result = await response.json();

        if (result.success && result.data && result.data.length > 0) {
          this.renderTestimonials(result.data);
        }
        // If empty or failed, keep static testimonials
      } catch (error) {
        console.log('Using static testimonials (API unavailable)');
        // Keep static testimonials as fallback
      }
    },

    /**
     * Render testimonials from API data
     */
    renderTestimonials(testimonials) {
      // Clear static testimonials
      const staticCards = this.container.querySelectorAll('[data-static="true"]');
      staticCards.forEach(card => card.style.display = 'none');

      // Create dynamic testimonial cards
      testimonials.forEach(testimonial => {
        const card = this.createTestimonialCard(testimonial);
        this.container.insertBefore(card, this.container.firstChild);
      });
    },

    /**
     * Create a testimonial card element
     */
    createTestimonialCard(testimonial) {
      const card = document.createElement('div');
      card.className = 'testimonial-card';
      card.setAttribute('data-dynamic', 'true');

      // Generate stars
      const stars = this.generateStars(testimonial.rating || 5);

      // Get initials for avatar
      const initials = this.getInitials(testimonial.name);

      // Get display name (first name only for privacy)
      const displayName = testimonial.name.split(' ')[0];

      // Format variant name
      const variantNames = {
        'original': 'Original',
        'coconut': 'Kelapa Creamy',
        'mango': 'Mangga'
      };
      const variant = variantNames[testimonial.product_variant] || testimonial.product_variant;

      card.innerHTML = `
        <div class="testimonial-card__stars">
          ${stars}
        </div>
        <p class="testimonial-card__text">
          "${testimonial.review}"
        </p>
        <div class="testimonial-card__author">
          <div class="testimonial-card__avatar">${initials}</div>
          <div class="testimonial-card__info">
            <h4>${displayName}</h4>
            <p>Pembeli ${variant}</p>
          </div>
        </div>
      `;

      return card;
    },

    /**
     * Generate star HTML based on rating
     */
    generateStars(rating) {
      let stars = '';
      for (let i = 0; i < 5; i++) {
        if (i < rating) {
          stars += '<i class="fi fi-sr-star"></i>';
        } else {
          stars += '<i class="fi fi-rr-star"></i>';
        }
      }
      return stars;
    },

    /**
     * Get initials from name
     */
    getInitials(name) {
      const parts = name.trim().split(' ');
      if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      }
      return parts[0].substring(0, 2).toUpperCase();
    }
  };

  // ============================================
  // PRODUCT MODAL MODULE
  // ============================================
  const ProductModal = {
    modal: null,
    closeBtn: null,
    backdrop: null,
    previousFocus: null,

    // Product data for modal
    products: {
      original: {
        name: 'Original',
        variant: 'Bubuk Jahe Merah Murni',
        image: 'images/original_ginger.png',
        badge: 'Terlaris',
        discount: '-31%',
        price: 'Rp 45.000',
        oldPrice: 'Rp 65.000',
        savings: 'Hemat Rp 20.000',
        rating: 5,
        ratingCount: 128,
        description: 'Jahe merah murni tanpa campuran gula atau bahan tambahan lainnya. Dibuat dari jahe merah pilihan yang diproses dengan teknologi modern untuk mempertahankan khasiat aslinya. Cocok untuk Anda yang menginginkan manfaat maksimal dari jahe merah.',
        features: [
          'Tanpa Gula Tambahan',
          'Khasiat Maksimal',
          '100% Jahe Merah Murni',
          'Cocok untuk Diet',
          'Menghangatkan Tubuh',
          'Meningkatkan Imun'
        ],
        weight: '150g',
        composition: '100% Jahe Merah'
      },
      coconut: {
        name: 'Kelapa Creamy',
        variant: 'Perpaduan Tropis Creamy',
        image: 'images/creamy_coconut_ginger.png',
        badge: 'Rasa Baru',
        discount: '-29%',
        price: 'Rp 50.000',
        oldPrice: 'Rp 70.000',
        savings: 'Hemat Rp 20.000',
        rating: 5,
        ratingCount: 86,
        description: 'Kombinasi sempurna antara jahe merah dengan kelapa dan pandan yang memberikan rasa creamy dan aroma yang menggugah selera. Minuman hangat yang memanjakan lidah sekaligus menyehatkan tubuh.',
        features: [
          'Rasa Creamy Lembut',
          'Aroma Pandan Alami',
          'Kelapa Asli Indonesia',
          'Perpaduan Tropis',
          'Mudah Diseduh',
          'Cocok Segala Usia'
        ],
        weight: '150g',
        composition: 'Jahe Merah, Kelapa, Pandan'
      },
      mango: {
        name: 'Mangga',
        variant: 'Manis & Menyegarkan',
        image: 'images/manggo_ginger.png',
        badge: 'Populer',
        discount: '-29%',
        price: 'Rp 50.000',
        oldPrice: 'Rp 70.000',
        savings: 'Hemat Rp 20.000',
        rating: 5,
        ratingCount: 95,
        description: 'Sensasi segar dari perpaduan jahe merah dengan buah mangga pilihan. Rasa manis alami yang menyegarkan membuat minuman ini cocok dinikmati kapan saja. Tinggi vitamin C untuk menjaga daya tahan tubuh.',
        features: [
          'Segar Buah Mangga',
          'Kaya Vitamin C',
          'Rasa Manis Alami',
          'Menyegarkan',
          'Tanpa Pewarna Buatan',
          'Antioksidan Tinggi'
        ],
        weight: '150g',
        composition: 'Jahe Merah, Mangga'
      },
      milky: {
        name: 'Milky',
        variant: 'Gurih & Creamy Susu',
        image: 'images/milky_ginger.png',
        badge: 'Varian Baru',
        discount: '-29%',
        price: 'Rp 50.000',
        oldPrice: 'Rp 70.000',
        savings: 'Hemat Rp 20.000',
        rating: 5,
        ratingCount: 95,
        description: 'Rasakan tekstur lembut dan rasa gurih perpaduan jahe merah dengan susu berkualitas. Cocok dinikmati saat bersantai dengan rasa yang nyaman di perut. Pas sebagai relaksasi di malam hari.',
        features: [
          'Rasa Gurih',
          'Lembut di Perut',
          'Susu Berkualitas',
          'Tanpa Pengawet',
          'Gampang Larut',
          'Nikmat Diseduh Hangat'
        ],
        weight: '150g',
        composition: 'Jahe Merah, Susu Nabati'
      }
    },

    /**
     * Initialize product modal
     */
    init() {
      this.modal = document.getElementById('productModal');
      this.closeBtn = document.getElementById('modalClose');
      this.backdrop = document.querySelector('.product-modal__backdrop');

      if (!this.modal) return;

      this.bindEvents();
    },

    /**
     * Bind modal events
     */
    bindEvents() {
      // Product card clicks
      const productCards = document.querySelectorAll('.product-card[data-product]');
      productCards.forEach(card => {
        card.addEventListener('click', (e) => {
          // Don't open modal if clicking on CTA button
          if (e.target.closest('.product-card__cta')) return;

          const productId = card.dataset.product;
          this.open(productId);
        });

        // Keyboard support
        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const productId = card.dataset.product;
            this.open(productId);
          }
        });
      });

      // Close button
      if (this.closeBtn) {
        this.closeBtn.addEventListener('click', () => this.close());
      }

      // Backdrop click
      if (this.backdrop) {
        this.backdrop.addEventListener('click', () => this.close());
      }

      // Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.modal.classList.contains('active')) {
          this.close();
        }
      });

      // Share button
      const shareBtn = document.getElementById('modalShareBtn');
      if (shareBtn) {
        shareBtn.addEventListener('click', () => this.share());
      }
    },

    /**
     * Open modal with product data
     */
    open(productId) {
      const product = this.products[productId];
      if (!product) return;

      // Store previous focus
      this.previousFocus = document.activeElement;

      // Populate modal with product data
      this.populateModal(product, productId);

      // Show modal
      this.modal.classList.add('active');
      this.modal.setAttribute('aria-hidden', 'false');

      // Lock body scroll
      document.body.style.overflow = 'hidden';

      // Focus close button
      setTimeout(() => {
        this.closeBtn.focus();
      }, 100);

      // Trap focus inside modal
      this.trapFocus();
    },

    /**
     * Close modal
     */
    close() {
      this.modal.classList.remove('active');
      this.modal.setAttribute('aria-hidden', 'true');

      // Restore body scroll
      document.body.style.overflow = '';

      // Restore focus
      if (this.previousFocus) {
        this.previousFocus.focus();
      }
    },

    /**
     * Populate modal with product data
     */
    populateModal(product, productId) {
      // Image
      const image = document.getElementById('modalImage');
      const thumb = document.getElementById('modalThumb1');
      if (image) {
        image.src = product.image;
        image.alt = product.name;
      }
      if (thumb) {
        thumb.src = product.image;
      }

      // Badge & Discount
      const badge = document.getElementById('modalBadge');
      const discount = document.getElementById('modalDiscount');
      if (badge) badge.textContent = product.badge;
      if (discount) discount.textContent = product.discount;

      // Rating
      const ratingCount = document.querySelector('.product-modal__rating-count');
      if (ratingCount) ratingCount.textContent = `(${product.ratingCount} ulasan)`;

      // Name & Variant
      const name = document.getElementById('modalProductName');
      const variant = document.getElementById('modalVariant');
      if (name) name.textContent = product.name;
      if (variant) variant.textContent = product.variant;

      // Price
      const price = document.getElementById('modalPrice');
      const oldPrice = document.getElementById('modalOldPrice');
      const savings = document.getElementById('modalSavings');
      if (price) price.textContent = product.price;
      if (oldPrice) oldPrice.textContent = product.oldPrice;
      if (savings) savings.textContent = product.savings;

      // Description
      const description = document.getElementById('modalDescription');
      if (description) description.textContent = product.description;

      // Features
      const featuresList = document.getElementById('modalFeatures');
      if (featuresList) {
        featuresList.innerHTML = product.features.map(feat =>
          `<li><i class="fi fi-sr-check-circle"></i> ${feat}</li>`
        ).join('');
      }

      // Info
      const weight = document.getElementById('modalWeight');
      const composition = document.getElementById('modalComposition');
      if (weight) weight.textContent = product.weight;
      if (composition) composition.textContent = product.composition;

      // Order button (WhatsApp)
      const orderBtn = document.getElementById('modalOrderBtn');
      if (orderBtn) {
        const message = encodeURIComponent(`Halo, saya ingin memesan ${product.name} (${product.price})`);
        orderBtn.href = `https://wa.me/6288223917645?text=${message}`;
        orderBtn.target = '_blank';
      }
    },

    /**
     * Share product
     */
    share() {
      const name = document.getElementById('modalProductName');
      const productName = name ? name.textContent : 'Red Root Java';

      if (navigator.share) {
        navigator.share({
          title: productName,
          text: `Check out ${productName} - Premium Red Ginger Powder`,
          url: window.location.href
        }).catch(() => { });
      } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(window.location.href).then(() => {
          alert('Link berhasil disalin!');
        }).catch(() => {
          alert('Gagal menyalin link');
        });
      }
    },

    /**
     * Trap focus inside modal
     */
    trapFocus() {
      const focusableElements = this.modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstFocusable = focusableElements[0];
      const lastFocusable = focusableElements[focusableElements.length - 1];

      this.modal.addEventListener('keydown', (e) => {
        if (e.key !== 'Tab') return;

        if (e.shiftKey) {
          if (document.activeElement === firstFocusable) {
            e.preventDefault();
            lastFocusable.focus();
          }
        } else {
          if (document.activeElement === lastFocusable) {
            e.preventDefault();
            firstFocusable.focus();
          }
        }
      });
    }
  };

  // ============================================
  // PUBLIC API
  // ============================================
  return {
    Navigation,
    SmoothScroll,
    ScrollReveal,
    ButtonEffects,
    CounterAnimation,
    TestimonialSlider,
    FormHandler,
    LazyLoad,
    Accessibility,
    Parallax,
    BackToTop,
    FAQAccordion,
    LoadingOverlay,
    CookieConsent,
    ImageErrorHandler,
    TableUX,
    DynamicTestimonials,
    ProductModal
  };
})();

// Add ripple animation keyframes
const style = document.createElement('style');
style.textContent = `
  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
  
  body.using-mouse *:focus {
    outline: none;
  }
`;
document.head.appendChild(style);

// ============================================
// Initialization is handled internally in App module
// ============================================

  // ============================================
  // SMART CTA MODULE
  // ============================================
  const SmartCTA = {
    init() {
      const ctaButtons = document.querySelectorAll('.smart-cta-btn');
      const waNumber = '6288223917645'; // Default WA Number if not defined globally
      
      ctaButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          let productName = btn.getAttribute('data-product') || 'Red Root Java';
          let price = 'harga yang tertera';

          // Try to find price context if clicked from card
          const card = btn.closest('.product-card');
          if (card) {
            const priceEl = card.querySelector('.product-card__price-current');
            if (priceEl) price = priceEl.textContent.trim();
          } else {
            // From modal
            const titleEl = document.getElementById('modalProductName');
            const modalPrice = document.getElementById('modalPrice');
            if (titleEl) productName = titleEl.textContent;
            if (modalPrice) price = modalPrice.textContent;
          }

          const message = `Halo, saya ingin pesan ${productName} ukuran 150g dengan harga ${price}. Apakah stoknya tersedia?`;
          const url = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
          
          window.open(url, '_blank', 'noopener,noreferrer');
        });
      });
    }
  };
  
  // Init SmartCTA when DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    SmartCTA.init();
  });
