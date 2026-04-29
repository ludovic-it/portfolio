// Parallax Effects System
(function() {
    'use strict';

    class ParallaxSystem {
        constructor() {
            this.elements = [];
            this.scrollY = window.scrollY || window.pageYOffset;
            this.requestId = null;
            this.init();
        }

        init() {
            // Respecter prefers-reduced-motion
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                return;
            }

            this.findElements();
            this.bindEvents();
            this.update();
        }

        findElements() {
            // Trouver tous les éléments avec data-parallax
            const parallaxElements = document.querySelectorAll('[data-parallax]');
            
            parallaxElements.forEach(el => {
                const speed = parseFloat(el.dataset.parallax) || 0.5;
                const direction = el.dataset.parallaxDirection || 'vertical';
                
                this.elements.push({
                    element: el,
                    speed: speed,
                    direction: direction,
                    initialOffset: 0
                });
            });

            // Parallaxe automatique pour les images dans les cartes
            const cardImages = document.querySelectorAll('.project-image-side img, .veille-image img, .timeline-card img');
            cardImages.forEach(img => {
                const card = img.closest('.project-item-link, .veille-card, .timeline-card');
                if (card && !img.hasAttribute('data-parallax')) {
                    img.setAttribute('data-parallax', '0.3');
                    img.setAttribute('data-parallax-direction', 'vertical');
                    this.elements.push({
                        element: img,
                        speed: 0.3,
                        direction: 'vertical',
                        initialOffset: 0
                    });
                }
            });
        }

        bindEvents() {
            // Utiliser requestAnimationFrame pour de meilleures performances
            let ticking = false;
            
            const handleScroll = () => {
                this.scrollY = window.scrollY || window.pageYOffset;
                
                if (!ticking) {
                    this.requestId = requestAnimationFrame(() => {
                        this.update();
                        ticking = false;
                    });
                    ticking = true;
                }
            };

            window.addEventListener('scroll', handleScroll, { passive: true });
            window.addEventListener('resize', () => this.update(), { passive: true });
        }

        update() {
            const windowHeight = window.innerHeight;
            
            this.elements.forEach(item => {
                const rect = item.element.getBoundingClientRect();
                const elementTop = rect.top + this.scrollY;
                const elementCenter = elementTop + rect.height / 2;
                const windowCenter = this.scrollY + windowHeight / 2;
                
                // Calculer la distance depuis le centre de la fenêtre
                const distance = (windowCenter - elementCenter) * item.speed;
                
                if (item.direction === 'vertical') {
                    item.element.style.transform = `translateY(${distance}px)`;
                } else if (item.direction === 'horizontal') {
                    item.element.style.transform = `translateX(${distance}px)`;
                }
            });
        }

        destroy() {
            if (this.requestId) {
                cancelAnimationFrame(this.requestId);
            }
            this.elements = [];
        }
    }

    // Initialiser au chargement du DOM
    let parallaxSystem;
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            parallaxSystem = new ParallaxSystem();
        });
    } else {
        parallaxSystem = new ParallaxSystem();
    }

    // Exposer pour utilisation externe
    window.ParallaxSystem = ParallaxSystem;
})();
