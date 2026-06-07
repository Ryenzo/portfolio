/**
 * =========================================
 * MOBILE MENU TOGGLE
 * =========================================
 */
const toggleMenu = () => {
    const dropdown = document.querySelector('.dropdown');
    const isVisible = dropdown.style.display === 'block';
    dropdown.style.display = isVisible ? 'none' : 'block';
};
window.toggleMenu = toggleMenu;

// Close menu when clicking outside
document.addEventListener('click', (event) => {
    const dropdown = document.querySelector('.dropdown');
    const hamburg = document.querySelector('.hamburg');
    if (!dropdown || !hamburg) return;
    if (
        dropdown.style.display === 'block' &&
        !dropdown.contains(event.target) &&
        !hamburg.contains(event.target)
    ) {
        dropdown.style.display = 'none';
    }
});

/**
 * =========================================
 * DOM READY – Main Init
 * =========================================
 */
document.addEventListener('DOMContentLoaded', () => {

    // -----------------------------------------
    // Active Link Highlighting + Nav Indicator
    // -----------------------------------------
    const linksContainer = document.querySelector('.nav-container .links');
    const navLinks = document.querySelectorAll('.nav-container .links a, .dropdown .links a');
    const currentPath = window.location.pathname.split('/').pop().toLowerCase() || 'index.html';

    // Desktop indicator
    let indicator = document.querySelector('.nav-indicator');
    if (!indicator && linksContainer) {
        indicator = document.createElement('div');
        indicator.className = 'nav-indicator';
        linksContainer.appendChild(indicator);
    }

    let activeLink = null;

    document.querySelectorAll('.nav-container .links a').forEach(link => {
        const linkPath = link.getAttribute('href').toLowerCase();
        link.classList.remove('active');
        if (linkPath === currentPath || (currentPath === '' && linkPath === 'index.html')) {
            link.classList.add('active');
            activeLink = link;
        }
        link.addEventListener('mouseenter', () => moveIndicator(link));
    });

    // Also highlight dropdown links
    document.querySelectorAll('.dropdown .links a').forEach(link => {
        const linkPath = link.getAttribute('href').toLowerCase();
        link.classList.remove('active');
        if (linkPath === currentPath || (currentPath === '' && linkPath === 'index.html')) {
            link.classList.add('active');
        }
    });

    if (!activeLink && linksContainer) {
        const firstLink = linksContainer.querySelector('a');
        if (firstLink) activeLink = firstLink;
    }

    if (activeLink) {
        setTimeout(() => moveIndicator(activeLink), 100);
    }

    if (linksContainer) {
        linksContainer.addEventListener('mouseleave', () => {
            if (activeLink) moveIndicator(activeLink);
        });
    }

    function moveIndicator(element) {
        if (!indicator || !element) return;
        indicator.style.width = `${element.offsetWidth}px`;
        indicator.style.left = `${element.offsetLeft}px`;
    }

    // -----------------------------------------
    // Auto Footer Year
    // -----------------------------------------
    document.querySelectorAll('.footer-year').forEach(el => {
        el.textContent = new Date().getFullYear();
    });

    // -----------------------------------------
    // Typewriter Effect (Home page only)
    // -----------------------------------------
    const typewriterElement = document.querySelector('.typewriter-text');
    if (typewriterElement) {
        const texts = ['Web Developer', 'UI/UX Designer', 'Mobile Developer'];
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 100;

        function type() {
            const currentText = texts[textIndex];
            if (isDeleting) {
                typewriterElement.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 50;
            } else {
                typewriterElement.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 100;
            }
            if (!isDeleting && charIndex === currentText.length) {
                isDeleting = true;
                typeSpeed = 2000;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                typeSpeed = 500;
            }
            setTimeout(type, typeSpeed);
        }
        setTimeout(type, 1000);
    }

    // -----------------------------------------
    // Scroll Progress Bar
    // -----------------------------------------
    const progressBar = document.getElementById('scroll-progress');
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            progressBar.style.width = `${pct}%`;
        });
    }

    // -----------------------------------------
    // Back-to-Top Button
    // -----------------------------------------
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // -----------------------------------------
    // Skill Bar Animations (Tech Stack page)
    // -----------------------------------------
    const skillBars = document.querySelectorAll('.skill-bar');
    if (skillBars.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    bar.style.width = bar.dataset.width || '0%';
                    observer.unobserve(bar);
                }
            });
        }, { threshold: 0.3 });

        skillBars.forEach(bar => observer.observe(bar));
    }
});

/**
 * =========================================
 * MODAL FUNCTIONS (Certifications page)
 * =========================================
 */
function openModal(imageSrc) {
    const modal = document.getElementById('certModal');
    const modalImg = document.getElementById('modalImage');
    const nav = document.querySelector('nav');
    if (!modal || !modalImg) return;
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modalImg.src = imageSrc;
    if (nav) nav.style.display = 'none';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('certModal');
    const nav = document.querySelector('nav');
    if (!modal) return;
    modal.style.display = 'none';
    if (nav) nav.style.display = 'flex';
    document.body.style.overflow = 'auto';
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeModal();
});

window.openModal = openModal;
window.closeModal = closeModal;