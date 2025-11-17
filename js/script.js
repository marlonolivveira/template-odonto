document.addEventListener('DOMContentLoaded', () => {

    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"], .logo[href^="#"], .btn[href^="#"]');

    // Fechar menu ao clicar em qualquer link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Close mobile menu on link click
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
            }

            const href = this.getAttribute('href');
            // Ensure it's an internal link
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    const headerOffset = document.querySelector('.header').offsetHeight;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Swipe no carrossel de serviços (mobile)
    const swipeArea = document.querySelector('.services-grid');
    let startX = 0;
    let scrollStart = 0;
    let isSwiping = false;

    swipeArea.addEventListener('touchstart', (e) => {
        isSwiping = true;
        startX = e.touches[0].clientX;
        scrollStart = swipeArea.scrollLeft;
    });

    swipeArea.addEventListener('touchmove', (e) => {
        if (!isSwiping) return;
        const x = e.touches[0].clientX;
        const walk = (x - startX) * 1.5;
        swipeArea.scrollLeft = scrollStart - walk;
    });

    swipeArea.addEventListener('touchend', () => {
        isSwiping = false;
    });

    // Intersection Observer for fade-in animations on scroll
    const sections = document.querySelectorAll('section');

    const observerOptions = {
        root: null, // relative to the viewport
        rootMargin: '0px',
        threshold: 0.1 // 10% of the item is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add a class to the element to trigger the animation
                entry.target.classList.add('visible');
                // Stop observing the element once it's visible
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe each section
    sections.forEach(section => {
        observer.observe(section);
    });

    // Theme switcher logic
    const themeToggleButton = document.getElementById('theme-toggle-button');
    const body = document.body;

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.classList.add(savedTheme);
    }

    themeToggleButton.addEventListener('click', () => {
        if (body.classList.contains('dark-mode')) {
            body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light-mode');
        } else {
            body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark-mode');
        }
    });

    // Services Carousel (Manual Control, Infinite Loop)
    const servicesGrid = document.querySelector('.services-grid');
    const serviceCards = document.querySelectorAll('.service-card');
    const cardCount = serviceCards.length;
    let serviceIndex = 0;

    // Clone cards for infinite loop effect
    serviceCards.forEach(card => {
        servicesGrid.appendChild(card.cloneNode(true));
    });

    const prevButton = document.getElementById('prev-service');
    const nextButton = document.getElementById('next-service');

    function updateCarouselPosition() {
        servicesGrid.style.transition = 'transform 0.5s ease-in-out';
        const offset = -serviceIndex * (serviceCards[0].offsetWidth + 25);
        servicesGrid.style.transform = `translateX(${offset}px)`;
    }

    prevButton.addEventListener('click', () => {
        if (serviceIndex === 0) {
            serviceIndex = cardCount;
            const offset = -serviceIndex * (serviceCards[0].offsetWidth + 25);
            servicesGrid.style.transition = 'none';
            servicesGrid.style.transform = `translateX(${offset}px)`;
            setTimeout(() => {
                serviceIndex--;
                servicesGrid.style.transition = 'transform 0.5s ease-in-out';
                const offset = -serviceIndex * (serviceCards[0].offsetWidth + 25);
                servicesGrid.style.transform = `translateX(${offset}px)`;
            }, 20);
        } else {
            serviceIndex--;
            const offset = -serviceIndex * (serviceCards[0].offsetWidth + 25);
            servicesGrid.style.transform = `translateX(${offset}px)`;
        }
    });

    nextButton.addEventListener('click', () => {
        serviceIndex++;
        servicesGrid.style.transition = 'transform 0.5s ease-in-out';
        const offset = -serviceIndex * (serviceCards[0].offsetWidth + 25);
        servicesGrid.style.transform = `translateX(${offset}px)`;

        if (serviceIndex === cardCount) {
            setTimeout(() => {
                servicesGrid.style.transition = 'none';
                servicesGrid.style.transform = 'translateX(0)';
                serviceIndex = 0;
            }, 500);
        }
    });

    // Testimonials Carousel (Infinite Scroll)
    const carousel = document.querySelector('.testimonials-grid');
    const cards = carousel.querySelectorAll('.testimonial-card');
    const testimonialCardCount = cards.length;
    let currentIndex = 0;

    // Clone cards for infinite loop effect
    cards.forEach(card => {
        carousel.appendChild(card.cloneNode(true));
    });

    function showNext() {
        currentIndex++;
        carousel.style.transition = 'transform 0.5s ease-in-out';
        const offset = -currentIndex * (cards[0].offsetWidth + 20); // +20 for margin
        carousel.style.transform = `translateX(${offset}px)`;

        // Reset to the beginning when it reaches the end of the cloned part
        if (currentIndex === testimonialCardCount) {
            setTimeout(() => {
                carousel.style.transition = 'none';
                carousel.style.transform = 'translateX(0)';
                currentIndex = 0;
            }, 500); // Wait for the transition to finish
        }
    }

    setInterval(showNext, 3000);

    // Parallax effect on hero section
    const heroSection = document.querySelector('.hero-section');
    window.addEventListener('scroll', () => {
        const scrollPosition = window.pageYOffset;
        heroSection.style.backgroundPositionY = scrollPosition * 0.5 + 'px';
    });

    // Embed Google Map after a short delay to not block initial page load
    setTimeout(() => {
        const mapContainer = document.querySelector('.map-container');
        mapContainer.innerHTML = `
            <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.086405995029!2d-122.419415584681!3d37.77492957975899!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80858064d6c93a65%3A0x49d38f2fe30e6f20!2sSan%20Francisco%20City%20Hall!5e0!3m2!1sen!2sus!4v1616000000000!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style="border:0;"
                allowfullscreen=""
                loading="lazy">
                title="Mapa de localização da clínica dentária"
            </iframe>
        `;
    }, 3000); // 3-second delay

    const contactForm = document.getElementById('contact-form');

    // Cria o elemento de status
    const formStatus = document.createElement('p');
    formStatus.style.marginTop = '10px';

    if (contactForm) {
        // Insere o status logo após o formulário
        contactForm.parentNode.insertBefore(formStatus, contactForm.nextSibling);

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = new FormData(contactForm);
            formStatus.textContent = 'Enviando...';
            formStatus.style.color = 'var(--primary-color)';

            fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            })
            .then(response => {
                if (response.ok) {
                    formStatus.textContent = 'Mensagem enviada com sucesso!';
                    formStatus.style.color = 'green';
                    contactForm.reset();
                    setTimeout(() => formStatus.textContent = '', 5000);
                } else {
                    throw new Error('Resposta do servidor não foi bem-sucedida.');
                }
            })
            .catch(error => {
                console.error('Form submission error:', error);
                formStatus.textContent = 'Ocorreu um erro ao enviar a mensagem. Tente novamente.';
                formStatus.style.color = 'red';
                setTimeout(() => formStatus.textContent = '', 5000);
            });
        });
    } else {
        console.error('Contact form not found');
    }

});