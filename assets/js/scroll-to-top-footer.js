// Scroll to Top Button - Footer Version
(function() {
    'use strict';

    function initScrollToTop() {
        // Vérifier si le bouton existe déjà
        const existingBtn = document.querySelector('.scroll-to-top-btn-footer');
        if (existingBtn) {
            // Ajouter l'événement click si ce n'est pas déjà fait
            if (!existingBtn.hasAttribute('data-initialized')) {
                existingBtn.addEventListener('click', handleScrollToTop);
                existingBtn.setAttribute('data-initialized', 'true');
            }
            return;
        }

        // Le bouton devrait être ajouté via HTML, mais si ce n'est pas le cas, on ne fait rien
        // Car on veut que le bouton soit visible même sans JS
        const footerBtn = document.querySelector('.scroll-to-top-btn-footer');
        if (footerBtn) {
            footerBtn.addEventListener('click', handleScrollToTop);
            footerBtn.setAttribute('data-initialized', 'true');
        }
    }

    function handleScrollToTop(e) {
        e.preventDefault();
        e.stopPropagation();

        // Scroll smooth vers le haut
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

        // Pour les navigateurs qui ne supportent pas smooth scroll
        if (!('scrollBehavior' in document.documentElement.style)) {
            smoothScrollFallback();
        }
    }

    function smoothScrollFallback() {
        const scrollDuration = 500;
        const scrollStep = -window.scrollY / (scrollDuration / 15);
        
        const scrollInterval = setInterval(function() {
            if (window.scrollY !== 0) {
                window.scrollBy(0, scrollStep);
            } else {
                clearInterval(scrollInterval);
            }
        }, 15);
    }

    // Initialiser quand le DOM est prêt
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initScrollToTop);
    } else {
        initScrollToTop();
    }
})();
