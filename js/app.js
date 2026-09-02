/**
 * THE WEDDING OF SEONGHYEON & RIANA (김성현 ♥ RIANA)
 * Korean Aesthetic Digital Wedding Invitation
 */

document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------
    // 1. URL Parameter Parser for Custom Guest Name (?to=Nama Tamu)
    // -------------------------------------------------------------
    function getGuestNameFromUrl() {
        // Support standard search params as well as hash query params
        const searchStr = window.location.search || (window.location.hash.includes('?') ? window.location.hash.substring(window.location.hash.indexOf('?')) : '');
        const params = new URLSearchParams(searchStr);
        
        // Check multiple common param aliases (case-insensitive)
        let name = null;
        for (const [key, value] of params.entries()) {
            const lowerKey = key.toLowerCase();
            if (['to', 'nama', 'u', 'guest', 'n', 'kepada'].includes(lowerKey)) {
                name = value;
                break;
            }
        }
        
        if (name && name.trim() !== '') {
            try {
                // Decode URI components and replace '+' or '_' with spaces
                return decodeURIComponent(name.replace(/\+/g, ' ').replace(/_/g, ' ')).trim();
            } catch (e) {
                return name.replace(/\+/g, ' ').replace(/_/g, ' ').trim();
            }
        }
        return null;
    }

    const guestNameDisplay = document.getElementById('guest-name-display');
    const guestInput = document.getElementById('guest-name');
    const guestName = getGuestNameFromUrl();

    if (guestName) {
        if (guestNameDisplay) {
            guestNameDisplay.textContent = guestName;
        }
        if (guestInput) {
            guestInput.value = guestName;
        }
        // Update document title for personalized sharing
        document.title = `The Wedding of Seonghyeon & Riana - Kepada Yth. ${guestName}`;
    }


    // -------------------------------------------------------------
    // 2. Cover / Envelope Opening & Audio Autoplay
    // -------------------------------------------------------------
    const coverModal = document.getElementById('cover-modal');
    const btnOpenInvitation = document.getElementById('btn-open-invitation');
    const bgAudio = document.getElementById('bg-audio');
    const musicBtn = document.getElementById('music-toggle');
    let isAudioPlaying = false;

    if (btnOpenInvitation && coverModal) {
        btnOpenInvitation.addEventListener('click', () => {
            coverModal.classList.add('opened');
            document.body.style.overflow = 'auto';

            // Play background music
            if (bgAudio) {
                bgAudio.play().then(() => {
                    isAudioPlaying = true;
                    if (musicBtn) musicBtn.classList.add('playing');
                }).catch(err => {
                    console.log('Audio autoplay prevented by browser policy:', err);
                });
            }

            // Trigger active state on hero
            const heroSection = document.getElementById('hero');
            if (heroSection) heroSection.classList.add('active');
        });
    }

    // Music toggle button
    if (musicBtn && bgAudio) {
        musicBtn.addEventListener('click', () => {
            if (isAudioPlaying) {
                bgAudio.pause();
                musicBtn.classList.remove('playing');
                isAudioPlaying = false;
                showToast('Musik dijeda');
            } else {
                bgAudio.play().then(() => {
                    musicBtn.classList.add('playing');
                    isAudioPlaying = true;
                    showToast('Musik diputar');
                }).catch(err => console.log(err));
            }
        });
    }

    // -------------------------------------------------------------
    // 3. Countdown Timer (Target: 10 Oktober 2026 07:00 WIB)
    // -------------------------------------------------------------
    const targetDate = new Date('2026-10-10T07:00:00+07:00').getTime();
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    const ddayCounterText = document.getElementById('dday-counter-text');

    function updateCountdown() {
        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference <= 0) {
            if (daysEl) daysEl.textContent = '00';
            if (hoursEl) hoursEl.textContent = '00';
            if (minutesEl) minutesEl.textContent = '00';
            if (secondsEl) secondsEl.textContent = '00';
            if (ddayCounterText) ddayCounterText.textContent = 'D-Day (Hari Bahagia)';
            return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
        if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
        if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
        if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');

        if (ddayCounterText) {
            ddayCounterText.textContent = `D-${days}`;
        }
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    // -------------------------------------------------------------
    // 4. Save to Google Calendar
    // -------------------------------------------------------------
    const btnAddCalendar = document.getElementById('btn-add-calendar');
    if (btnAddCalendar) {
        btnAddCalendar.addEventListener('click', () => {
            const title = encodeURIComponent('The Wedding of Seonghyeon & Riana (김성현 ♥ RIANA)');
            const details = encodeURIComponent('Pernikahan Kim Seong-hyeon & Riana\nLokasi: Puri Cinere Mosque / Grand Hall\nWaktu: 07:00 - 14:00 WIB');
            const location = encodeURIComponent('Puri Cinere Mosque, Jl. Lembah Pinus, Pangkalan Jati, Kec. Cinere, Kota Depok, Jawa Barat 16514');
            const dates = '20261010T000000Z/20261010T070000Z'; // UTC equivalent
            const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
            window.open(gCalUrl, '_blank');
        });
    }

    // -------------------------------------------------------------
    // 5. Copy to Clipboard with Toast Notification
    // -------------------------------------------------------------
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    let toastTimeout;

    function showToast(msg) {
        if (!toast || !toastMessage) return;
        toastMessage.textContent = msg;
        toast.classList.add('show');
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // Copy Account Numbers & Addresses
    document.querySelectorAll('.btn-copy-acc').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const label = btn.getAttribute('data-label') || 'Teks';
            const targetEl = document.getElementById(targetId);
            
            if (targetEl) {
                const textToCopy = targetEl.textContent.trim();
                navigator.clipboard.writeText(textToCopy).then(() => {
                    showToast(`${label} berhasil disalin!`);
                }).catch(() => {
                    showToast('Gagal menyalin teks');
                });
            }
        });
    });

    // Copy Venue Address
    const btnCopyAddress = document.getElementById('btn-copy-address');
    if (btnCopyAddress) {
        btnCopyAddress.addEventListener('click', () => {
            const addressText = document.getElementById('venue-address-text').textContent.trim();
            navigator.clipboard.writeText(addressText).then(() => {
                showToast('Alamat berhasil disalin ke clipboard!');
            }).catch(() => {
                showToast('Gagal menyalin alamat');
            });
        });
    }

    // -------------------------------------------------------------
    // 6. Photo Gallery Lightbox Modal
    // -------------------------------------------------------------
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');

    const galleryImages = [
        'https://images.theirmood.com/resources/129210/card/aTVCJKyACd/GZV9WA5pjL.JPG?f=webp&w=1280',
        'https://images.theirmood.com/resources/129210/card/aTVCJKyACd/KSpGhIaC4s.JPG?f=webp&w=1280',
        'https://images.theirmood.com/resources/129210/card/aTVCJKyACd/jZGjtHF8DM.JPG?f=webp&w=1280',
        'https://images.theirmood.com/resources/129210/card/aTVCJKyACd/bUIhkQIrtP.JPG?f=webp&w=1280'
    ];
    let currentGalleryIndex = 0;

    function openLightbox(index) {
        currentGalleryIndex = index;
        if (lightboxImg) lightboxImg.src = galleryImages[currentGalleryIndex];
        if (lightboxModal) {
            lightboxModal.classList.add('active');
            lightboxModal.setAttribute('aria-hidden', 'false');
        }
    }

    function closeLightbox() {
        if (lightboxModal) {
            lightboxModal.classList.remove('active');
            lightboxModal.setAttribute('aria-hidden', 'true');
        }
    }

    function showPrevImage() {
        currentGalleryIndex = (currentGalleryIndex - 1 + galleryImages.length) % galleryImages.length;
        if (lightboxImg) lightboxImg.src = galleryImages[currentGalleryIndex];
    }

    function showNextImage() {
        currentGalleryIndex = (currentGalleryIndex + 1) % galleryImages.length;
        if (lightboxImg) lightboxImg.src = galleryImages[currentGalleryIndex];
    }

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const index = parseInt(item.getAttribute('data-index'), 10);
            openLightbox(index);
        });
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener('click', (e) => { e.stopPropagation(); showPrevImage(); });
    if (lightboxNext) lightboxNext.addEventListener('click', (e) => { e.stopPropagation(); showNextImage(); });

    if (lightboxModal) {
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal || e.target.classList.contains('lightbox-content')) {
                closeLightbox();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (!lightboxModal || !lightboxModal.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrevImage();
        if (e.key === 'ArrowRight') showNextImage();
    });

    // -------------------------------------------------------------
    // 7. Interactive Guestbook & RSVP with Google Sheets Integration
    // -------------------------------------------------------------
    // TEMPELKAN URL DEPLOYMENT WEB APP GOOGLE APPS SCRIPT ANDA DI SINI:
    const GOOGLE_SCRIPT_URL = ""; 

    const rsvpForm = document.getElementById('rsvp-form');
    const wishesList = document.getElementById('wishes-list');
    const wishesCount = document.getElementById('wishes-count');
    const btnSubmitRsvp = document.querySelector('.btn-submit-rsvp');

    // Default fallback demo wishes
    const defaultWishes = [
        {
            name: 'Keluarga Besar Kim (Seoul)',
            attendance: 'Hadir',
            message: '결혼을 진심으로 축하드립니다! 두 분 앞날에 언제나 사랑과 행복이 가득하기를 기원합니다. Selamat berbahagia Seonghyeon & Riana!',
            time: 'Baru saja'
        },
        {
            name: 'Andi & Sarah',
            attendance: 'Hadir',
            message: 'Selamat menempuh hidup baru Riana & Seonghyeon! Semoga senantiasa sakinah, mawaddah, warahmah. Sangat bahagia mendengar kabar pernikahan kalian! ❤️',
            time: '1 jam yang lalu'
        },
        {
            name: 'Min-ji Park',
            attendance: 'Tidak Hadir',
            message: '한국에서 진심 어린 축하의 마음을 보냅니다. 인도네시아에서 올리는 예식 멋지게 잘 치르시길 바랍니다! 축하해요 🎉',
            time: '3 jam yang lalu'
        },
        {
            name: 'Budi Santoso & Keluarga',
            attendance: 'Hadir',
            message: 'Selamat untuk kedua mempelai dan keluarga besar! Semoga pernikahannya diberkahi kebahagiaan hingga maut memisahkan.',
            time: '5 jam yang lalu'
        }
    ];

    let storedWishes = JSON.parse(localStorage.getItem('wedding_wishes_seonghyeon_riana')) || defaultWishes;

    function renderWishes() {
        if (!wishesList) return;
        wishesList.innerHTML = '';

        if (wishesCount) wishesCount.textContent = storedWishes.length;

        storedWishes.forEach(wish => {
            const item = document.createElement('div');
            item.className = 'wish-item';

            let statusClass = 'status-hadir';
            if (wish.attendance === 'Tidak Hadir') statusClass = 'status-tidak';
            if (wish.attendance === 'Masih Ragu') statusClass = 'status-ragu';

            item.innerHTML = `
                <div class="wish-head">
                    <span class="wish-author">${escapeHtml(wish.name)}</span>
                    <span class="wish-status ${statusClass}">${escapeHtml(wish.attendance)}</span>
                </div>
                <p class="wish-text">${escapeHtml(wish.message)}</p>
                <span class="wish-time"><i class="fa-regular fa-clock"></i> ${escapeHtml(wish.time)}</span>
            `;
            wishesList.appendChild(item);
        });
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Fetch live wishes from Google Sheets if URL is configured
    async function loadWishesFromGoogleSheet() {
        if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL.trim() === '') return;

        try {
            const response = await fetch(GOOGLE_SCRIPT_URL);
            if (response.ok) {
                const data = await response.json();
                if (Array.isArray(data) && data.length > 0) {
                    storedWishes = data.map(item => ({
                        name: item.name || 'Tamu',
                        attendance: item.attendance || 'Hadir',
                        message: item.message || '',
                        time: item.time || item.timestamp || 'Baru saja'
                    }));
                    localStorage.setItem('wedding_wishes_seonghyeon_riana', JSON.stringify(storedWishes));
                    renderWishes();
                }
            }
        } catch (err) {
            console.log('Using local wishes cache (Google Sheet fetch skipped/offline):', err);
        }
    }

    if (rsvpForm) {
        rsvpForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const nameInput = document.getElementById('guest-name');
            const attendInput = document.getElementById('guest-attendance');
            const paxInput = document.getElementById('guest-pax');
            const messageInput = document.getElementById('guest-message');

            const newWish = {
                name: nameInput.value.trim(),
                attendance: attendInput.value,
                pax: paxInput ? paxInput.value : '1',
                message: messageInput.value.trim(),
                time: 'Baru saja',
                timestamp: new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })
            };

            // Immediate UI update
            storedWishes.unshift(newWish);
            localStorage.setItem('wedding_wishes_seonghyeon_riana', JSON.stringify(storedWishes));
            renderWishes();

            const originalBtnText = btnSubmitRsvp ? btnSubmitRsvp.innerHTML : '';
            if (btnSubmitRsvp) {
                btnSubmitRsvp.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>Mengirimkan...</span>';
                btnSubmitRsvp.disabled = true;
            }

            // Send to Google Sheets via Google Apps Script (if configured)
            if (GOOGLE_SCRIPT_URL && GOOGLE_SCRIPT_URL.trim() !== '') {
                try {
                    await fetch(GOOGLE_SCRIPT_URL, {
                        method: 'POST',
                        mode: 'no-cors', // standard for Google Apps Script Web App
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(newWish)
                    });
                } catch (error) {
                    console.warn('GSheet submit error:', error);
                }
            }

            if (btnSubmitRsvp) {
                btnSubmitRsvp.innerHTML = originalBtnText;
                btnSubmitRsvp.disabled = false;
            }

            messageInput.value = '';
            showToast('Doa & Ucapan Anda berhasil terkirim. Terima kasih! 🌸');
        });
    }

    renderWishes();
    loadWishesFromGoogleSheet();


    // -------------------------------------------------------------
    // 8. Intersection Observer for Scroll Reveal Animations
    // -------------------------------------------------------------
    const revealElements = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback for older browsers
        revealElements.forEach(el => el.classList.add('active'));
    }

    // -------------------------------------------------------------
    // 9. Falling Flower Petals (Sakura Effect - Cover Screen Only)
    // -------------------------------------------------------------
    const canvas = document.getElementById('falling-petals-canvas');
    let petalAnimationId = null;
    let stopPetalAnimation = null;

    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        const petals = [];
        const petalCount = window.innerWidth < 768 ? 24 : 36;

        const colors = [
            { r: 255, g: 215, b: 220 }, // soft blush pink
            { r: 255, g: 195, b: 205 }, // sakura pink
            { r: 252, g: 236, b: 238 }, // light ivory rose
            { r: 245, g: 186, b: 196 }, // gentle rose
            { r: 255, g: 230, b: 232 }  // delicate white-pink
        ];

        class Petal {
            constructor() {
                this.reset(true);
            }

            reset(initial = false) {
                this.x = Math.random() * width;
                this.y = initial ? Math.random() * height : -25 - Math.random() * 40;
                this.size = 11 + Math.random() * 10;
                // Pure vertical downward velocity with gentle drift
                this.speedY = 0.9 + Math.random() * 1.3;
                this.speedX = (Math.random() - 0.5) * 0.4;
                this.angle = Math.random() * Math.PI * 2;
                this.angularSpeed = (Math.random() - 0.5) * 0.02;
                this.flip = Math.random() * Math.PI;
                this.flipSpeed = 0.015 + Math.random() * 0.025;
                this.swaySpeed = 0.018 + Math.random() * 0.015;
                this.swayAngle = Math.random() * Math.PI * 2;
                this.opacity = 0.6 + Math.random() * 0.35;
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }

            update() {
                this.y += this.speedY;
                this.swayAngle += this.swaySpeed;
                // Gentle vertical flutter without drifting sideways too much
                this.x += Math.sin(this.swayAngle) * 0.55 + this.speedX;

                this.angle += this.angularSpeed;
                this.flip += this.flipSpeed;

                // Reset when petal falls below screen
                if (this.y > height + 30 || this.x < -30 || this.x > width + 30) {
                    this.reset(false);
                }
            }

            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.angle);
                ctx.scale(Math.sin(this.flip), 1);

                const gradient = ctx.createRadialGradient(
                    0, 0, 0,
                    0, 0, this.size
                );
                gradient.addColorStop(0, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.opacity})`);
                gradient.addColorStop(0.7, `rgba(${this.color.r}, ${this.color.g - 15}, ${this.color.b - 15}, ${this.opacity * 0.85})`);
                gradient.addColorStop(1, `rgba(${this.color.r - 10}, ${this.color.g - 25}, ${this.color.b - 25}, 0.2)`);

                ctx.fillStyle = gradient;
                ctx.beginPath();
                
                // Draw realistic organic petal shape
                ctx.moveTo(0, 0);
                ctx.bezierCurveTo(
                    -this.size * 0.6, -this.size * 0.8,
                    -this.size * 0.8, -this.size * 1.5,
                    0, -this.size * 2
                );
                ctx.bezierCurveTo(
                    this.size * 0.8, -this.size * 1.5,
                    this.size * 0.6, -this.size * 0.8,
                    0, 0
                );

                ctx.fill();
                ctx.restore();
            }
        }

        // Initialize petals
        for (let i = 0; i < petalCount; i++) {
            petals.push(new Petal());
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);
            petals.forEach(petal => {
                petal.update();
                petal.draw();
            });
            petalAnimationId = requestAnimationFrame(animate);
        }

        animate();

        // Handle Resize
        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });
    }
});

