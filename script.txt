// --- GLOBÁLIS FÜGGVÉNYEK ---
function initSnowfall() {
    const canvas = document.getElementById('snow-canvas');
    if (!canvas) return; // Biztonsági ellenőrzés, ha nincs canvas az oldalon
    
    const ctx = canvas.getContext('2d');
    let width, height, particles = [];

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height - height;
            this.size = Math.random() * 3 + 1;
            this.speed = Math.random() * 1 + 0.5;
            this.velX = Math.random() * 0.5 - 0.25;
        }
        update() {
            this.y += this.speed;
            this.x += this.velX;
            if (this.y > height) this.reset();
        }
        draw() {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < 100; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }
    animate();
}


// --- FŐ INICIALIZÁLÁS (Amikor az oldal betöltött) ---
// Itt fogjuk össze az összes szkriptet, hogy sorban, hibátlanul fussanak le
document.addEventListener('DOMContentLoaded', function() {

    // 1. Hóesés indítása
    initSnowfall();

    // 2. Preloader
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('hidden');
            }, 300);
        });
    }

    // 3. AOS (Animációk)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 700,
            once: true,
            offset: 60,
            easing: 'ease-out-cubic',
        });
    }

    // 4. Header és Navigáció
    const siteHeader = document.querySelector('.site-header');
    let updateActiveNavLinkOnScroll = function() {}; // Üres függvény alapértelmezetten, hogy ne dobjon hibát

    if (siteHeader) {
        const navHeightInitial = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height') || 0, 10);
        const navHeightScrolled = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-scrolled-height') || 0, 10);

        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                siteHeader.classList.add('scrolled');
            } else {
                siteHeader.classList.remove('scrolled');
            }
            // Csak akkor fut, ha a főoldalon vagyunk
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
    }

    // 5. Hero Cím animáció
    const heroTitleAdvanced = document.querySelector('.hero-section .hero-content h1.animate-letters-advanced');
    if (heroTitleAdvanced) {
        const spans = heroTitleAdvanced.querySelectorAll('span');
        spans.forEach((span, index) => {
            span.style.animationDelay = `${index * 0.05}s`; 
        });
    }

    // 6. Számlálók
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

    if ('IntersectionObserver' in window) {
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
    }

    // 7. Back to top gomb
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

    // 8. Aktuális év beállítása
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // 9. Scroll down gomb
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

    // 10. Mobil Navigáció
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

    // 11. Aktív menüpont jelölése görgetéskor
    const navLinks = document.querySelectorAll('.sticky-nav ul li a');
    const sections = document.querySelectorAll('section.scroll-target');
    const currentPage = window.location.pathname.split('/').pop().toLowerCase();

    if (currentPage !== '' && currentPage !== 'index.html') {
        // Ha aloldalon vagyunk (pl. referencia.html)
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href') || '';
            if (href.toLowerCase() === currentPage) {
                link.classList.add('active');
            }
        });
    } else {
        // Ha a főoldalon vagyunk
        updateActiveNavLinkOnScroll = function() {
            let currentSectionId = '';
            const scrollPosition = window.scrollY;
            const navActualHeight = (siteHeader && siteHeader.classList.contains('scrolled'))
                ? (parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-scrolled-height') || 0, 10))
                : (parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height') || 0, 10));

            sections.forEach(section => {
                const sectionTop = section.offsetTop - navActualHeight - 10;
                const sectionHeight = section.offsetHeight;
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    currentSectionId = section.id;
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                const href = link.getAttribute('href') || '';
                if (href.startsWith('#') && href.substring(1) === currentSectionId) {
                    link.classList.add('active');
                }
            });
        };

        navLinks.forEach(link => {
            link.addEventListener('click', function () {
                const href = this.getAttribute('href') || '';
                if (href.startsWith('#')) {
                    setTimeout(() => {
                        navLinks.forEach(l => l.classList.remove('active'));
                        this.classList.add('active');
                    }, 50);
                }
            });
        });

        if (sections.length > 0) {
            updateActiveNavLinkOnScroll();
        }
    }

    // 12. FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const questionButton = item.querySelector('.faq-question');
        const answerDiv = item.querySelector('.faq-answer');

        if (questionButton && answerDiv) {
            questionButton.addEventListener('click', () => {
                item.classList.toggle('active');
                if (item.classList.contains('active')) {
                    answerDiv.style.maxHeight = answerDiv.scrollHeight + "px";
                    answerDiv.style.paddingTop = "1rem"; 
                    answerDiv.style.paddingBottom = "1.5rem"; 
                } else {
                    answerDiv.style.maxHeight = null;
                    answerDiv.style.paddingTop = null;
                    answerDiv.style.paddingBottom = null;
                }
            });
        }
    });

    // 13. Kapcsolati űrlap
    const contactForm = document.getElementById('contact-form');
    if(contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Köszönjük üzenetét, Klíma Fókáink hamarosan felveszik Önnel a kapcsolatot! (Ez egy demo üzenet)');
            contactForm.reset();
        });
    }

    // =====================================================================
    // 14. REFERENCIA RENDSZER (JSON BETÖLTÉS + MODAL)
    // =====================================================================
    const referenceGrid = document.getElementById('dynamic-reference-grid');
    
    // Csak akkor próbáljon referenciákat betölteni, ha azon az aloldalon vagyunk
    if (referenceGrid) {
        let referenceData = []; 

        // JSON fájl beolvasása
        fetch('referenciak.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Hiba a JSON betöltésekor');
                }
                return response.json();
            })
            .then(data => {
                referenceData = data;
                referenceGrid.innerHTML = ''; // "Betöltés..." felirat eltávolítása

                // Kártyák legenerálása
                data.forEach((ref, index) => {
                    const card = document.createElement('div');
                    card.className = 'reference-card';
                    card.dataset.index = index; 

                    // Borítókép (a JSON "images" listájának legelső eleme)
                    const coverImage = (ref.images && ref.images.length > 0) ? ref.images[0] : 'image/logo.png';

                    card.innerHTML = `
                        <img src="${coverImage}" alt="${ref.title}">
                        <div class="reference-content">
                            <h3>${ref.title}</h3>
                            <p>${ref.short_description}</p>
                            <span class="btn-details" style="color:#0077cc; font-weight:bold;">Részletek megtekintése &rarr;</span>
                        </div>
                    `;

                    // Kattintás esemény a modális ablakhoz
                    card.addEventListener('click', () => openModal(index));
                    referenceGrid.appendChild(card);
                });
            })
            .catch(error => {
                console.error('Hiba történt a referenciák betöltésekor:', error);
                referenceGrid.innerHTML = '<p style="color:red; text-align:center;">Nem sikerült betölteni a referenciákat. Kérjük frissítse az oldalt, vagy ellenőrizze a JSON fájl szintaktikáját.</p>';
            });

        // Modális ablak (Felugró ablak) logikája
        const modal = document.getElementById('reference-modal');
        const modalTitle = document.getElementById('modal-title');
        const modalGallery = document.getElementById('modal-gallery');
        const modalDesc = document.getElementById('modal-description');
        const modalFbBtn = document.getElementById('modal-fb-btn');
        const closeModalBtn = document.querySelector('.modal-close');

        function openModal(index) {
            if(!modal) return;
            const ref = referenceData[index];
            
            if(modalTitle) modalTitle.textContent = ref.title;
            if(modalDesc) modalDesc.textContent = ref.full_description;
            if(modalFbBtn) modalFbBtn.href = ref.facebook_url;

            // Képgaléria betöltése a modális ablakba
            if(modalGallery) {
                modalGallery.innerHTML = '';
                if(ref.images && ref.images.length > 0) {
                    ref.images.forEach(imgSrc => {
                        const img = document.createElement('img');
                        img.src = imgSrc;
                        img.alt = ref.title;
                        modalGallery.appendChild(img);
                    });
                }
            }

            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Háttér görgetés letiltása
        }

        function closeModal() {
            if(!modal) return;
            modal.classList.remove('active');
            document.body.style.overflow = 'auto'; // Háttér görgetés engedélyezése
        }

        // Zárás X gombbal
        if(closeModalBtn) {
            closeModalBtn.addEventListener('click', closeModal);
        }

        // Zárás sötét háttérre kattintva
        if(modal) {
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    closeModal();
                }
            });
        }

        // Zárás Escape gombbal
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
                closeModal();
            }
        });
    }

}); // Itt van a vége a FŐ DOMContentLoaded blokknak!