// Professional Portfolio JavaScript
// Optimized for performance and accessibility

(function() {
    'use strict';

    // DOM Elements
    const elements = {
        mobileMenuBtn: document.getElementById('mobile-menu-btn'),
        mobileMenu: document.getElementById('mobile-menu'),
        navbar: document.getElementById('navbar'),
        progressBar: document.getElementById('progress-bar'),
        contactForm: document.getElementById('contact-form'),
        navLinks: document.querySelectorAll('.nav-link'),
        sections: document.querySelectorAll('section[id]')
    };

    // Utility Functions
    const utils = {
        // Throttle function for performance optimization
        throttle: (func, limit) => {
            let inThrottle;
            return function() {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            }
        },

        // Smooth scroll with offset for fixed header
        smoothScrollTo: (target) => {
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        },

        // Check if element is in viewport
        isInViewport: (element) => {
            const rect = element.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        }
    };

    // Mobile Menu Functionality
    const mobileMenu = {
        init: () => {
            if (elements.mobileMenuBtn && elements.mobileMenu) {
                elements.mobileMenuBtn.addEventListener('click', mobileMenu.toggle);
                
                // Close menu when clicking on links
                elements.mobileMenu.addEventListener('click', (e) => {
                    if (e.target.tagName === 'A') {
                        mobileMenu.close();
                    }
                });

                // Close menu when clicking outside
                document.addEventListener('click', (e) => {
                    if (!elements.mobileMenu.contains(e.target) && 
                        !elements.mobileMenuBtn.contains(e.target) &&
                        elements.mobileMenu.classList.contains('active')) {
                        mobileMenu.close();
                    }
                });
            }
        },

        toggle: () => {
            elements.mobileMenu.classList.toggle('active');
            elements.mobileMenuBtn.setAttribute('aria-expanded', 
                elements.mobileMenu.classList.contains('active'));
        },

        close: () => {
            elements.mobileMenu.classList.remove('active');
            elements.mobileMenuBtn.setAttribute('aria-expanded', 'false');
        }
    };

    // Navigation Functionality
    const navigation = {
        init: () => {
            // Add click handlers for smooth scrolling
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', navigation.handleNavClick);
            });

            // Update active navigation on scroll
            window.addEventListener('scroll', utils.throttle(navigation.updateActiveNav, 100));
        },

        handleNavClick: function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                utils.smoothScrollTo(target);
                mobileMenu.close();
            }
        },

        updateActiveNav: () => {
            let current = '';
            
            elements.sections.forEach(section => {
                const sectionTop = section.getBoundingClientRect().top;
                const sectionHeight = section.clientHeight;
                
                if (sectionTop <= 100 && sectionTop + sectionHeight > 100) {
                    current = section.getAttribute('id');
                }
            });

            // Update active navigation links
            elements.navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        }
    };

    // Scroll Effects
    const scrollEffects = {
        init: () => {
            window.addEventListener('scroll', utils.throttle(scrollEffects.handleScroll, 16));
        },

        handleScroll: () => {
            scrollEffects.updateProgressBar();
            scrollEffects.updateNavbar();
        },

        updateProgressBar: () => {
            if (elements.progressBar) {
                const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
                const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                const scrolled = (winScroll / height) * 100;
                elements.progressBar.style.width = Math.min(scrolled, 100) + "%";
            }
        },

        updateNavbar: () => {
            if (elements.navbar) {
                const scrolled = window.pageYOffset > 50;
                elements.navbar.classList.toggle('scrolled', scrolled);
            }
        }
    };

    // Form Handling
    const formHandler = {
        init: () => {
            if (elements.contactForm) {
                elements.contactForm.addEventListener('submit', formHandler.handleSubmit);
            }
        },

        handleSubmit: (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(elements.contactForm);
            const data = Object.fromEntries(formData.entries());
            
            // Basic validation
            if (formHandler.validateForm(data)) {
                formHandler.submitForm(data);
            }
        },

        validateForm: (data) => {
            const { name, email, subject, message } = data;
            
            if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
                formHandler.showMessage('Please fill in all fields.', 'error');
                return false;
            }
            
            if (!formHandler.isValidEmail(email)) {
                formHandler.showMessage('Please enter a valid email address.', 'error');
                return false;
            }
            
            return true;
        },

        isValidEmail: (email) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        },

        submitForm: (data) => {
            // Simulate form submission (replace with actual implementation)
            formHandler.showMessage('Thank you for your message! I\'ll get back to you soon.', 'success');
            elements.contactForm.reset();
            
            // You can implement actual form submission here
            // For example, using fetch() to send to a backend API
        },

        showMessage: (message, type) => {
            // Create and show message
            const messageEl = document.createElement('div');
            messageEl.textContent = message;
            messageEl.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 1rem 1.5rem;
                border-radius: 0.5rem;
                color: white;
                font-weight: 500;
                z-index: 10000;
                animation: slideIn 0.3s ease;
                ${type === 'success' ? 'background: #059669;' : 'background: #dc2626;'}
            `;
            
            document.body.appendChild(messageEl);
            
            // Remove message after 5 seconds
            setTimeout(() => {
                messageEl.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => document.body.removeChild(messageEl), 300);
            }, 5000);
        }
    };

    // Animations and Visual Effects
    const animations = {
        init: () => {
            animations.setupIntersectionObserver();
            animations.animateProgressBars();
        },

        setupIntersectionObserver: () => {
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-fade-in');
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, observerOptions);

            // Observe elements for animation
            const animatedElements = document.querySelectorAll(`
                .skill-card, 
                .project-card, 
                .experience-content,
                .about-text,
                .certifications,
                .skills-progress
            `);

            animatedElements.forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                observer.observe(el);
            });
        },

        animateProgressBars: () => {
            const progressBars = document.querySelectorAll('.progress-fill');
            
            const progressObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const progressBar = entry.target;
                        const targetWidth = progressBar.style.width;
                        
                        // Animate from 0 to target width
                        progressBar.style.width = '0%';
                        setTimeout(() => {
                            progressBar.style.width = targetWidth;
                        }, 500);
                        
                        progressObserver.unobserve(progressBar);
                    }
                });
            });

            progressBars.forEach(bar => {
                progressObserver.observe(bar);
            });
        }
    };

    // Performance Optimizations
    const performance = {
        init: () => {
            performance.lazyLoadImages();
            performance.preloadCriticalResources();
        },

        lazyLoadImages: () => {
            const images = document.querySelectorAll('img[data-src]');
            
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        },

        preloadCriticalResources: () => {
            // Preload Google Fonts if not already loaded
            if (!document.querySelector('link[href*="fonts.googleapis.com"]')) {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.as = 'style';
                link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
                document.head.appendChild(link);
            }
        }
    };

    // Accessibility Enhancements
    const accessibility = {
        init: () => {
            accessibility.setupKeyboardNavigation();
            accessibility.setupSkipLinks();
            accessibility.respectReducedMotion();
        },

        setupKeyboardNavigation: () => {
            // Focus management for mobile menu
            elements.mobileMenuBtn?.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    mobileMenu.toggle();
                }
            });
        },

        setupSkipLinks: () => {
            // Add skip to main content link
            const skipLink = document.createElement('a');
            skipLink.href = '#main';
            skipLink.textContent = 'Skip to main content';
            skipLink.style.cssText = `
                position: absolute;
                top: -40px;
                left: 6px;
                background: var(--primary-blue);
                color: white;
                padding: 8px;
                text-decoration: none;
                border-radius: 0 0 4px 4px;
                z-index: 10000;
                transition: top 0.3s;
            `;
            
            skipLink.addEventListener('focus', () => {
                skipLink.style.top = '0';
            });
            
            skipLink.addEventListener('blur', () => {
                skipLink.style.top = '-40px';
            });
            
            document.body.insertBefore(skipLink, document.body.firstChild);
        },

        respectReducedMotion: () => {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                // Disable animations for users who prefer reduced motion
                const style = document.createElement('style');
                style.textContent = `
                    *, *::before, *::after {
                        animation-duration: 0.01ms !important;
                        animation-iteration-count: 1 !important;
                        transition-duration: 0.01ms !important;
                    }
                `;
                document.head.appendChild(style);
            }
        }
    };

    // Initialize everything when DOM is ready
    const init = () => {
        // Core functionality
        mobileMenu.init();
        navigation.init();
        scrollEffects.init();
        formHandler.init();
        
        // Visual enhancements
        animations.init();
        
        // Performance and accessibility
        performance.init();
        accessibility.init();
        
        console.log('Professional portfolio initialized successfully!');
    };

    // Start initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);

})();