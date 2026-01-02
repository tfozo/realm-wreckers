document.addEventListener('DOMContentLoaded', () => {
    // Initialize all features
    initScrollReveal();
    initHeroParallax();
    initLightbox();
    initSlideshow();
    initYouTubeVideos();
    initVideoBackgrounds();
    initNewsletterForm();
    initCharacterHoverEffects();
});

// Scroll Reveal Animation
function initScrollReveal() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in-scroll');
    fadeElements.forEach(el => observer.observe(el));
}

// Hero Background Mouse Parallax
function initHeroParallax() {
    const heroSection = document.querySelector('.hero-section');
    const heroBgImage = document.querySelector('.hero-bg-image');

    if (heroSection && heroBgImage) {
        heroSection.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const { offsetWidth, offsetHeight } = heroSection;

            const xPos = (clientX / offsetWidth) - 0.5;
            const yPos = (clientY / offsetHeight) - 0.5;

            const xMove = xPos * -30;
            const yMove = yPos * -30;

            heroBgImage.style.transform = `scale(1.1) translate(${xMove}px, ${yMove}px)`;
        });

        heroSection.addEventListener('mouseleave', () => {
            heroBgImage.style.transform = 'scale(1.1) translate(0, 0)';
        });
    }
}

// Lightbox System
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = lightbox.querySelector('.lightbox-image');
    const lightboxVideo = lightbox.querySelector('.lightbox-video');
    const lightboxLocalVideo = lightbox.querySelector('.lightbox-local-video');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const lightboxPrev = lightbox.querySelector('.lightbox-prev');
    const lightboxNext = lightbox.querySelector('.lightbox-next');

    let currentImages = [];
    let currentIndex = 0;

    // Open lightbox with image
    function openLightboxImage(src, images = null, index = 0) {
        currentImages = images || [src];
        currentIndex = index;

        lightboxImage.src = src;
        lightboxImage.style.display = 'block'; // Ensure visible
        lightboxImage.classList.add('active'); // Keep class just in case

        lightboxVideo.classList.remove('active');
        lightboxVideo.style.display = 'none'; // Ensure hidden

        if (lightboxLocalVideo) {
            lightboxLocalVideo.classList.remove('active');
            lightboxLocalVideo.style.display = 'none';
            lightboxLocalVideo.pause();
        }

        lightbox.classList.add('active');
        lightbox.style.display = ''; // Fix re-opening bug
        document.body.style.overflow = 'hidden';

        updateNavigationButtons();
    }

    // Open lightbox with YouTube video
    function openLightboxVideo(youtubeId, start = 0, end = 0) {
        let url = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=0&loop=1&playlist=${youtubeId}`;
        if (start > 0) url += `&start=${start}`;
        if (end > 0) url += `&end=${end}`;

        lightboxVideo.src = url;
        lightboxVideo.classList.add('active');
        lightboxVideo.style.display = 'block'; // Ensure visible

        if (lightboxImage) {
            lightboxImage.classList.remove('active');
            lightboxImage.style.display = 'none';
        }

        if (lightboxLocalVideo) {
            lightboxLocalVideo.classList.remove('active');
            lightboxLocalVideo.style.display = 'none';
            lightboxLocalVideo.pause();
        }

        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';

        if (lightboxPrev) lightboxPrev.style.display = 'none';
        if (lightboxNext) lightboxNext.style.display = 'none';
    }

    // Update navigation buttons
    function updateNavigationButtons() {
        if (currentImages.length <= 1) {
            lightboxPrev.style.display = 'none';
            lightboxNext.style.display = 'none';
        } else {
            lightboxPrev.style.display = 'flex';
            lightboxNext.style.display = 'flex';
        }
    }

    // Close lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';

        if (lightboxImage) {
            lightboxImage.classList.remove('active');
            lightboxImage.style.display = 'none';
        }

        lightboxVideo.classList.remove('active');
        lightboxVideo.style.display = 'none';
        lightboxVideo.src = '';

        if (lightboxLocalVideo) {
            lightboxLocalVideo.classList.remove('active');
            lightboxLocalVideo.pause();
            lightboxLocalVideo.style.display = 'none';
            lightboxLocalVideo.src = ''; // reset source
        }

        setTimeout(() => {
            if (!lightbox.classList.contains('active')) {
                lightbox.style.display = 'none';
            }
        }, 300);
    }

    // Navigate to previous image
    function prevImage() {
        if (currentImages.length > 1) {
            currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
            const newSrc = currentImages[currentIndex].href || currentImages[currentIndex];
            lightboxImage.src = newSrc;
        }
    }

    // Navigate to next image
    function nextImage() {
        if (currentImages.length > 1) {
            currentIndex = (currentIndex + 1) % currentImages.length;
            const newSrc = currentImages[currentIndex].href || currentImages[currentIndex];
            lightboxImage.src = newSrc;
        }
    }

    // Event listeners for image galleries
    // Event listeners for image galleries
    document.querySelectorAll('[data-lightbox]').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const lightboxGroup = item.getAttribute('data-lightbox');
            const allImages = Array.from(document.querySelectorAll(`[data-lightbox="${lightboxGroup}"]`));
            const index = allImages.indexOf(item);
            const src = item.href || item.querySelector('img')?.src || item.style.backgroundImage.match(/url\(["']?([^"']+)["']?\)/)?.[1];

            if (src) {
                openLightboxImage(src, allImages, index);
            }
        });
    });

    // Media gallery items - DISABLED
    /*
    document.querySelectorAll('.media-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const allMedia = Array.from(document.querySelectorAll('.media-item'));
            const index = allMedia.indexOf(item);
            const bgImage = item.querySelector('.media-image')?.style.backgroundImage;
            // Fallback to img tag if background image is not set/found (the provided code used img tags inside media-item)
            const imgTag = item.querySelector('img');
            const src = bgImage ? bgImage.match(/url\(["']?([^"']+)["']?\)/)?.[1] : (imgTag ? imgTag.src : item.href);

            if (src) {
                openLightboxImage(src, allMedia.map(m => {
                    const bg = m.querySelector('.media-image')?.style.backgroundImage;
                    const img = m.querySelector('img');
                    return bg ? bg.match(/url\(["']?([^"']+)["']?\)/)?.[1] : (img ? img.src : m.href);
                }), index);
            }
        });
    });
    */

    // NEW: Local Video Click Listener
    document.querySelectorAll('[data-local-video]').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const videoSrc = item.getAttribute('data-local-video');
            if (videoSrc && lightboxLocalVideo) {
                // Open Local Video Logic
                lightboxVideo.classList.remove('active');
                lightboxVideo.style.display = 'none';
                lightboxVideo.src = '';

                if (lightboxImage) {
                    lightboxImage.classList.remove('active');
                    lightboxImage.style.display = 'none';
                }

                lightboxLocalVideo.src = videoSrc;
                lightboxLocalVideo.style.display = 'block';
                lightboxLocalVideo.classList.add('active');

                lightbox.classList.add('active');
                lightbox.style.display = ''; // Clear inline display:none from close logic
                document.body.style.overflow = 'hidden';

                lightboxPrev.style.display = 'none';
                lightboxNext.style.display = 'none';

                lightboxLocalVideo.play().catch(e => console.error("Error playing local video", e));
            }
        });
    });

    // Close button
    lightboxClose.addEventListener('click', closeLightbox);

    // Close on background click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            prevImage();
        } else if (e.key === 'ArrowRight') {
            nextImage();
        }
    });

    // Navigation buttons
    lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        prevImage();
    });

    lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation();
        nextImage();
    });
}

// Slideshow Background
function initSlideshow() {
    const slideshow = document.querySelector('.slideshow-background');
    if (!slideshow) return;

    const slides = slideshow.querySelectorAll('.slideshow-slide');
    if (slides.length === 0) return;

    let currentSlide = 0;
    const slideDuration = 3000; // 3 seconds
    const transitionDuration = 299; // 299ms transition

    function nextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }

    // Start slideshow
    if (slides.length > 1) {
        setInterval(nextSlide, slideDuration);
    } else if (slides.length === 1) {
        slides[0].classList.add('active');
    }
}

// YouTube Video Integration
function initYouTubeVideos() {
    // Play button in hero (tablet)
    document.querySelectorAll('.play-btn[data-youtube-id]').forEach(btn => {
        btn.addEventListener('click', () => {
            const youtubeId = btn.getAttribute('data-youtube-id');
            openYouTubeLightbox(youtubeId);
        });
    });

    // Video placeholders in features
    document.querySelectorAll('.video-play-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const wrapper = btn.closest('.video-wrapper');
            const youtubeId = wrapper.getAttribute('data-youtube-id');
            const start = parseInt(wrapper.getAttribute('data-start')) || 0;
            const end = parseInt(wrapper.getAttribute('data-end')) || 0;

            if (youtubeId) {
                openYouTubeLightbox(youtubeId, start, end);
            }
        });
    });
}

// Open YouTube video in lightbox
// Open YouTube video in lightbox
function openYouTubeLightbox(youtubeId, start = 0, end = 0) {
    const lightbox = document.getElementById('lightbox');
    const lightboxVideo = lightbox.querySelector('.lightbox-video');
    // const lightboxImage = lightbox.querySelector('.lightbox-image'); // REMOVED
    const lightboxPrev = lightbox.querySelector('.lightbox-prev');
    const lightboxNext = lightbox.querySelector('.lightbox-next');

    let url = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=0&loop=1&playlist=${youtubeId}`;
    if (start > 0) url += `&start=${start}`;
    if (end > 0) url += `&end=${end}`;

    lightboxVideo.src = url;
    lightboxVideo.classList.add('active');
    // lightboxImage.classList.remove('active'); // REMOVED
    lightbox.classList.add('active');
    lightbox.style.display = ''; // Fix re-opening bug
    document.body.style.overflow = 'hidden';

    lightboxPrev.style.display = 'none';
    lightboxNext.style.display = 'none';
}

