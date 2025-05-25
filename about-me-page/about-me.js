// Updated JavaScript with anime links removed
document.addEventListener('DOMContentLoaded', function() {
    initializeLanguageBars();
});

function initializeLanguageBars() {
    // Animate language proficiency bars when they come into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const proficiencyBars = entry.target.querySelectorAll('.proficiency-fill');
                proficiencyBars.forEach(bar => {
                    const level = bar.getAttribute('data-level');
                    bar.style.width = '0%';
                    setTimeout(() => {
                        bar.style.width = level + '%';
                    }, 200);
                });
            }
        });
    }, { threshold: 0.5 });

    const languagesSection = document.querySelector('.languages-section');
    if (languagesSection) {
        observer.observe(languagesSection);
    }
}