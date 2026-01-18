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
     * Initialize navigation functionality
     */
    init() {
      DOM.header = document.querySelector('.header');
      DOM.nav = document.querySelector('.nav');
      DOM.menuToggle = document.querySelector('.menu-toggle');
      DOM.navLinks = document.querySelectorAll('.nav__link');

      this.bindEvents();
      this.checkScroll();
    },

    /**
     * Bind navigation events
     */
    bindEvents() {
      // Menu toggle for mobile
      if (DOM.menuToggle) {
        DOM.menuToggle.addEventListener('click', () => this.toggleMenu());
      }

      // Close menu when clicking nav links
      DOM.navLinks.forEach(link => {
        link.addEventListener('click', () => {
          if (state.isMenuOpen) {
            this.closeMenu();
          }
        });
      });

      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (state.isMenuOpen && 
            !DOM.nav.contains(e.target) && 
            !DOM.menuToggle.contains(e.target)) {
          this.closeMenu();
        }
      });

      // Header scroll effect
      window.addEventListener('scroll', throttle(() => {
        this.checkScroll();
        this.updateActiveLink();
      }, 10));

      // Close menu on escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && state.isMenuOpen) {
          this.closeMenu();
        }
      });
    },

    /**
     * Toggle mobile menu
     */
    toggleMenu() {
      state.isMenuOpen = !state.isMenuOpen;
      toggleClass(DOM.menuToggle, 'menu-toggle--active');
      toggleClass(DOM.nav, 'nav--open');
      toggleClass(document.body, 'no-scroll');
      
      // Update ARIA attributes
      DOM.menuToggle.setAttribute('aria-expanded', state.isMenuOpen);
    },

    /**
     * Close mobile menu
     */
    closeMenu() {
      state.isMenuOpen = false;
      removeClass(DOM.menuToggle, 'menu-toggle--active');
      removeClass(DOM.nav, 'nav--open');
      removeClass(document.body, 'no-scroll');
      DOM.menuToggle.setAttribute('aria-expanded', 'false');
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
    },

    /**
     * Update active nav link based on scroll position
     */
    updateActiveLink() {
      const sections = document.querySelectorAll('section[id]');
      const headerHeight = DOM.header ? DOM.header.offsetHeight : 80;
      const scrollY = window.scrollY + headerHeight + 20;

      let activeSection = null;

      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        const sectionId = section.getAttribute('id');

        // Check if section is in the viewport
        if (scrollY >= sectionTop && scrollY < sectionBottom) {
          activeSection = sectionId;
        }
      });

      // Update nav links
      DOM.navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === `#${activeSection}`) {
          addClass(link, 'nav__link--active');
        } else {
          removeClass(link, 'nav__link--active');
        }
      });
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
      
      this.checkElements();
      this.bindEvents();
    },

    /**
     * Bind scroll events for reveal
     */
    bindEvents() {
      window.addEventListener('scroll', throttle(() => this.checkElements(), 16));
      window.addEventListener('resize', debounce(() => this.checkElements(), 100));
    },

    /**
     * Check all reveal elements
     */
    checkElements() {
      DOM.revealElements.forEach(element => {
        if (isInViewport(element, CONFIG.revealOffset)) {
          addClass(element, 'reveal--visible');
        }
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
      button.addEventListener('click', function(e) {
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
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;

      const update = () => {
        current += step;
        if (current < target) {
          element.textContent = Math.floor(current);
          requestAnimationFrame(update);
        } else {
          element.textContent = target;
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
    BackToTop.init();
    FAQAccordion.init();
    LoadingOverlay.init();
    CookieConsent.init();
    ImageErrorHandler.init();

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
    ImageErrorHandler
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