// Open Local Video in lightbox
function openLocalVideo(videoSrc) {
    const lightbox = document.getElementById('lightbox');
    const lightboxVideo = lightbox.querySelector('.lightbox-video');
    const lightboxLocalVideo = lightbox.querySelector('.lightbox-local-video');
    const lightboxImage = lightbox.querySelector('.lightbox-image');
    const lightboxPrev = lightbox.querySelector('.lightbox-prev');
    const lightboxNext = lightbox.querySelector('.lightbox-next');

    // Hide iframe, show local video
    lightboxVideo.classList.remove('active');
    lightboxVideo.src = '';
    lightboxImage.classList.remove('active');

    lightboxLocalVideo.src = videoSrc;
    lightboxLocalVideo.style.display = 'block';
    lightboxLocalVideo.classList.add('active');

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';

    lightboxPrev.style.display = 'none';
    lightboxNext.style.display = 'none';

    // Play the video
    lightboxLocalVideo.play().catch(e => console.error("Error playing local video", e));
}

// Update closeLightbox to handle local video
function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxLocalVideo = lightbox.querySelector('.lightbox-local-video');

    lightbox.classList.remove('active');
    document.body.style.overflow = '';

    // const lightboxImage = lightbox.querySelector('.lightbox-image'); // REMOVED
    const lightboxVideo = lightbox.querySelector('.lightbox-video');

    // lightboxImage.classList.remove('active'); // REMOVED
    lightboxVideo.classList.remove('active');
    lightboxVideo.src = '';

    if (lightboxLocalVideo) {
        lightboxLocalVideo.pause();
        lightboxLocalVideo.src = '';
        lightboxLocalVideo.style.display = 'none';
    }

    setTimeout(() => {
        if (!lightbox.classList.contains('active')) {
            lightbox.style.display = 'none';
        }
    }, 300);
}

