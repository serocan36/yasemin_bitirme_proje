document.addEventListener('DOMContentLoaded', () => {
    // 1. Page Loader
    const loader = document.getElementById('loader');
    window.addEventListener('load', () => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    });

    // 2. Sticky Header & Scroll Effects
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 3. Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    mobileToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = mobileToggle.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });

    // Mobile Submenu Toggles
    document.querySelectorAll('.nav-item').forEach(item => {
        const link = item.querySelector('.nav-link');
        const dropdown = item.querySelector('.dropdown, .mega-menu');
        
        if (dropdown && window.innerWidth <= 1024) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const isOpen = dropdown.style.display === 'block';
                
                // Close others
                document.querySelectorAll('.dropdown, .mega-menu').forEach(d => d.style.display = 'none');
                
                dropdown.style.display = isOpen ? 'none' : 'block';
            });
        }
    });

    // 4. Scroll Animations (Intersection Observer)
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    document.querySelectorAll('[data-animate]').forEach(el => {
        observer.observe(el);
    });

    // 5. Improved Hero Slider
    const slider = document.querySelector('.hero-slider');
    const slides = document.querySelectorAll('.hero-slide');
    const dotsContainer = document.querySelector('.slider-dots');
    const nextBtn = document.querySelector('.next-slide');
    const prevBtn = document.querySelector('.prev-slide');
    
    let currentSlide = 0;
    let slideInterval;

    if (slides.length > 0) {
        // Create dots
        slides.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });

        const dots = document.querySelectorAll('.dot');

        function goToSlide(n) {
            slides[currentSlide].classList.remove('active');
            dots[currentSlide].classList.remove('active');
            currentSlide = (n + slides.length) % slides.length;
            slides[currentSlide].classList.add('active');
            dots[currentSlide].classList.add('active');
            resetInterval();
        }

        function nextSlide() { goToSlide(currentSlide + 1); }
        function prevSlide() { goToSlide(currentSlide - 1); }

        nextBtn?.addEventListener('click', nextSlide);
        prevBtn?.addEventListener('click', prevSlide);

        function resetInterval() {
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 6000);
        }

        resetInterval();
    }

    // 6. Smooth Scroll for all links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Mobile Nav Styles Injection (Dynamic)
const style = document.createElement('style');
style.textContent = `
    @media (max-width: 1024px) {
        .nav-links.active {
            display: flex;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            background: #fff;
            padding: 20px;
            box-shadow: 0 10px 20px rgba(0,0,0,0.1);
            animation: slideDown 0.3s ease-out forwards;
        }
        
        .nav-links.active .nav-link {
            padding: 15px 0;
            border-bottom: 1px solid #eee;
        }

        .nav-links.active .mega-menu, 
        .nav-links.active .dropdown {
            position: static;
            transform: none;
            opacity: 1;
            visibility: visible;
            display: none; /* Hide submenus by default on mobile */
            width: 100%;
            box-shadow: none;
            border: none;
            padding: 0 20px;
        }

        .nav-links.active .nav-item:hover .mega-menu,
        .nav-links.active .nav-item:hover .dropdown {
            display: block;
        }

        @keyframes slideDown {
            from { transform: translateY(-10px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
    }
`;
document.head.appendChild(style);
