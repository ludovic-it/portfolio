// Enhanced Smooth Scroll with Easing and Snap Scroll
(function() {
    'use strict';

    class SmoothScrollEnhanced {
        constructor() {
            this.isScrolling = false;
            this.lastScrollTime = 0;
            this.scrollDirection = 0;
            this.easing = this.easeInOutCubic;
            this.init();
        }

        init() {
            // Détecter si l'utilisateur préfère les animations réduites
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                return; // Ne pas appliquer le smooth scroll si l'utilisateur préfère les animations réduites
            }

            // Intercepter les clics sur les liens d'ancrage
            document.addEventListener('click', (e) => {
                const link = e.target.closest('a[href^="#"]');
                if (!link || link.hash === '') return;

                const target = document.querySelector(link.hash);
                if (target) {
                    e.preventDefault();
                    this.scrollTo(target, 1000);
                }
            }, { passive: false });

            // Implémenter le smooth scroll natif amélioré
            this.implementNativeSmoothScroll();
        }

        // Fonction d'easing cubic
        easeInOutCubic(t) {
            return t < 0.5
                ? 4 * t * t * t
                : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
        }

        // Fonction d'easing quadratique
        easeInOutQuad(t) {
            return t < 0.5
                ? 2 * t * t
                : -1 + (4 - 2 * t) * t;
        }

        // Fonction de scroll personnalisée avec easing
        scrollTo(target, duration = 800) {
            if (this.isScrolling) return;

            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
            const startPosition = window.pageYOffset;
            const distance = targetPosition - startPosition;
            let startTime = null;

            this.isScrolling = true;

            const animate = (currentTime) => {
                if (startTime === null) startTime = currentTime;
                const timeElapsed = currentTime - startTime;
                const progress = Math.min(timeElapsed / duration, 1);

                // Appliquer l'easing
                const ease = this.easing(progress);
                window.scrollTo(0, startPosition + distance * ease);

                if (timeElapsed < duration) {
                    requestAnimationFrame(animate);
                } else {
                    this.isScrolling = false;
                    // Scroll précis vers la cible
                    window.scrollTo(0, targetPosition);
                }
            };

            requestAnimationFrame(animate);
        }

        // Implémenter le smooth scroll natif amélioré
        implementNativeSmoothScroll() {
            // Ne pas forcer le smooth scroll CSS pour éviter les conflits
            // Le smooth scroll CSS peut causer des problèmes de performance et de fluidité
            // On utilise uniquement le smooth scroll pour les liens d'ancrage
            
            // Suivre la direction du scroll pour d'autres fonctionnalités si nécessaire
            let ticking = false;
            let lastScrollY = window.scrollY;

            window.addEventListener('scroll', () => {
                if (!ticking) {
                    window.requestAnimationFrame(() => {
                        const currentScrollY = window.scrollY;
                        this.scrollDirection = currentScrollY > lastScrollY ? 1 : -1;
                        lastScrollY = currentScrollY;
                        ticking = false;
                    });
                    ticking = true;
                }
            }, { passive: true });
        }
    }

    // Snap Scroll System
    class SnapScroll {
        constructor() {
            this.snapElements = [];
            this.isSnapping = false;
            this.init();
        }

        init() {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                return;
            }

            // Trouver tous les éléments avec data-snap-scroll
            this.snapElements = Array.from(document.querySelectorAll('[data-snap-scroll]'));
            
            if (this.snapElements.length === 0) {
                // Utiliser les sections par défaut
                this.snapElements = Array.from(document.querySelectorAll('section'));
            }

            // Configurer le CSS snap scroll
            document.documentElement.style.scrollSnapType = 'y proximity';
            this.snapElements.forEach((el, index) => {
                el.style.scrollSnapAlign = 'start';
                el.style.scrollSnapStop = 'always';
            });

            // Ajouter la gestion du scroll avec snap
            window.addEventListener('scroll', () => this.handleSnapScroll(), { passive: true });
            window.addEventListener('wheel', (e) => this.handleWheel(e), { passive: false });
        }

        handleSnapScroll() {
            if (this.isSnapping) return;

            const scrollY = window.scrollY;
            const viewportHeight = window.innerHeight;

            this.snapElements.forEach((element) => {
                const rect = element.getBoundingClientRect();
                const elementTop = rect.top;
                const elementBottom = rect.bottom;
                const elementHeight = rect.height;

                // Si l'élément est partiellement visible
                if (elementTop < viewportHeight * 0.5 && elementBottom > viewportHeight * 0.5) {
                    const distance = Math.abs(elementTop);
                    const threshold = viewportHeight * 0.3;

                    if (distance < threshold && !this.isSnapping) {
                        this.snapToElement(element);
                    }
                }
            });
        }

        handleWheel(e) {
            if (this.isSnapping || Math.abs(e.deltaY) < 50) return;

            const scrollDirection = e.deltaY > 0 ? 1 : -1;
            const currentIndex = this.getCurrentSnapIndex();

            if (currentIndex === -1) return;

            const nextIndex = currentIndex + scrollDirection;
            if (nextIndex >= 0 && nextIndex < this.snapElements.length) {
                e.preventDefault();
                this.snapToElement(this.snapElements[nextIndex], 600);
            }
        }

        getCurrentSnapIndex() {
            const scrollY = window.scrollY;
            const viewportHeight = window.innerHeight;

            for (let i = 0; i < this.snapElements.length; i++) {
                const element = this.snapElements[i];
                const rect = element.getBoundingClientRect();
                const elementTop = rect.top + scrollY;

                if (scrollY >= elementTop - viewportHeight * 0.3 && 
                    scrollY <= elementTop + element.offsetHeight) {
                    return i;
                }
            }

            return -1;
        }

        snapToElement(element, duration = 400) {
            if (this.isSnapping) return;

            this.isSnapping = true;
            const targetPosition = element.getBoundingClientRect().top + window.pageYOffset;
            const startPosition = window.pageYOffset;
            const distance = targetPosition - startPosition;
            let startTime = null;

            const animate = (currentTime) => {
                if (startTime === null) startTime = currentTime;
                const timeElapsed = currentTime - startTime;
                const progress = Math.min(timeElapsed / duration, 1);

                // Easing cubic
                const ease = progress < 0.5
                    ? 4 * progress * progress * progress
                    : (progress - 1) * (2 * progress - 2) * (2 * progress - 2) + 1;

                window.scrollTo(0, startPosition + distance * ease);

                if (timeElapsed < duration) {
                    requestAnimationFrame(animate);
                } else {
                    window.scrollTo(0, targetPosition);
                    this.isSnapping = false;
                }
            };

            requestAnimationFrame(animate);
        }
    }

    // Initialisation
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.smoothScrollEnhanced = new SmoothScrollEnhanced();
            // Snap scroll désactivé pour éviter les problèmes de scroll fluide
            // window.snapScroll = new SnapScroll();
        });
    } else {
        window.smoothScrollEnhanced = new SmoothScrollEnhanced();
        // Snap scroll désactivé pour éviter les problèmes de scroll fluide
        // window.snapScroll = new SnapScroll();
    }

    // Exposer pour utilisation externe
    window.SmoothScrollEnhanced = SmoothScrollEnhanced;
    window.SnapScroll = SnapScroll;
})();


