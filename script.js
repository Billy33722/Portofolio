// Portfolio JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initializeApp();
});

function initializeApp() {
    // Set up event listeners
    setupMobileMenu();
    setupThemeToggle();
    setupSmoothScrolling();
    setupProjectImageLinks();
    setupScrollSpy();
    setupCarousel();
    setupFormHandling();
    setupYearDisplay();
    setupScrollAnimations();
    setupAboutCounters();
}

// Mobile menu functionality
function setupMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.getElementById('mainNav');
    
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function() {
            const isExpanded = mainNav.getAttribute('aria-expanded') === 'true';
            mainNav.setAttribute('aria-expanded', !isExpanded);
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            
            // Close menu when clicking on a link
            const navLinks = mainNav.querySelectorAll('a');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    mainNav.setAttribute('aria-expanded', 'false');
                    menuToggle.setAttribute('aria-expanded', 'false');
                });
            });
        });
    }
}

// Make project images clickable using the same destination as the card link
function setupProjectImageLinks() {
    const wrappers = document.querySelectorAll('.projects .card .image-wrapper');
    wrappers.forEach(wrapper => {
        const card = wrapper.closest('.card');
        const link = card ? card.querySelector('.link') : null;
        if (!link) return;

        wrapper.addEventListener('click', () => {
            const href = link.getAttribute('href');
            const target = link.getAttribute('target');
            if (!href || href === '#') return;
            if (target === '_blank') {
                window.open(href, '_blank', 'noopener');
            } else {
                window.location.href = href;
            }
        });

        // Accessibility: focusable and keyboard-activatable
        wrapper.setAttribute('tabindex', '0');
        wrapper.setAttribute('role', 'link');
        wrapper.setAttribute('aria-label', link.textContent || 'Open project');
        wrapper.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                wrapper.click();
            }
        });
    });
}

// Highlight active nav link based on scroll position
function setupScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    const header = document.querySelector('.site-header');
    const headerHeight = header ? header.offsetHeight : 0;

    if (!sections.length || !navLinks.length) return;

    // Helper to clear and set active link
    const setActiveLink = (id) => {
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            const isActive = href === `#${id}`;
            link.classList.toggle('active', isActive);
        });
    };

    // Observe sections as they enter the viewport
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setActiveLink(entry.target.id);
            }
        });
    }, {
        root: null,
        threshold: 0.6,
        rootMargin: `-${Math.max(headerHeight - 10, 0)}px 0px 0px 0px`
    });

    sections.forEach(section => observer.observe(section));

    // Ensure active link updates on scroll end (fallback)
    window.addEventListener('scroll', debounce(() => {
        let currentId = sections[0].id;
        const scrollPos = window.scrollY + headerHeight + 20;
        sections.forEach(section => {
            if (scrollPos >= section.offsetTop) {
                currentId = section.id;
            }
        });
        setActiveLink(currentId);
    }, 100));

    // Also update when clicking nav links (instant feedback)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const targetId = link.getAttribute('href').replace('#', '');
            setActiveLink(targetId);
        });
    });
}

// Theme toggle functionality
function setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme') || 'light';
    body.setAttribute('data-theme', savedTheme);
    
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = body.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            body.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Add a subtle animation effect
            body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
            setTimeout(() => {
                body.style.transition = '';
            }, 300);
        });
    }
}

// Smooth scrolling for navigation links
function setupSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.site-header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Form handling
function setupFormHandling() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');
            
            // Basic validation
            if (!name || !email || !message) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            // Simulate form submission
            showNotification('Thank you for your message! I will get back to you soon.', 'success');
            this.reset();
        });
    }
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 6px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    // Set background color based on type
    const colors = {
        success: '#28a745',
        error: '#dc3545',
        info: '#17a2b8'
    };
    notification.style.backgroundColor = colors[type] || colors.info;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 5000);
}

