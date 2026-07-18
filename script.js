document.addEventListener("DOMContentLoaded", () => {
  
  // 1. PRELOADER
  const preloader = document.getElementById("preloader");
  if (preloader) {
    window.addEventListener("load", () => {
      preloader.classList.add("hidden");
    });
    // Cadangan jika window.load lambat terpicu
    setTimeout(() => {
      preloader.classList.add("hidden");
    }, 2000);
  }

  // 2. NAV SCROLL EFFECT
  const navbar = document.getElementById("navbar");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  // 3. MOBILE MENU TOGGLE
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");
  const navLinks = document.querySelectorAll(".nav-link");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      navToggle.classList.toggle("active");
      navMenu.classList.toggle("active");
    });

    // Menutup menu mobile saat link diklik
    navLinks.forEach(link => {
      link.addEventListener("click", () => {
        navToggle.classList.remove("active");
        navMenu.classList.remove("active");
      });
    });
  }

  // 4. ACTIVE NAVIGATION LINK ON SCROLL
  const sections = document.querySelectorAll("section[id]");
  window.addEventListener("scroll", () => {
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute("id");
      const activeLink = document.querySelector(`.nav-menu a[href*=${sectionId}]`);

      if (activeLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          activeLink.classList.add("active");
        } else {
          activeLink.classList.remove("active");
        }
      }
    });
  });

  // 5. PORTFOLIO FILTER
  const filterButtons = document.querySelectorAll(".filter-btn");
  const portfolioItems = document.querySelectorAll(".portfolio-item");

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      // Hapus kelas aktif dari tombol lama
      filterButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");

      const filterValue = button.getAttribute("data-filter");

      portfolioItems.forEach(item => {
        const itemCategory = item.getAttribute("data-category");
        
        // Animasi transisi filter
        if (filterValue === "all" || filterValue === itemCategory) {
          item.style.display = "block";
          setTimeout(() => {
            item.style.opacity = "1";
            item.style.transform = "scale(1)";
          }, 50);
        } else {
          item.style.opacity = "0";
          item.style.transform = "scale(0.8)";
          setTimeout(() => {
            item.style.display = "none";
          }, 400); // Sesuai durasi transisi CSS
        }
      });
    });
  });

  // 6. LIGHTBOX MODAL
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxCat = document.getElementById("lightboxCat");
  const lightboxTitle = document.getElementById("lightboxTitle");
  const lightboxClose = document.getElementById("lightboxClose");

  if (lightbox) {
    portfolioItems.forEach(item => {
      item.addEventListener("click", () => {
        const img = item.querySelector("img");
        const category = item.querySelector(".portfolio-cat").textContent;
        const title = item.querySelector(".portfolio-item-title").textContent;

        lightboxImg.src = img.src;
        lightboxCat.textContent = category;
        lightboxTitle.textContent = title;
        
        lightbox.classList.add("active");
        lightbox.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden"; // Mencegah scrolling saat modal aktif
      });
    });

    const closeLightbox = () => {
      lightbox.classList.remove("active");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "auto";
    };

    lightboxClose.addEventListener("click", closeLightbox);
    
    // Klik di area abu-abu gelap juga menutup lightbox
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    // Support tombol ESC untuk menutup
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && lightbox.classList.contains("active")) {
        closeLightbox();
      }
    });
  }

  // 7. TESTIMONIAL SLIDER
  const slider = document.getElementById("testimonialSlider");
  const dots = document.querySelectorAll(".slider-dot");
  let currentSlide = 0;
  const slideCount = dots.length;
  let sliderInterval;

  const goToSlide = (index) => {
    if (slider) {
      slider.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach(dot => dot.classList.remove("active"));
      dots[index].classList.add("active");
      currentSlide = index;
    }
  };

  const nextSlide = () => {
    let next = currentSlide + 1;
    if (next >= slideCount) next = 0;
    goToSlide(next);
  };

  const startAutoPlay = () => {
    sliderInterval = setInterval(nextSlide, 5000); // Berpindah setiap 5 detik
  };

  const stopAutoPlay = () => {
    clearInterval(sliderInterval);
  };

  if (slider) {
    // Jalankan auto play
    startAutoPlay();

    // Event listener untuk tombol dots navigasi
    dots.forEach(dot => {
      dot.addEventListener("click", (e) => {
        const slideIndex = parseInt(e.target.getAttribute("data-slide"));
        goToSlide(slideIndex);
        stopAutoPlay();
        startAutoPlay(); // Restart timer setelah klik manual
      });
    });
  }

  // 8. FAQ ACCORDION
  const accordionHeaders = document.querySelectorAll(".accordion-header");

  accordionHeaders.forEach(header => {
    header.addEventListener("click", () => {
      const item = header.parentElement;
      const body = header.nextElementSibling;
      const isActive = item.classList.contains("active");

      // Menutup semua accordion item lain terlebih dahulu
      document.querySelectorAll(".accordion-item").forEach(otherItem => {
        otherItem.classList.remove("active");
        otherItem.querySelector(".accordion-body").style.maxHeight = null;
      });

      // Toggle item saat ini
      if (!isActive) {
        item.classList.add("active");
        body.style.maxHeight = body.scrollHeight + "px";
      } else {
        item.classList.remove("active");
        body.style.maxHeight = null;
      }
    });
  });

  // 9. SCROLL REVEAL ANIMATION (Intersection Observer)
  const revealElements = document.querySelectorAll(".reveal");
  
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-visible");
          observer.unobserve(entry.target); // Matikan pemantauan setelah elemen muncul
        }
      });
    }, {
      threshold: 0.15, // Elemen muncul ketika 15% dari tingginya terlihat di viewport
      rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback jika browser lawas tidak mendukung Intersection Observer
    revealElements.forEach(el => el.classList.add("reveal-visible"));
  }

  // 10. BACK TO TOP BUTTON
  const backToTopBtn = document.getElementById("backToTop");
  
  window.addEventListener("scroll", () => {
    if (window.scrollY > 500) {
      backToTopBtn.classList.add("show");
    } else {
      backToTopBtn.classList.remove("show");
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }
});
