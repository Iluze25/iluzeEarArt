document.addEventListener('DOMContentLoaded', () => {

    /* ==================== 1. PRELOADER ==================== */
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('fade-out');
            }, 1200); // Durasi estetik loading bar
        });
    }

    /* ==================== 2. CUSTOM CURSOR ==================== */
    const cursorDot = document.querySelector('.custom-cursor-dot');
    const cursorOutline = document.querySelector('.custom-cursor-outline');

    if (cursorDot && cursorOutline) {
        document.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            // Instan update untuk dot tengah
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            // Efek lag / halus untuk lingkaran outline luar
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });

        // Hover Effect untuk Link & Tombol
        const hoverables = document.querySelectorAll('.cursor-hover, a, button, .gallery-trigger');
        hoverables.forEach(item => {
            item.addEventListener('mouseenter', () => {
                cursorDot.style.transform = 'translate(-50%, -50%) scale(1.5)';
                cursorDot.style.backgroundColor = 'var(--color-black)';
                cursorOutline.style.width = '45px';
                cursorOutline.style.height = '45px';
                cursorOutline.style.borderColor = 'var(--color-black)';
            });
            item.addEventListener('mouseleave', () => {
                cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
                cursorDot.style.backgroundColor = 'var(--color-accent)';
                cursorOutline.style.width = '32px';
                cursorOutline.style.height = '32px';
                cursorOutline.style.borderColor = 'var(--color-accent)';
            });
        });
    }

    /* ==================== 3. MOBILE MENU TOGGLE ==================== */
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });

        // Tutup menu saat link diklik
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
            });
        });
    }

    /* ==================== 4. NAVBAR TRANSPARENT TO SOLID ==================== */
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    /* ==================== 5. BACK TO TOP BUTTON ==================== */
    const backToTop = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });
    
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    /* ==================== 6. PARALLAX EFFECT (HERO) ==================== */
    const parallaxBg = document.querySelector('.hero-bg-parallax');
    window.addEventListener('scroll', () => {
        let scrollPosition = window.pageYOffset;
        if (parallaxBg) {
            parallaxBg.style.transform = `translateY(${scrollPosition * 0.35}px) scale(1.05)`;
        }
    });

    /* ==================== 7. INTERSECTION OBSERVER FOR REVEAL & STATS ==================== */
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const statNumbers = document.querySelectorAll('.stat-number');

    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Terjemahkan juga animasi counter jika bagian about terlihat
                if (entry.target.classList.contains('about-content')) {
                    startCounters();
                }
                observer.unobserve(entry.target);
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        root: null,
        threshold: 0.12,
        rootMargin: "0px"
    });

    revealElements.forEach(elem => revealObserver.observe(elem));

    // Logika Counter Statistik
    function startCounters() {
        statNumbers.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText;
                const speed = target > 10 ? 30 : 1; // Sesuaikan kecepatan

                if (count < target) {
                    counter.innerText = Math.ceil(count + (target / speed));
                    setTimeout(updateCount, 40);
                } else {
                    counter.innerText = target;
                }
            };
            updateCount();
        });
    }

    /* ==================== 8. IMAGE LAZY LOADING ==================== */
    const lazyImages = document.querySelectorAll('.lazy-image');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.onload = () => {
                    img.style.opacity = '1';
                };
                observer.unobserve(img);
            }
        });
    }, { rootMargin: "0px 0px 100px 0px" });

    lazyImages.forEach(img => imageObserver.observe(img));

    /* ==================== 9. GALLERY FILTER ==================== */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Ganti status aktif tombol
            filterButtons.forEach(button => button.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            galleryItems.forEach(item => {
                const categories = item.getAttribute('data-category');
                
                if (filterValue === 'all' || categories.includes(filterValue)) {
                    item.classList.remove('hide');
                    // Mengembalikan animasi fade
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        item.classList.add('hide');
                    }, 400); // Sinkronisasi dengan transisi CSS (0.5s)
                }
            });
        });
    });

    /* ==================== 10. MUSEUM LIGHTBOX ==================== */
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaptionTitle = document.querySelector('.lightbox-title');
    const lightboxCaptionDesc = document.querySelector('.lightbox-desc');
    const closeBtn = document.getElementById('lightboxClose');
    const prevBtn = document.getElementById('lightboxPrev');
    const nextBtn = document.getElementById('lightboxNext');
    
    let activeGallery = [];
    let currentIndex = 0;

    // Kumpulkan seluruh gambar galeri yang saat ini terlihat (bukan terfilter keluar)
    function updateActiveGallery() {
        activeGallery = Array.from(galleryItems).filter(item => !item.classList.contains('hide'));
    }

    // Buka Lightbox pada Gambar yang Dipilih
    galleryItems.forEach(item => {
        const imgTrigger = item.querySelector('.gallery-trigger');
        imgTrigger.addEventListener('click', () => {
            updateActiveGallery();
            currentIndex = activeGallery.indexOf(item);
            openLightbox(item);
        });
    });

    function openLightbox(item) {
        const img = item.querySelector('.gallery-trigger');
        const title = item.querySelector('.item-title').innerText;
        const tag = item.querySelector('.item-tag').innerText;

        lightboxImg.src = img.src || img.dataset.src;
        lightboxCaptionTitle.innerText = title;
        lightboxCaptionDesc.innerText = tag;

        lightbox.classList.add('show');
        document.body.style.overflow = 'hidden'; // Kunci scrolling halaman utama
    }

    // Navigasi Gambar (Sebelumnya & Selanjutnya)
    function navigateLightbox(direction) {
        currentIndex = (currentIndex + direction + activeGallery.length) % activeGallery.length;
        const nextItem = activeGallery[currentIndex];
        
        // Animasi transisi pergantian gambar
        lightboxImg.style.opacity = '0';
        setTimeout(() => {
            openLightbox(nextItem);
            lightboxImg.style.opacity = '1';
        }, 200);
    }

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navigateLightbox(-1);
        });
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navigateLightbox(1);
        });
    }

    // Tutup Lightbox
    if (closeBtn && lightbox) {
        closeBtn.addEventListener('click', () => {
            lightbox.classList.remove('show');
            document.body.style.overflow = '';
        });

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.classList.remove('show');
                document.body.style.overflow = '';
            }
        });
    }

    // Keyboard Navigasi
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('show')) return;
        if (e.key === 'Escape') {
            lightbox.classList.remove('show');
            document.body.style.overflow = '';
        } else if (e.key === 'ArrowRight') {
            navigateLightbox(1);
        } else if (e.key === 'ArrowLeft') {
            navigateLightbox(-1);
        }
    });

    /* ==================== 11. ACTIVE NAVIGATION SCROLL SPILL ==================== */
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 150;
            const sectionId = current.getAttribute('id');
            const targetNavLink = document.querySelector(`.nav-link[href*=${sectionId}]`);

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                if (targetNavLink) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    targetNavLink.classList.add('active');
                }
            }
        });
    });
});
