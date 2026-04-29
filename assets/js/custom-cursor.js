// Custom Cursor with Trail Effect
(function() {
    'use strict';

    // Désactiver sur mobile/touch
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        return;
    }

    class CustomCursor {
        constructor() {
            this.cursor = null;
            this.trail = [];
            this.trailLength = 10;
            this.pos = { x: 0, y: 0 };
            this.mouse = { x: 0, y: 0 };
            this.init();
        }

        init() {
            this.createCursor();
            this.createTrail();
            this.bindEvents();
            this.animate();
        }

        createCursor() {
            this.cursor = document.createElement('div');
            this.cursor.className = 'custom-cursor';
            document.body.appendChild(this.cursor);

            // Cacher le curseur par défaut
            document.body.style.cursor = 'none';
        }

        createTrail() {
            for (let i = 0; i < this.trailLength; i++) {
                const trailDot = document.createElement('div');
                trailDot.className = 'cursor-trail';
                trailDot.style.opacity = (i + 1) / this.trailLength * 0.3;
                trailDot.style.transform = `scale(${(i + 1) / this.trailLength * 0.5})`;
                document.body.appendChild(trailDot);
                this.trail.push({
                    element: trailDot,
                    x: 0,
                    y: 0,
                    targetX: 0,
                    targetY: 0
                });
            }
        }

        bindEvents() {
            document.addEventListener('mousemove', (e) => {
                this.mouse.x = e.clientX;
                this.mouse.y = e.clientY;
            });

            // Effets spéciaux sur les éléments interactifs
            const interactiveElements = document.querySelectorAll('a, button, .btn-primary, .btn-outline, .project-item-link, .veille-card, input, textarea, select');
            
            interactiveElements.forEach(el => {
                el.addEventListener('mouseenter', () => {
                    this.cursor.classList.add('cursor-hover');
                });
                el.addEventListener('mouseleave', () => {
                    this.cursor.classList.remove('cursor-hover');
                });
            });
        }

        animate() {
            // Lerp pour mouvement fluide
            this.pos.x += (this.mouse.x - this.pos.x) * 0.15;
            this.pos.y += (this.mouse.y - this.pos.y) * 0.15;

            // Mettre à jour le curseur principal
            this.cursor.style.left = this.pos.x + 'px';
            this.cursor.style.top = this.pos.y + 'px';

            // Mettre à jour la traînée
            let prevX = this.pos.x;
            let prevY = this.pos.y;

            this.trail.forEach((dot, index) => {
                dot.targetX = prevX;
                dot.targetY = prevY;
                dot.x += (dot.targetX - dot.x) * 0.2;
                dot.y += (dot.targetY - dot.y) * 0.2;

                dot.element.style.left = dot.x + 'px';
                dot.element.style.top = dot.y + 'px';

                prevX = dot.x;
                prevY = dot.y;
            });

            requestAnimationFrame(() => this.animate());
        }
    }

    // Initialiser au chargement du DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            new CustomCursor();
        });
    } else {
        new CustomCursor();
    }
})();


