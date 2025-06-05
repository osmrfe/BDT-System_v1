// script.js
document.addEventListener('DOMContentLoaded', function() {

    const preloader = document.querySelector('.preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('hidden');
            }, 300);
        });
    }

    AOS.init({
        duration: 700,
        once: true,
        offset: 60,
        easing: 'ease-out-cubic',
    });

    const siteHeader = document.querySelector('.site-header');
    const navHeightInitial = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height'), 10);
    const navHeightScrolled = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-scrolled-height'), 10);

    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            siteHeader.classList.add('scrolled');
        } else {
            siteHeader.classList.remove('scrolled');
        }
        updateActiveNavLinkOnScroll();
    });

    function updateScrollMargins() {
        const currentNavHeight = siteHeader.classList.contains('scrolled') ? navHeightScrolled : navHeightInitial;
        document.querySelectorAll('.scroll-target').forEach(section => {
            section.style.scrollMarginTop = currentNavHeight + 'px';
        });
    }
    updateScrollMargins();
    window.addEventListener('resize', updateScrollMargins);


    const heroTitleAdvanced = document.querySelector('.hero-section .hero-content h1.animate-letters-advanced');
    if (heroTitleAdvanced) {
        const spans = heroTitleAdvanced.querySelectorAll('span');
        spans.forEach((span, index) => {
            span.style.animationDelay = `${index * 0.05}s`; // Slightly faster for more letters
        });
    }

    const counters = document.querySelectorAll('.counter');
    const counterSpeed = 200; 
    const animateCounter = (counter) => {
        const target = +counter.getAttribute('data-target');
        let currentCount = 0;
        counter.innerText = currentCount;

        const updateCount = () => {
            const increment = target / counterSpeed;
            currentCount += increment;

            if (currentCount < target) {
                counter.innerText = Math.ceil(currentCount);
                requestAnimationFrame(updateCount);
            } else {
                counter.innerText = target;
                counter.classList.add('finished');
            }
        };
        requestAnimationFrame(updateCount);
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counterElement = entry.target.querySelector('.counter') || entry.target;
                if (counterElement && !counterElement.classList.contains('animated') && !counterElement.classList.contains('finished')) {
                    animateCounter(counterElement);
                    counterElement.classList.add('animated');
                }
            }
        });
    }, { threshold: 0.4 });

    document.querySelectorAll('.counter-item').forEach(item => {
        counterObserver.observe(item);
    });

    const backToTopButton = document.querySelector('.back-to-top');
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 350) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });
    }

    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    const scrollDownLink = document.querySelector('.scroll-down-indicator');
    if (scrollDownLink) {
        scrollDownLink.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = scrollDownLink.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Mobil Navigáció Toggle
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const primaryNav = document.getElementById('primary-navigation');

    if (mobileNavToggle && primaryNav) {
        mobileNavToggle.addEventListener('click', () => {
            const isExpanded = primaryNav.classList.toggle('active');
            mobileNavToggle.setAttribute('aria-expanded', isExpanded);
            mobileNavToggle.classList.toggle('active');
            document.body.classList.toggle('nav-open', isExpanded);
        });

        primaryNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (primaryNav.classList.contains('active')) {
                    primaryNav.classList.remove('active');
                    mobileNavToggle.setAttribute('aria-expanded', 'false');
                    mobileNavToggle.classList.remove('active');
                    document.body.classList.remove('nav-open');
                }
            });
        });
    }

    // Aktív menüpont jelölése görgetéskor és kattintáskor
    const navLinks = document.querySelectorAll('.sticky-nav ul li a');
    const sections = document.querySelectorAll('section.scroll-target');

    function updateActiveNavLinkOnScroll() {
        let currentSectionId = '';
        const scrollPosition = window.scrollY;
        const navActualHeight = siteHeader.classList.contains('scrolled') ? navHeightScrolled : navHeightInitial;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - navActualHeight - 10; // Adjusted buffer for accuracy
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.id;
            }
        });
        
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 50 && sections.length > 0) {
             // If near bottom of page, and last section isn't filling viewport, activate last section
            const lastSection = sections[sections.length-1];
            if (lastSection.offsetTop + lastSection.offsetHeight > scrollPosition ) { // Ensure we are not past the last section
                 currentSectionId = lastSection.id;
            }
        }


        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === currentSectionId) {
                link.classList.add('active');
            }
        });
    }
    
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            // Smooth scroll is handled by CSS scroll-behavior: smooth and scroll-margin-top
            // For instant active class update on click (optional, scroll handler also does this)
            setTimeout(() => {
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }, 50); // Small delay
        });
    });
    
    updateActiveNavLinkOnScroll(); // Initial call

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const questionButton = item.querySelector('.faq-question');
        const answerDiv = item.querySelector('.faq-answer');

        if (questionButton && answerDiv) {
            questionButton.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all other items
                // faqItems.forEach(otherItem => {
                //     if (otherItem !== item) {
                //         otherItem.classList.remove('active');
                //         otherItem.querySelector('.faq-answer').style.maxHeight = null;
                //          otherItem.querySelector('.faq-answer').style.paddingTop = null;
                //         otherItem.querySelector('.faq-answer').style.paddingBottom = null;
                //     }
                // });

                // Toggle current item
                item.classList.toggle('active');
                if (item.classList.contains('active')) {
                    answerDiv.style.maxHeight = answerDiv.scrollHeight + "px";
                    answerDiv.style.paddingTop = "1rem"; // Match CSS padding
                    answerDiv.style.paddingBottom = "1.5rem"; // Match CSS padding
                } else {
                    answerDiv.style.maxHeight = null;
                    answerDiv.style.paddingTop = null;
                    answerDiv.style.paddingBottom = null;
                }
            });
        }
    });


    const contactForm = document.getElementById('contact-form');
    if(contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Köszönjük üzenetét, Klíma Fókáink hamarosan felveszik Önnel a kapcsolatot! (Ez egy demo üzenet)');
            contactForm.reset();
            contactForm.querySelectorAll('input, textarea').forEach(field => {
                // CSS :valid should handle label positioning, but if issues, add js logic here
            });
        });
    }
});