// Ensure initLightbox exposes these or just add event listeners separately if possible,
// but since this is inside initLightbox scope in the original file, we need to be careful.
// The original file has `function closeLightbox` inside `initLightbox`.
// I will need to replace the `initLightbox` function content carefully or overwrite the logic.
// Actually, looking at the file provided, `initLightbox` contains all definitions.
// I should probably inject the event listener for local video at the end of `initLightbox` or outside if I can't access internal scope.
// Wait, `initLightbox` is a function. I'm editing `openYouTubeLightbox` which is global? No, `openYouTubeLightbox` is global-ish (defined at top level in lines 263).
// Let's check `main.js` again. `openYouTubeLightbox` (line 263) IS defined at top level scope, NOT inside `initLightbox`. `initLightbox` is lines 59-209.
// So I can add `openLocalVideo` at the top level and update `closeLightbox`... wait `closeLightbox` IS inside `initLightbox` (line 112).
// This is tricky. `closeLightbox` is scoped to `initLightbox`. The global `openYouTubeLightbox` does its own lightbox manipulation.
// It seems `initLightbox` attaches the click handler for close button which calls the scoped `closeLightbox`.
// But `openYouTubeLightbox` just manipulates DOM elements directly.
// The correct approach is to update `initLightbox` to handle the new local video element OR just handle it purely via global function if I can hook into the close button.
// The existing `closeLightbox` inside `initLightbox` (line 112) won't know about `lightboxLocalVideo` unless I update it.
// And `lightboxClose` button click calls that scoped function.
// So I MUST update `initLightbox` to include `lightboxLocalVideo` handling.

// Let's re-read `main.js` lines 59-123.


