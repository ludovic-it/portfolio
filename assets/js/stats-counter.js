// Animated Statistics Counter
(function() {
    'use strict';

    class StatsCounter {
        constructor(element) {
            this.element = element;
            this.target = parseInt(element.getAttribute('data-target')) || parseInt(element.textContent) || 0;
            this.duration = parseInt(element.getAttribute('data-duration')) || 2000;
            this.decimals = parseInt(element.getAttribute('data-decimals')) || 0;
            this.hasBeenAnimated = false;
            this.init();
        }

        init() {
            // Observer pour déclencher l'animation quand l'élément est visible
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !this.hasBeenAnimated) {
                        this.animate();
                        this.hasBeenAnimated = true;
                        observer.unobserve(this.element);
                    }
                });
            }, {
                threshold: 0.5
            });

            observer.observe(this.element);
        }

        animate() {
            const start = 0;
            const increment = this.target / (this.duration / 16); // ~60fps
            let current = start;

            const updateCounter = () => {
                current += increment;
                
                if (current < this.target) {
                    const value = this.decimals > 0 
                        ? current.toFixed(this.decimals) 
                        : Math.floor(current);
                    this.element.textContent = this.formatValue(value);
                    requestAnimationFrame(updateCounter);
                } else {
                    const finalValue = this.decimals > 0 
                        ? this.target.toFixed(this.decimals) 
                        : this.target;
                    this.element.textContent = this.formatValue(finalValue);
                }
            };

            updateCounter();
        }

        formatValue(value) {
            const prefix = this.element.getAttribute('data-prefix') || '';
            const suffix = this.element.getAttribute('data-suffix') || '';
            return `${prefix}${value}${suffix}`;
        }
    }

    // Initialiser tous les compteurs
    function initCounters() {
        const counters = document.querySelectorAll('[data-counter], .stat-number, .stats-counter');
        counters.forEach(counter => {
            new StatsCounter(counter);
        });
    }

    // Initialiser au chargement du DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCounters);
    } else {
        initCounters();
    }

    // Exposer pour utilisation externe
    window.StatsCounter = StatsCounter;
})();
