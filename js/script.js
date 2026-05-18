/* OdontoClean — main.js */

document.addEventListener('DOMContentLoaded', () => {

    /* ─── HEADER SCROLL ─── */
    const body   = document.body;
    const header = document.getElementById('header');

    const onScroll = () => {
        if (window.scrollY > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();


    /* ─── MOBILE MENU ─── */
    const hamburger = document.getElementById('hamburger');
    const navMenu   = document.getElementById('nav-menu');

    hamburger.addEventListener('click', () => {
        const open = navMenu.classList.toggle('open');
        hamburger.classList.toggle('open', open);
        hamburger.setAttribute('aria-expanded', open);
        body.style.overflow = open ? 'hidden' : '';
    });

    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('open');
            hamburger.classList.remove('open');
            hamburger.setAttribute('aria-expanded', 'false');
            body.style.overflow = '';
        });
    });


    /* ─── SMOOTH SCROLL ─── */
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            const id = link.getAttribute('href').slice(1);
            const target = document.getElementById(id);
            if (!target) return;
            e.preventDefault();
            const offset = header.offsetHeight;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });


    /* ─── PARTICLES ─── */
    const particlesEl = document.getElementById('particles');
    const PARTICLE_COUNT = 40;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        const size = Math.random() * 3 + 1;
        p.style.cssText = `
            left:${Math.random() * 100}%;
            bottom:${Math.random() * -20}%;
            width:${size}px;
            height:${size}px;
            opacity:${Math.random() * .5 + .1};
            animation-duration:${Math.random() * 14 + 8}s;
            animation-delay:${Math.random() * -20}s;
        `;
        particlesEl.appendChild(p);
    }


    /* ─── INTERSECTION OBSERVER (reveal) ─── */
    const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => observer.observe(el));


    /* ─── COUNTER ANIMATION ─── */
    const counters = document.querySelectorAll('.count[data-target]');

    const countObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const target = +el.dataset.target;
            const duration = 1800;
            const start = performance.now();

            const tick = (now) => {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                const ease = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
                el.textContent = Math.floor(ease * target);
                if (progress < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
            countObserver.unobserve(el);
        });
    }, { threshold: 0.5 });

    counters.forEach(c => countObserver.observe(c));


    /* ─── 3D TILT (service cards) ─── */
    document.querySelectorAll('.js-tilt').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const cx = rect.width  / 2;
            const cy = rect.height / 2;
            const rotX =  (y - cy) / cy * 8;
            const rotY = -(x - cx) / cx * 8;
            card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02) translateZ(8px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transition = 'transform 0.45s cubic-bezier(.4,0,.2,1)';
            card.style.transform  = 'perspective(900px) rotateX(0) rotateY(0) scale(1) translateZ(0)';
            setTimeout(() => { card.style.transition = ''; }, 450);
        });

        card.addEventListener('mouseenter', () => {
            card.style.transition = 'transform 0.1s ease';
        });
    });


    /* ─── TESTIMONIALS CAROUSEL ─── */
    const track   = document.getElementById('testi-track');
    const dots    = document.querySelectorAll('.tdot');
    const prevBtn = document.getElementById('testi-prev');
    const nextBtn = document.getElementById('testi-next');
    const cardCount = track ? track.children.length : 0;
    let current = 0;
    let autoInterval;

    function goTo(idx) {
        current = (idx + cardCount) % cardCount;
        track.style.transform = `translateX(-${current * 100}%)`;
        dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }

    function startAuto() {
        clearInterval(autoInterval);
        autoInterval = setInterval(() => goTo(current + 1), 4500);
    }

    if (track && cardCount > 0) {
        nextBtn.addEventListener('click', () => { goTo(current + 1); startAuto(); });
        prevBtn.addEventListener('click', () => { goTo(current - 1); startAuto(); });

        dots.forEach(dot => {
            dot.addEventListener('click', () => { goTo(+dot.dataset.idx); startAuto(); });
        });

        let tx = 0;
        track.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
        track.addEventListener('touchend', e => {
            const diff = tx - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) { goTo(current + (diff > 0 ? 1 : -1)); startAuto(); }
        });

        startAuto();
    }


    /* ─── HERO PARALLAX ─── */
    const heroSection = document.querySelector('.hero');
    window.addEventListener('scroll', () => {
        if (!heroSection) return;
        const y = window.scrollY;
        const orbs = heroSection.querySelectorAll('.orb');
        orbs.forEach((orb, i) => {
            const speed = 0.08 + i * 0.04;
            orb.style.transform = `translateY(${y * speed}px)`;
        });
    }, { passive: true });


    /* ─── MAP LAZY LOAD ─── */
    const mapContainer = document.getElementById('map-container');

    if (mapContainer) {
        const mapObserver = new IntersectionObserver((entries) => {
            if (!entries[0].isIntersecting) return;
            mapContainer.innerHTML = `
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.01!2d-46.6548!3d-23.5614!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDMzJzQxLjAiUyA0NsKwMzknMTcuMyJX!5e0!3m2!1spt-BR!2sbr!4v1714000000000"
                    title="Localização da clínica"
                    loading="lazy"
                    allowfullscreen>
                </iframe>`;
            mapObserver.disconnect();
        }, { threshold: 0.1 });

        mapObserver.observe(mapContainer);
    }

});
