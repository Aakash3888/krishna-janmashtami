/* ============================================
   D.k Dovloper - Premium Mobile App JS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ============ PRELOADER ============
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
        preloader.classList.add('hidden');
        initApp();
    }, 2800);

    // ============ INIT APP ============
    function initApp() {
        createParticles();
        initNavigation();
        initDrawer();
        initTheme();
        initCarousel();
        initProductFilter();
        initForms();
        initStatsAnimation();
        initScrollReveal();
    }

    // ============ HERO PARTICLES ============
    function createParticles() {
        const container = document.getElementById('heroParticles');
        if (!container) return;
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'hero-particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDuration = (Math.random() * 10 + 8) + 's';
            particle.style.animationDelay = (Math.random() * 10) + 's';
            particle.style.width = particle.style.height = (Math.random() * 3 + 1) + 'px';
            const colors = ['#667eea', '#764ba2', '#f093fb', '#00d2ff'];
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            container.appendChild(particle);
        }
    }

    // ============ NAVIGATION ============
    function initNavigation() {
        const tabs = document.querySelectorAll('.tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                navigateTo(tab.dataset.page);
            });
        });

        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                navigateTo(item.dataset.page);
                closeDrawer();
            });
        });
    }

    // ============ GLOBAL NAVIGATE ============
    window.navigateTo = function(page) {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        const target = document.getElementById('page-' + page);
        if (target) target.classList.add('active');

        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll(`.tab[data-page="${page}"]`).forEach(t => t.classList.add('active'));

        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        document.querySelectorAll(`.nav-item[data-page="${page}"]`).forEach(n => n.classList.add('active'));

        window.scrollTo({ top: 0, behavior: 'smooth' });

        if (page === 'home') {
            setTimeout(initStatsAnimation, 300);
        }

        initScrollReveal();
    };

    // ============ DRAWER ============
    function initDrawer() {
        const drawer = document.getElementById('navDrawer');
        const menuToggle = document.getElementById('menuToggle');
        const navClose = document.getElementById('navClose');
        const navBackdrop = document.getElementById('navBackdrop');

        menuToggle.addEventListener('click', openDrawer);
        navClose.addEventListener('click', closeDrawer);
        navBackdrop.addEventListener('click', closeDrawer);
    }

    function openDrawer() {
        document.getElementById('navDrawer').classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    window.closeDrawer = function() {
        document.getElementById('navDrawer').classList.remove('open');
        document.body.style.overflow = '';
    };

    // ============ THEME TOGGLE ============
    function initTheme() {
        const toggle = document.getElementById('themeToggle');
        const savedTheme = localStorage.getItem('dk-theme');

        if (savedTheme === 'light') {
            document.body.classList.add('light');
            toggle.innerHTML = '<i class="fas fa-sun"></i>';
        }

        toggle.addEventListener('click', () => {
            document.body.classList.toggle('light');
            const isLight = document.body.classList.contains('light');
            toggle.innerHTML = isLight ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
            localStorage.setItem('dk-theme', isLight ? 'light' : 'dark');
        });
    }

    // ============ CAROUSEL ============
    function initCarousel() {
        const carousel = document.getElementById('servicesCarousel');
        const dotsContainer = document.getElementById('carouselDots');
        if (!carousel || !dotsContainer) return;

        const cards = carousel.querySelectorAll('.service-card');
        dotsContainer.innerHTML = '';

        cards.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
            dotsContainer.appendChild(dot);
        });

        carousel.addEventListener('scroll', () => {
            const scrollLeft = carousel.scrollLeft;
            const cardWidth = cards[0].offsetWidth + 16;
            const activeIndex = Math.round(scrollLeft / cardWidth);
            dotsContainer.querySelectorAll('.carousel-dot').forEach((d, i) => {
                d.classList.toggle('active', i === activeIndex);
            });
        });
    }

    // ============ PRODUCT FILTER ============
    function initProductFilter() {
        const chips = document.querySelectorAll('.filter-chip');
        const products = document.querySelectorAll('.product-card');

        chips.forEach(chip => {
            chip.addEventListener('click', () => {
                chips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');

                const filter = chip.dataset.filter;
                products.forEach(card => {
                    if (filter === 'all' || card.dataset.category === filter) {
                        card.classList.remove('hidden-card');
                        card.style.animation = 'pageIn 0.4s ease';
                    } else {
                        card.classList.add('hidden-card');
                    }
                });
            });
        });
    }

    // ============ FORMS ============
    function initForms() {
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                showToast('Message sent successfully! We\'ll get back to you soon.');
                contactForm.reset();
            });
        }

        const quoteForm = document.getElementById('quoteForm');
        if (quoteForm) {
            quoteForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const services = quoteForm.querySelectorAll('input[name="service"]:checked');
                if (services.length === 0) {
                    showToast('Please select at least one service');
                    return;
                }
                showToast('Quote request submitted! We\'ll contact you within 24 hours.');
                quoteForm.reset();
            });
        }
    }

    // ============ STATS ANIMATION ============
    function initStatsAnimation() {
        const numbers = document.querySelectorAll('.hero-stat-number');
        numbers.forEach(num => {
            const target = parseInt(num.dataset.target);
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;
            num.textContent = '0';

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const animate = () => {
                            current += increment;
                            if (current < target) {
                                num.textContent = Math.floor(current) + '+';
                                requestAnimationFrame(animate);
                            } else {
                                num.textContent = target + '+';
                            }
                        };
                        animate();
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            observer.observe(num);
        });
    }

    // ============ SCROLL REVEAL ============
    function initScrollReveal() {
        const elements = document.querySelectorAll(
            '.service-full-card, .product-card, .package-full-card, .portfolio-card, .testimonial-card, .feature-card, .value-item, .team-card, .contact-method'
        );

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, i * 60);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

        elements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            observer.observe(el);
        });
    }

    // ============ TOAST ============
    function showToast(message) {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');
        toastMessage.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3500);
    }

    // ============ MAP ============
    window.openMap = function() {
        window.open('https://www.google.com/maps/search/?api=1&query=123+Security+Avenue+Tech+City', '_blank');
    };

    // ============ TOUCH SWIPE FOR CAROUSEL ============
    const carousel = document.getElementById('servicesCarousel');
    if (carousel) {
        let startX = 0;
        carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        }, { passive: true });

        carousel.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            if (Math.abs(diff) > 50) {
                const cardWidth = carousel.querySelector('.service-card').offsetWidth + 16;
                carousel.scrollBy({ left: diff > 0 ? cardWidth : -cardWidth, behavior: 'smooth' });
            }
        }, { passive: true });
    }

    // ============ HEADER SCROLL EFFECT ============
    let lastScroll = 0;
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll > lastScroll && currentScroll > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        lastScroll = currentScroll;
    }, { passive: true });

    // ============ HAPTIC FEEDBACK ============
    document.querySelectorAll('button, .service-card, .product-card, .portfolio-card').forEach(el => {
        el.addEventListener('click', () => {
            if (navigator.vibrate) navigator.vibrate(10);
        });
    });

});
