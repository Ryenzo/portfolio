/**
 * Mobile Menu Toggle
 */
const toggleMenu = () => {
    const dropdown = document.querySelector('.dropdown');
    const isVisible = dropdown.style.display === 'block';
    dropdown.style.display = isVisible ? 'none' : 'block';
};
// Make it global
window.toggleMenu = toggleMenu;

// Close menu when clicking outside
document.addEventListener('click', (event) => {
    const dropdown = document.querySelector('.dropdown');
    const hamburg = document.querySelector('.hamburg');

    if (!dropdown || !hamburg) return;

    if (dropdown.style.display === 'block' &&
        !dropdown.contains(event.target) &&
        !hamburg.contains(event.target)) {
        dropdown.style.display = 'none';
    }
});

/**
 * Active Link Highlighting
 */
document.addEventListener('DOMContentLoaded', () => {
    const linksContainer = document.querySelector('.nav-container .links');
    const navLinks = document.querySelectorAll('.nav-container .links a');
    const currentPath = window.location.pathname.split('/').pop().toLowerCase() || 'index.html';

    // Create Indicator
    let indicator = document.querySelector('.nav-indicator');
    if (!indicator && linksContainer) {
        indicator = document.createElement('div');
        indicator.className = 'nav-indicator';
        linksContainer.appendChild(indicator);
    }

    let activeLink = null;

    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href').toLowerCase();

        // Remove old active class first
        link.classList.remove('active');

        // Match
        if (linkPath === currentPath || (currentPath === '' && linkPath === 'index.html')) {
            link.classList.add('active');
            activeLink = link;
        }

        // Hover Effect for Indicator
        link.addEventListener('mouseenter', () => moveIndicator(link));
    });

    // If no exact match, try default
    if (!activeLink && navLinks.length > 0) activeLink = navLinks[0];

    // Initial Position
    if (activeLink) {
        setTimeout(() => moveIndicator(activeLink), 100);
    }

    // Reset to active on mouseleave
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

    /**
     * Typewriter Effect
     */
    const typewriterElement = document.querySelector('.typewriter-text');
    if (typewriterElement) {
        const texts = ["Web Developer", "UI/UX Designer", "Mobile Developer"];
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
});

// Modal Functions - Defined globally
function openModal(imageSrc) {
    console.log("Opening modal for:", imageSrc);
    const modal = document.getElementById("certModal");
    const modalImg = document.getElementById("modalImage");
    const nav = document.querySelector("nav");

    if (!modal || !modalImg) {
        console.error("Modal elements not found!");
        return;
    }

    modal.style.display = "flex";
    modal.style.alignItems = "center";
    modal.style.justifyContent = "center";
    modalImg.src = imageSrc;

    if (nav) nav.style.display = "none";
    document.body.style.overflow = "hidden";
}

function closeModal() {
    const modal = document.getElementById("certModal");
    const nav = document.querySelector("nav");

    if (!modal) return;

    modal.style.display = "none";

    if (nav) nav.style.display = "flex";
    document.body.style.overflow = "auto";
}

// Close modal on Escape key
document.addEventListener('keydown', function (event) {
    if (event.key === "Escape") {
        closeModal();
    }
});
// Expose functions to window just in case
window.openModal = openModal;
window.closeModal = closeModal;