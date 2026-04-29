// Scroll Progress Bar
(function() {
    'use strict';

    class ScrollProgress {
        constructor() {
            this.bar = null;
            this.init();
        }

        init() {
            // Respecter prefers-reduced-motion
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                return;
            }

            this.createBar();
            this.bindEvents();
        }

        createBar() {
            this.bar = document.createElement('div');
            this.bar.className = 'scroll-progress-bar';
            this.bar.setAttribute('role', 'progressbar');
            this.bar.setAttribute('aria-label', 'Progression du scroll');
            this.bar.setAttribute('aria-valuemin', '0');
            this.bar.setAttribute('aria-valuemax', '100');
            document.body.appendChild(this.bar);
        }

        bindEvents() {
            let ticking = false;
            
            const handleScroll = () => {
                if (!ticking) {
                    requestAnimationFrame(() => {
                        this.update();
                        ticking = false;
                    });
                    ticking = true;
                }
            };

            window.addEventListener('scroll', handleScroll, { passive: true });
            window.addEventListener('resize', () => this.update(), { passive: true });
            
            // Mettre à jour au chargement
            this.update();
        }

        update() {
            if (!this.bar) return;

            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollTop = window.scrollY || window.pageYOffset;
            const scrollableHeight = documentHeight - windowHeight;
            const progress = scrollableHeight > 0 ? (scrollTop / scrollableHeight) * 100 : 0;

            this.bar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
            this.bar.setAttribute('aria-valuenow', Math.round(progress));
        }
    }

    // Initialiser au chargement du DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            new ScrollProgress();
        });
    } else {
        new ScrollProgress();
    }
})();


