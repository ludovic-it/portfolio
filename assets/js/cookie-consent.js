document.addEventListener('DOMContentLoaded', () => {
    const cookieOverlay = document.getElementById('cookie-consent-overlay');
    const acceptBtn = document.getElementById('cookie-acceptor');
    const rejectBtn = document.getElementById('cookie-rejector');

    if (!cookieOverlay || !acceptBtn || !rejectBtn) {
        return;
    }

    const cookieConsent = localStorage.getItem('cookieConsent');

    // Check if user has already made a choice
    if (!cookieConsent) {
        // Show modal and force layout - allow scrolling behind modal
        cookieOverlay.style.display = 'flex';
        // Do NOT block scrolling on body - allow scroll behind modal
    } else {
        // Ensure body overflow is restored if consent already exists
        if (document.body.style.overflow === 'hidden') {
            document.body.style.overflow = '';
        }
    }

    const closeCookieModal = () => {
        cookieOverlay.style.opacity = '0';
        setTimeout(() => {
            cookieOverlay.style.display = 'none';
            // No need to restore overflow since we never block it
        }, 300);
    };

    // Toggle cookie details visibility
    const detailsBtn = document.getElementById('cookie-details-btn');
    const detailsContent = document.getElementById('cookie-details-content');
    
    if (detailsBtn && detailsContent) {
        detailsBtn.addEventListener('click', () => {
            const isExpanded = detailsContent.style.display === 'block';
            detailsContent.style.display = isExpanded ? 'none' : 'block';
            
            const labelSpan = detailsBtn.querySelector('span:first-child');
            const arrowSpan = detailsBtn.querySelector('.cookie-arrow');
            
            if (labelSpan) {
                labelSpan.textContent = isExpanded ? 'Voir les détails' : 'Masquer les détails';
            }
            if (arrowSpan) {
                arrowSpan.textContent = '▼';
            }
            detailsBtn.classList.toggle('expanded', !isExpanded);
        });
    }

    acceptBtn.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'accepted');
        closeCookieModal();
    });

    rejectBtn.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'rejected');
        closeCookieModal();
    });
});
