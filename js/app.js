/**
 * Камышинский опытный завод - Main Application Script
 * Handles navigation, modals, language switching, and form submissions
 */

(function() {
  'use strict';

  // State
  let currentLang = 'ru';
  let lastScroll = 0;

  /**
   * Initialize application when DOM is ready
   */
  function init() {
    setCurrentYear();
    setupModalListeners();
    setupScrollListener();
    setupFormListeners();
    setupEventDelegation();
  }

  /**
   * Set current year in footer
   */
  function setCurrentYear() {
    const yearEl = document.getElementById('currentYear');
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  }

  /**
   * Language switching functionality
   */
  window.switchLang = function(lang) {
    currentLang = lang;
    const ruBtn = document.getElementById('lang-ru');
    const enBtn = document.getElementById('lang-en');

    if (!ruBtn || !enBtn) return;

    if (lang === 'ru') {
      ruBtn.style.background = '#1E5799';
      ruBtn.style.color = '#fff';
      enBtn.style.background = 'transparent';
      enBtn.style.color = '#475569';
      document.documentElement.lang = 'ru';
    } else {
      enBtn.style.background = '#1E5799';
      enBtn.style.color = '#fff';
      ruBtn.style.background = 'transparent';
      ruBtn.style.color = '#475569';
      document.documentElement.lang = 'en';
    }

    // Update all translatable elements
    document.querySelectorAll('[data-' + lang + ']').forEach(function(el) {
      const text = el.getAttribute('data-' + lang);
      if (text) el.textContent = text;
    });
  };

  /**
   * Page navigation with smooth transitions
   */
  window.showPage = function(pageId) {
    const pages = document.querySelectorAll('.section-page');
    pages.forEach(function(p) {
      p.classList.remove('active');
      p.classList.remove('page-transition');
    });

    const target = document.getElementById('page-' + pageId);
    if (target) {
      target.classList.add('active');
      // Force reflow for animation restart
      void target.offsetWidth;
      target.classList.add('page-transition');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * Toggle hamburger menu
   */
  window.toggleMenu = function() {
    const nav = document.getElementById('sideNav');
    const overlay = document.getElementById('navOverlay');
    const btn = document.getElementById('hamburgerBtn');
    
    if (nav) nav.classList.toggle('open');
    if (overlay) overlay.classList.toggle('show');
    if (btn) btn.classList.toggle('active');
  };

  /**
   * Modal management
   */
  window.openModal = function(id) {
    const modal = document.getElementById(id);
    if (modal) {
      modal.classList.add('show');
      document.body.style.overflow = 'hidden';
    }
  };

  window.closeModal = function(id) {
    const modal = document.getElementById(id);
    if (modal) {
      modal.classList.remove('show');
      document.body.style.overflow = '';
    }
  };

  /**
   * Setup modal click-outside-to-close listeners
   */
  function setupModalListeners() {
    document.querySelectorAll('.modal-overlay').forEach(function(overlay) {
      overlay.addEventListener('click', function(e) {
        if (e.target === this) {
          this.classList.remove('show');
          document.body.style.overflow = '';
        }
      });
    });
  }

  /**
   * Cabinet tabs switching
   */
  window.switchCabinetTab = function(tab) {
    const loginTab = document.getElementById('tab-login');
    const registerTab = document.getElementById('tab-register');
    const loginContent = document.getElementById('cabinet-login');
    const registerContent = document.getElementById('cabinet-register');

    if (loginTab) loginTab.classList.toggle('active', tab === 'login');
    if (registerTab) registerTab.classList.toggle('active', tab === 'register');
    if (loginContent) loginContent.classList.toggle('active', tab === 'login');
    if (registerContent) registerContent.classList.toggle('active', tab === 'register');
  };

  /**
   * Form submission handlers
   */
  window.submitForm = function(e, type) {
    e.preventDefault();
    showSuccessToast();
    if (e.target) e.target.reset();
  };

  window.submitQuestionnaire = function(e, type) {
    e.preventDefault();
    const modalId = 'questionnaire-' + (
      type === 'ns' ? '1' : 
      type === 'sep' ? '2' : 
      type === 'te' ? '3' : 
      type === 'tank' ? '4' : 
      type === 'otu' ? '5' : '6'
    );
    closeModal(modalId);
    showSuccessToast();
    if (e.target) e.target.reset();
  };

  window.submitHR = function(e) {
    e.preventDefault();
    closeModal('hr-apply-modal');
    showSuccessToast();
    if (e.target) e.target.reset();
  };

  window.handleLogin = function(e) {
    e.preventDefault();
    showSuccessToast();
  };

  window.handleRegister = function(e) {
    e.preventDefault();
    showSuccessToast();
  };

  /**
   * Show success toast notification
   */
  function showSuccessToast() {
    const toast = document.getElementById('success-toast');
    if (toast) {
      toast.style.display = 'block';
      setTimeout(function() {
        toast.style.display = 'none';
      }, 4000);
    }
  }

  /**
   * Setup form event listeners
   */
  function setupFormListeners() {
    // Add any additional form validation here
  }

  /**
   * Setup event delegation for data-action attributes
   * This replaces inline onclick handlers for better security
   */
  function setupEventDelegation() {
    document.addEventListener('click', function(e) {
      const target = e.target.closest('[data-action]');
      if (!target) return;

      const action = target.getAttribute('data-action');
      
      switch(action) {
        case 'showPage':
          e.preventDefault();
          const page = target.getAttribute('data-page');
          if (page) showPage(page);
          if (target.getAttribute('data-close-menu') === 'true') toggleMenu();
          break;
          
        case 'switchLang':
          e.preventDefault();
          const lang = target.getAttribute('data-lang');
          if (lang) switchLang(lang);
          break;
          
        case 'openModal':
          e.preventDefault();
          const modalId = target.getAttribute('data-modal');
          if (modalId) openModal(modalId);
          break;
          
        case 'closeModal':
          e.preventDefault();
          const closeId = target.getAttribute('data-modal');
          if (closeId) closeModal(closeId);
          break;
          
        case 'toggleMenu':
          e.preventDefault();
          toggleMenu();
          break;
          
        case 'switchCabinetTab':
          e.preventDefault();
          const tab = target.getAttribute('data-tab');
          if (tab) switchCabinetTab(tab);
          break;
          
        case 'expandCard':
          e.preventDefault();
          const card = target.closest('.vacancy-card');
          if (card) card.classList.toggle('expanded');
          break;
          
        case 'submitForm':
          e.preventDefault();
          const formType = target.getAttribute('data-form-type');
          if (formType && window['submit' + formType.charAt(0).toUpperCase() + formType.slice(1)]) {
            window['submit' + formType.charAt(0).toUpperCase() + formType.slice(1)]({ target: target.closest('form'), preventDefault: function(){} });
          }
          break;
      }
    });

    // Handle image onerror with data attribute
    document.querySelectorAll('img[data-onerror]').forEach(function(img) {
      img.addEventListener('error', function() {
        const handler = img.getAttribute('data-onerror');
        if (handler === 'hide') {
          img.style.display = 'none';
        }
      });
    });

    // Handle hover effects via CSS class
    document.querySelectorAll('.hover-effect').forEach(function(el) {
      el.addEventListener('mouseenter', function() {
        el.style.transform = 'translateY(-2px)';
        el.style.boxShadow = '0 8px 25px rgba(30,87,153,0.4)';
      });
      el.addEventListener('mouseleave', function() {
        el.style.transform = '';
        el.style.boxShadow = '0 4px 15px rgba(30,87,153,0.3)';
      });
    });
  }

  /**
   * Header scroll effect
   */
  function setupScrollListener() {
    window.addEventListener('scroll', function() {
      const header = document.getElementById('main-header');
      if (!header) return;

      const scrollY = window.scrollY;
      if (scrollY > 50) {
        header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
      } else {
        header.style.boxShadow = 'none';
      }
      lastScroll = scrollY;
    });
  }

  /**
   * Error handler for uncaught errors
   */
  window.onerror = function(message, source, lineno, colno, error) {
    console.error('Application error:', message, 'at', source + ':' + lineno);
    // In production, you might want to send this to an error tracking service
    return false;
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
