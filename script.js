// Toggle Menu Functionality
function toggleMenu() {
    const dropdown = document.querySelector('.dropdown');
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

// Typewriter Effect (only for index.html)
if (document.querySelector('.typewriter-text')) {
    const typewriterText = document.querySelector('.typewriter-text');
    const texts = ["Web Developer", "UI/UX Designer", "Mobile Developer"];
    let index = 0;
    let charIndex = 0;

    function type() {
        if (charIndex < texts[index].length) {
            typewriterText.textContent += texts[index].charAt(charIndex);
            charIndex++;
            setTimeout(type, 100);
        } else {
            setTimeout(erase, 2000);
        }
    }

    function erase() {
        if (charIndex > 0) {
            typewriterText.textContent = texts[index].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, 50);
        } else {
            index++;
            if (index >= texts.length) index = 0;
            setTimeout(type, 500);
        }
    }

    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(type, 1000);
    });
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const dropdown = document.querySelector('.dropdown');
    const hamburg = document.querySelector('.hamburg');
    
    if (dropdown.style.display === 'block' && 
        !dropdown.contains(event.target) && 
        event.target !== hamburg) {
        dropdown.style.display = 'none';
    }
});