document.addEventListener('DOMContentLoaded', () => {
    const section = document.querySelector('.horizontal-skills-section');
    const stickyContainer = document.querySelector('.skills-sticky-container');
    const track = document.querySelector('.horizontal-track');
    const progressBar = document.querySelector('.progress-fill');

    if (!section || !track) return;

    // Check if we are on a large screen
    const isLargeScreen = () => window.innerWidth > 900;

    const handleScroll = () => {
        if (!isLargeScreen()) {
            track.style.transform = 'none';
            return;
        }

        const rect = section.getBoundingClientRect();
        const sectionTop = rect.top;
        const sectionHeight = rect.height;
        const viewportHeight = window.innerHeight;

        // Calculate progress
        // Start scrolling when section hits top of viewport
        // End when bottom of section hits bottom of viewport (or strictly based on height)

        let progress = 0;

        // We want 0% when section top is at viewport top (0)
        // We want 100% when (sectionBottom - viewportHeight) <= 0
        // Effectively: how far have we scrolled INTO the section

        const scrollDistance = -sectionTop;
        const maxScroll = sectionHeight - viewportHeight;

        if (scrollDistance > 0 && scrollDistance <= maxScroll) {
            progress = scrollDistance / maxScroll;
        } else if (scrollDistance > maxScroll) {
            progress = 1;
        } else {
            progress = 0;
        }

        // Move the track
        // We need to move it left by (trackWidth - viewportWidth) * progress
        // Actually, we want to scroll enough to see all cards.
        // Let's assume we want to scroll until the last card is visible.

        const trackWidth = track.scrollWidth;
        const containerWidth = window.innerWidth;
        const maxTranslate = trackWidth - containerWidth + (window.innerWidth * 0.1); // +10vw for padding

        const translateX = progress * maxTranslate;

        track.style.transform = `translateX(-${translateX}px)`;

        if (progressBar) {
            progressBar.style.width = `${progress * 100}%`;
        }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);

    // Initial call
    handleScroll();
});