// Set current year in footer
function setupYearDisplay() {
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// Scroll animations
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.card, .section h2, .hero h1, .hero p, .about-photo, .about .stat');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Carousel functionality
function setupCarousel() {
    const track = document.getElementById('carouselTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dotsContainer = document.getElementById('carouselDots');
    const viewAllBtn = document.getElementById('viewAllBtn');
    
    if (!track || !prevBtn || !nextBtn) return;

    const cards = track.querySelectorAll('.card');
    const totalCards = cards.length;
    const cardsPerView = window.innerWidth <= 768 ? 1 : 3;
    let currentIndex = 0;
    let isViewAll = false;

    // Create dots
    function createDots() {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = '';
        const totalDots = Math.ceil(totalCards / cardsPerView);
        
        for (let i = 0; i < totalDots; i++) {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot';
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }

    // Update carousel position
    function updateCarousel() {
        if (isViewAll) {
            track.style.transform = 'translateX(0)';
            track.style.flexWrap = 'wrap';
            track.style.justifyContent = 'center';
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
            dotsContainer.style.display = 'none';
        } else {
            const cardWidth = cards[0].offsetWidth + 32; // 32px gap
            const translateX = -currentIndex * cardWidth * cardsPerView;
            track.style.transform = `translateX(${translateX}px)`;
            track.style.flexWrap = 'nowrap';
            track.style.justifyContent = 'flex-start';
            prevBtn.style.display = 'flex';
            nextBtn.style.display = 'flex';
            dotsContainer.style.display = 'flex';
        }
    }

    // Go to specific slide
    function goToSlide(index) {
        const maxIndex = Math.ceil(totalCards / cardsPerView) - 1;
        currentIndex = Math.max(0, Math.min(index, maxIndex));
        updateCarousel();
        updateDots();
    }

    // Update dots
    function updateDots() {
        const dots = dotsContainer.querySelectorAll('.carousel-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    // Next slide
    function nextSlide() {
        const maxIndex = Math.ceil(totalCards / cardsPerView) - 1;
        if (currentIndex < maxIndex) {
            currentIndex++;
        } else {
            currentIndex = 0; // Loop back to start
        }
        updateCarousel();
        updateDots();
    }

    // Previous slide
    function prevSlide() {
        const maxIndex = Math.ceil(totalCards / cardsPerView) - 1;
        if (currentIndex > 0) {
            currentIndex--;
        } else {
            currentIndex = maxIndex; // Loop to end
        }
        updateCarousel();
        updateDots();
    }

    // Toggle view all
    function toggleViewAll() {
        isViewAll = !isViewAll;
        viewAllBtn.textContent = isViewAll ? 'Show Less' : 'View All';
        updateCarousel();
    }

    // Event listeners
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
    viewAllBtn.addEventListener('click', toggleViewAll);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
    });

    // Touch/swipe support
    let startX = 0;
    let isDragging = false;

    track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
    });

    track.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
    });

    track.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        isDragging = false;
        
        const endX = e.changedTouches[0].clientX;
        const diff = startX - endX;
        
        if (Math.abs(diff) > 50) { // Minimum swipe distance
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    });

    // Initialize
    createDots();
    updateCarousel();

    // Handle resize
    window.addEventListener('resize', () => {
        createDots();
        updateCarousel();
    });
}

// Animated counters in About section
function setupAboutCounters() {
    const counters = document.querySelectorAll('#about .num');
    if (!counters.length) return;

    const durationMs = 1200;

    const startCounting = (entry) => {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'), 10) || 0;
        const startTime = performance.now();

        const step = (now) => {
            const progress = Math.min((now - startTime) / durationMs, 1);
            const value = Math.floor(progress * target);
            el.textContent = value;
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startCounting(entry);
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.6 });

    counters.forEach(c => observer.observe(c));
}

// Utility function to debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add scroll effect to header
window.addEventListener('scroll', debounce(() => {
    const header = document.querySelector('.site-header');
    if (window.scrollY > 100) {
        header.style.backgroundColor = 'rgba(var(--bg-primary-rgb), 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.backgroundColor = '';
        header.style.backdropFilter = '';
    }
}, 10));

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    // Close mobile menu with Escape key
    if (e.key === 'Escape') {
        const mainNav = document.getElementById('mainNav');
        const menuToggle = document.getElementById('menuToggle');
        
        if (mainNav && mainNav.getAttribute('aria-expanded') === 'true') {
            mainNav.setAttribute('aria-expanded', 'false');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    }
});

// Add click outside to close mobile menu
document.addEventListener('click', (e) => {
    const mainNav = document.getElementById('mainNav');
    const menuToggle = document.getElementById('menuToggle');
    
    if (mainNav && mainNav.getAttribute('aria-expanded') === 'true') {
        if (!mainNav.contains(e.target) && !menuToggle.contains(e.target)) {
            mainNav.setAttribute('aria-expanded', 'false');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    }
});

// Console welcome message
console.log('%c👋 Hello! Welcome to my portfolio!', 'color: #007bff; font-size: 16px; font-weight: bold;');
console.log('%cThis site is built with HTML, CSS and JavaScript.', 'color: #6c757d; font-size: 14px;');
