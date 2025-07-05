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

    // Form Handling with EmailJS Integration
    const formHandler = {
        // EmailJS Configuration - Replace with your actual IDs
        emailjsConfig: {
            serviceID: 'service_qxakg66',      // Replace with your EmailJS service ID
            templateID: 'template_2p9h7el',    // Replace with your EmailJS template ID
            publicKey: 'WL28eYqeWtZxyI3dr'       // Replace with your EmailJS public key
        },

        init: () => {
            if (elements.contactForm) {
                // Initialize EmailJS
                if (typeof emailjs !== 'undefined') {
                    emailjs.init(formHandler.emailjsConfig.publicKey);
                }
                
                elements.contactForm.addEventListener('submit', formHandler.handleSubmit);
            }
        },

        handleSubmit: async (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(elements.contactForm);
            const data = Object.fromEntries(formData.entries());
            
            // Basic validation
            if (formHandler.validateForm(data)) {
                await formHandler.submitForm(data);
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
            
            if (message.trim().length < 10) {
                formHandler.showMessage('Please provide a more detailed message (at least 10 characters).', 'error');
                return false;
            }
            
            return true;
        },

        isValidEmail: (email) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        },

        submitForm: async (data) => {
            const submitButton = elements.contactForm.querySelector('.form-submit');
            const originalText = submitButton.textContent;
            
            try {
                // Show loading state
                formHandler.setLoadingState(submitButton, true);
                
                // Check if EmailJS is configured
                if (!formHandler.isEmailJSConfigured()) {
                    throw new Error('Email service not configured. Please check EmailJS setup.');
                }

                // Prepare template parameters for EmailJS
                const templateParams = {
                    from_name: data.name,
                    from_email: data.email,
                    subject: data.subject,
                    message: data.message,
                    to_name: 'Peter Joshua Brion',  // Your name
                    reply_to: data.email
                };

                // Send email using EmailJS
                const response = await emailjs.send(
                    formHandler.emailjsConfig.serviceID,
                    formHandler.emailjsConfig.templateID,
                    templateParams
                );

                if (response.status === 200) {
                    formHandler.showMessage(
                        'Thank you for your message! I\'ll get back to you within 24 hours.', 
                        'success'
                    );
                    elements.contactForm.reset();
                    
                    // Optional: Track form submission (for analytics)
                    formHandler.trackFormSubmission();
                } else {
                    throw new Error('Failed to send message');
                }

            } catch (error) {
                console.error('Form submission error:', error);
                
                let errorMessage = 'Sorry, there was an error sending your message. ';
                
                if (error.message.includes('not configured')) {
                    errorMessage += 'Please try contacting me directly at peterjoshua.brion@gmail.com';
                } else if (error.message.includes('network') || error.message.includes('fetch')) {
                    errorMessage += 'Please check your internet connection and try again.';
                } else {
                    errorMessage += 'Please try again later or contact me directly at peterjoshua.brion@gmail.com';
                }
                
                formHandler.showMessage(errorMessage, 'error');
            } finally {
                // Reset loading state
                formHandler.setLoadingState(submitButton, false, originalText);
            }
        },

        isEmailJSConfigured: () => {
            const { serviceID, templateID, publicKey } = formHandler.emailjsConfig;
            return serviceID === 'service_qxakg66' && 
                   templateID === 'template_2p9h7el' && 
                   publicKey === 'WL28eYqeWtZxyI3dr' &&
                   typeof emailjs !== 'undefined';
        },

        setLoadingState: (button, isLoading, originalText = 'Send Message') => {
            if (isLoading) {
                button.disabled = true;
                button.innerHTML = `
                    <span style="display: inline-flex; align-items: center; gap: 0.5rem;">
                        <span style="width: 16px; height: 16px; border: 2px solid #ffffff; border-top: 2px solid transparent; border-radius: 50%; animation: spin 1s linear infinite;"></span>
                        Sending...
                    </span>
                `;
            } else {
                button.disabled = false;
                button.textContent = originalText;
            }
        },

        trackFormSubmission: () => {
            // Optional: Add analytics tracking
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_submit', {
                    event_category: 'contact',
                    event_label: 'portfolio_contact_form'
                });
            }
        },

        showMessage: (message, type) => {
            // Remove any existing messages
            const existingMessages = document.querySelectorAll('.form-message');
            existingMessages.forEach(msg => msg.remove());

            // Create and show message
            const messageEl = document.createElement('div');
            messageEl.className = 'form-message';
            messageEl.textContent = message;
            
            const isSuccess = type === 'success';
            messageEl.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                max-width: 400px;
                padding: 1rem 1.5rem;
                border-radius: 0.75rem;
                color: white;
                font-weight: 500;
                z-index: 10000;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
                animation: slideInMessage 0.4s ease;
                line-height: 1.5;
                ${isSuccess ? 
                    'background: linear-gradient(135deg, #059669, #10b981);' : 
                    'background: linear-gradient(135deg, #dc2626, #ef4444);'
                }
            `;
            
            document.body.appendChild(messageEl);
            
            // Auto-remove message after 6 seconds
            setTimeout(() => {
                messageEl.style.animation = 'slideOutMessage 0.4s ease';
                setTimeout(() => {
                    if (document.body.contains(messageEl)) {
                        document.body.removeChild(messageEl);
                    }
                }, 400);
            }, 6000);

            // Allow manual close by clicking
            messageEl.addEventListener('click', () => {
                messageEl.style.animation = 'slideOutMessage 0.4s ease';
                setTimeout(() => {
                    if (document.body.contains(messageEl)) {
                        document.body.removeChild(messageEl);
                    }
                }, 400);
            });
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
        @keyframes slideInMessage {
            from { 
                transform: translateX(100%) translateY(-20px); 
                opacity: 0; 
                scale: 0.9;
            }
            to { 
                transform: translateX(0) translateY(0); 
                opacity: 1; 
                scale: 1;
            }
        }
        
        @keyframes slideOutMessage {
            from { 
                transform: translateX(0) translateY(0); 
                opacity: 1; 
                scale: 1;
            }
            to { 
                transform: translateX(100%) translateY(-20px); 
                opacity: 0; 
                scale: 0.9;
            }
        }

        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        .form-message {
            cursor: pointer;
            user-select: none;
        }

        .form-message:hover {
            transform: scale(1.02);
            transition: transform 0.2s ease;
        }
    `;
    document.head.appendChild(style);

})();