// Video Backgrounds
function initVideoBackgrounds() {
    const videos = document.querySelectorAll('video[autoplay]');

    videos.forEach(video => {
        // Ensure video plays
        const playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log('Video autoplay prevented:', error);
            });
        }

        // Handle video errors
        video.addEventListener('error', () => {
            console.error('Video error:', video.src);
        });

        // Restart video when it ends (for loop)
        video.addEventListener('ended', () => {
            if (video.hasAttribute('loop')) {
                video.currentTime = 0;
                video.play();
            }
        });
    });

    // Special handling for welcome video
    const welcomeVideo = document.querySelector('.welcome-video');
    if (welcomeVideo) {
        const isEdge = /Edg|Edge/.test(navigator.userAgent);

        function playVideo() {
            if (!welcomeVideo) return;
            if (isEdge && welcomeVideo.readyState < 3) {
                setTimeout(() => {
                    if (welcomeVideo.readyState >= 3) playVideo();
                }, 300);
                return;
            }
            if (!welcomeVideo.paused && !welcomeVideo.ended) return;

            welcomeVideo.muted = true;
            const playPromise = welcomeVideo.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        if (isEdge && welcomeVideo.paused) {
                            setTimeout(() => {
                                welcomeVideo.play().catch(() => { });
                            }, 200);
                        }
                    })
                    .catch(() => {
                        if (isEdge) {
                            setTimeout(() => {
                                welcomeVideo.muted = true;
                                welcomeVideo.play().catch(() => { });
                            }, 800);
                        }
                    });
            }
        }

        if (isEdge) welcomeVideo.load();

        welcomeVideo.addEventListener('error', () => {
            if (welcomeVideo.error && welcomeVideo.error.code === welcomeVideo.error.MEDIA_ERR_DECODE) {
                console.error('Video codec not supported');
            }
        });

        ['loadeddata', 'canplay', 'canplaythrough'].forEach(eventType => {
            welcomeVideo.addEventListener(eventType, () => {
                if (isEdge) {
                    setTimeout(() => {
                        if (welcomeVideo.readyState >= 2) playVideo();
                    }, 150);
                } else {
                    playVideo();
                }
            });
        });

        welcomeVideo.addEventListener('loadedmetadata', () => {
            if (isEdge && welcomeVideo.readyState >= 2) {
                setTimeout(playVideo, 200);
            } else {
                playVideo();
            }
        });

        welcomeVideo.addEventListener('pause', () => {
            if (!welcomeVideo.ended) {
                setTimeout(() => {
                    if (welcomeVideo.paused) playVideo();
                }, 100);
            }
        });

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                if (isEdge) {
                    setTimeout(() => {
                        welcomeVideo.load();
                        setTimeout(playVideo, 500);
                    }, 200);
                } else {
                    playVideo();
                }
            });
        } else {
            if (isEdge) {
                setTimeout(() => {
                    welcomeVideo.load();
                    setTimeout(playVideo, 500);
                }, 200);
            } else {
                playVideo();
            }
        }

        if (isEdge) {
            welcomeVideo.addEventListener('stalled', () => {
                setTimeout(() => {
                    if (welcomeVideo.paused && !welcomeVideo.ended) playVideo();
                }, 500);
            });
        }

        ['click', 'touchstart', 'keydown'].forEach(eventType => {
            document.addEventListener(eventType, () => {
                if (welcomeVideo && !welcomeVideo.ended) {
                    if (isEdge) {
                        welcomeVideo.muted = true;
                        welcomeVideo.load();
                        setTimeout(playVideo, 100);
                    } else {
                        playVideo();
                    }
                }
            }, { once: true, passive: true });
        });
    }
}

// Newsletter Form
function initNewsletterForm() {
    const form = document.getElementById('newsletter-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = form.querySelector('input[type="email"]').value;
        const terms = form.querySelector('input[type="checkbox"]').checked;

        if (!terms) {
            alert('Please accept the Privacy Policy to continue.');
            return;
        }

        // Here you would typically send the data to your server
        console.log('Newsletter signup:', { email, terms });

        // Show success message (you can customize this)
        alert('Thank you for subscribing!');
        form.reset();
    });
}

// Character Video Hover Effect
// Character Video Hover Effect
function initCharacterHoverEffects() {
    const characterCards = document.querySelectorAll('.character-card');

    if (!characterCards.length) return;

    characterCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Remove active class from all cards
            characterCards.forEach(c => c.classList.remove('active'));
            // Add active class to current card
            card.classList.add('active');
        });
    });
}
