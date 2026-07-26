// ── SET CURRENT YEAR ──
document.getElementById('yr').textContent = new Date().getFullYear();

// ── SCROLL REVEAL ──
const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

// ── CAROUSEL FUNCTIONALITY ──
(function() {
    const slidesContainer = document.getElementById('carouselSlides');
    const dotsContainer = document.getElementById('carouselDots');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');

    if (!slidesContainer) return;

    // ── CONFIGURE YOUR IMAGES HERE ──
    const IMAGE_FOLDER = 'image_slide/';
    const IMAGE_NAMES = [
        'image1.png',
        'image2.png',
        'image3.png',
        'image4.png',
        'image5.png',
        'image6.png',
        'image7.png',
        'image8.png',
        'image9.png',
        'image10.png',
        'image11.png',
        'image12.png',
        'image13.png',
        'image14.png',
        'image15.png',
        'image16.png',
        'image17.png',
        'image18.png',
        'image19.png',
        'image20.png',
        'image21.png',
        'image22.png',
        'image23.png',
        'image24.png',
        'image25.png',
        'image26.png'
        // Add all your .png image filenames here
    ];

    function shuffleArray(arr) {
        const shuffled = [...arr];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    function getRandomImages() {
        const shuffled = shuffleArray(IMAGE_NAMES);
        return shuffled.slice(0, Math.min(10, shuffled.length));
    }

    function buildSlides() {
        const randomImages = getRandomImages();
        
        slidesContainer.innerHTML = '';

        if (randomImages.length === 0) {
            slidesContainer.innerHTML = `
                <div class="carousel-slide" style="display:flex;align-items:center;justify-content:center;font-size:1.2rem;color:var(--muted);padding:40px;text-align:center;">
                    <p>📸 No images found in the "${IMAGE_FOLDER}" folder.<br>Please add your .png images to the image_slide folder.</p>
                </div>
            `;
            return 0;
        }

        randomImages.forEach((imageName, index) => {
            const slide = document.createElement('div');
            slide.className = 'carousel-slide';
            
            const img = document.createElement('img');
            img.src = IMAGE_FOLDER + imageName;
            img.alt = 'Gallery Image ' + (index + 1);
            img.loading = 'lazy';
            
            slide.appendChild(img);
            slidesContainer.appendChild(slide);
        });

        return randomImages.length;
    }

    const totalSlides = buildSlides();
    
    if (totalSlides === 0) {
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
        return;
    }

    const slides = slidesContainer.querySelectorAll('.carousel-slide');
    let currentIndex = 0;
    let autoPlayInterval = null;
    const AUTO_PLAY_DELAY = 3000;

    dotsContainer.innerHTML = '';
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('data-index', i);
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }

    const dots = dotsContainer.querySelectorAll('.carousel-dot');

    function goToSlide(index) {
        if (index < 0) index = totalSlides - 1;
        if (index >= totalSlides) index = 0;
        currentIndex = index;

        slidesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;

        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });

        resetAutoPlay();
    }

    function nextSlide() {
        goToSlide(currentIndex + 1);
    }

    function prevSlide() {
        goToSlide(currentIndex - 1);
    }

    function startAutoPlay() {
        if (autoPlayInterval) clearInterval(autoPlayInterval);
        autoPlayInterval = setInterval(nextSlide, AUTO_PLAY_DELAY);
    }

    function resetAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            startAutoPlay();
        }
    }

    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        }
    }

    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);

    const container = document.querySelector('.carousel-container');
    if (container) {
        container.addEventListener('mouseenter', stopAutoPlay);
        container.addEventListener('mouseleave', startAutoPlay);
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
    });

    let touchStartX = 0;
    let touchEndX = 0;

    container.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    container.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) nextSlide();
            else prevSlide();
        }
    }, { passive: true });

    startAutoPlay();

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopAutoPlay();
        } else {
            startAutoPlay();
        }
    });

    console.log('Carousel loaded with ' + totalSlides + ' random images from ' + IMAGE_FOLDER);
})();