// Scroll to Top Button - Enhanced Version
(function() {
    'use strict';

    class ScrollToTop {
        constructor() {
            this.button = null;
            this.scrollThreshold = 300;
            this.init();
        }

        init() {
            this.createButton();
            this.bindEvents();
            this.checkVisibility();
        }

        createButton() {
            // Créer le bouton si il n'existe pas déjà
            let existingBtn = document.getElementById('scroll-to-top-btn');
            if (existingBtn) {
                this.button = existingBtn;
                return;
            }

            this.button = document.createElement('button');
            this.button.id = 'scroll-to-top-btn';
            this.button.className = 'scroll-to-top-btn';
            this.button.setAttribute('aria-label', 'Retour en haut de la page');
            this.button.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 19V5M5 12l7-7 7 7"/>
                </svg>
            `;
            document.body.appendChild(this.button);
        }

        bindEvents() {
            // Scroll event pour afficher/masquer le bouton
            let ticking = false;
            window.addEventListener('scroll', () => {
                if (!ticking) {
                    requestAnimationFrame(() => {
                        this.checkVisibility();
                        ticking = false;
                    });
                    ticking = true;
                }
            }, { passive: true });

            // Click event pour scroll to top
            this.button.addEventListener('click', () => {
                this.scrollToTop();
            });
        }

        checkVisibility() {
            const scrollY = window.scrollY || window.pageYOffset;
            
            if (scrollY > this.scrollThreshold) {
                this.button.classList.add('visible');
            } else {
                this.button.classList.remove('visible');
            }
        }

        scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }

    // Initialiser au chargement du DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            new ScrollToTop();
        });
    } else {
        new ScrollToTop();
    }
})();


