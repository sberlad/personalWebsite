// Scripts for gallery.html only. Shared behaviour (menu, header, footer year) is in js/main.js.

class ModernCarousel {
    constructor() {
        this.currentSlide = 0;
        this.slides = document.querySelectorAll('.carousel-slide');
        this.totalSlides = this.slides.length;
        this.track = document.getElementById('carouselTrack');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.autoplayInterval = null;
        this.isAutoplayActive = true;
        this.autoplayText = document.getElementById('autoplay-text');

        this.init();
    }

    init() {
        this.createPaginationDots();
        this.attachEventListeners();
        this.startAutoplay();
        this.addTouchSupport();
        this.addKeyboardSupport();
    }

    createPaginationDots() {
        const dotsContainer = document.getElementById('paginationDots');
        dotsContainer.innerHTML = '';

        for (let i = 0; i < this.totalSlides; i++) {
            const dot = document.createElement('button');
            dot.className = `pagination-dot ${i === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => this.goToSlide(i));
            dotsContainer.appendChild(dot);
        }

        this.dots = document.querySelectorAll('.pagination-dot');
    }

    attachEventListeners() {
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());

        // Pause autoplay on hover
        const carousel = document.querySelector('.carousel');
        carousel.addEventListener('mouseenter', () => this.pauseAutoplay());
        carousel.addEventListener('mouseleave', () => this.resumeAutoplay());

        // Click to toggle autoplay
        document.querySelector('.autoplay-indicator').addEventListener('click', () => this.toggleAutoplay());
    }

    goToSlide(slideIndex) {
        this.currentSlide = slideIndex;
        this.updateCarousel();
        this.updatePagination();
        this.resetAutoplay();
    }

    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
        this.updateCarousel();
        this.updatePagination();
        this.resetAutoplay();
    }

    prevSlide() {
        this.currentSlide = this.currentSlide === 0 ? this.totalSlides - 1 : this.currentSlide - 1;
        this.updateCarousel();
        this.updatePagination();
        this.resetAutoplay();
    }

    updateCarousel() {
        const translateX = -this.currentSlide * 100;
        this.track.style.transform = `translateX(${translateX}%)`;
    }

    updatePagination() {
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });
    }

    startAutoplay() {
        if (this.isAutoplayActive) {
            this.autoplayInterval = setInterval(() => {
                this.nextSlide();
            }, 4000);
        }
    }

    pauseAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayText.textContent = 'Paused';
        }
    }

    resumeAutoplay() {
        if (this.isAutoplayActive) {
            this.startAutoplay();
            this.autoplayText.textContent = 'Auto-play';
        }
    }

    resetAutoplay() {
        this.pauseAutoplay();
        this.resumeAutoplay();
    }

    toggleAutoplay() {
        this.isAutoplayActive = !this.isAutoplayActive;
        if (this.isAutoplayActive) {
            this.startAutoplay();
            this.autoplayText.textContent = 'Auto-play';
        } else {
            this.pauseAutoplay();
            this.autoplayText.textContent = 'Manual';
        }
    }

    addTouchSupport() {
        let startX = 0;
        let isDragging = false;

        this.track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
            this.pauseAutoplay();
        }, { passive: true });

        this.track.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
        }, { passive: false });

        this.track.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            isDragging = false;

            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;

            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }

            this.resumeAutoplay();
        }, { passive: true });
    }

    addKeyboardSupport() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.prevSlide();
            } else if (e.key === 'ArrowRight') {
                this.nextSlide();
            } else if (e.key === ' ') {
                e.preventDefault();
                this.toggleAutoplay();
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    new ModernCarousel();
});
