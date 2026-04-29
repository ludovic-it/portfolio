class HeroAnimation {
    constructor() {
        this.canvas = document.getElementById('hero-canvas');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.animationId = null;
        this.maxParticles = 80; // Nombre de particules à afficher
        this.mouse = { x: -1000, y: -1000 }; // Position de la souris
        this.mouseRadius = 100; // Rayon d'influence de la souris

        this.init();
    }

    init() {
        this.resize();
        this.setupEventListeners();
        this.createInitialParticles();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        // Recréer les particules après le redimensionnement
        this.particles = [];
        this.createInitialParticles();
    }

    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.resize();
        });

        // Suivre la position de la souris
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        // Réinitialiser la position de la souris quand elle quitte la fenêtre
        document.addEventListener('mouseleave', () => {
            this.mouse.x = -1000;
            this.mouse.y = -1000;
        });
    }

    createInitialParticles() {
        // Créer toutes les particules initiales dispersées sur la page
        for (let i = 0; i < this.maxParticles; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            this.createParticle(x, y);
        }
    }

    createParticle(x, y) {
        // Taille variable (petites particules)
        const size = 2 + Math.random() * 3;

        // Vitesse très lente pour un effet de flottement
        const speed = 0.1 + Math.random() * 0.2;
        const angle = Math.random() * Math.PI * 2;

        // Couleur bleue unique (même que LUDOVIC CHAMPROBERT)
        const color = { r: 74, g: 127, b: 255 }; // #4A7FFF

        this.particles.push({
            x,
            y,
            originalX: x, // Position d'origine pour revenir après répulsion
            originalY: y,
            size: size,
            opacity: 1,
            targetOpacity: 1,
            velocity: {
                x: Math.cos(angle) * speed,
                y: Math.sin(angle) * speed
            },
            // Ajouter une légère dérive aléatoire
            drift: {
                x: (Math.random() - 0.5) * 0.03,
                y: (Math.random() - 0.5) * 0.03
            },
            color: color,
            fadeIn: false
        });
    }

    animate() {
        // Fond blanc pur
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Mettre à jour et dessiner les particules
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];

            // Calculer la distance entre la souris et la particule
            const dx = this.mouse.x - p.x;
            const dy = this.mouse.y - p.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Effet de répulsion si la souris est proche
            if (distance < this.mouseRadius) {
                // Calculer la force de répulsion (plus forte quand la souris est proche)
                const force = (this.mouseRadius - distance) / this.mouseRadius;
                const angle = Math.atan2(dy, dx);

                // Pousser la particule dans la direction opposée
                const repulsionStrength = 3;
                p.x -= Math.cos(angle) * force * repulsionStrength;
                p.y -= Math.sin(angle) * force * repulsionStrength;
            } else {
                // Mouvement normal avec dérive
                p.x += p.velocity.x + p.drift.x;
                p.y += p.velocity.y + p.drift.y;
            }

            // Rebondir sur les bords de l'écran (effet de flottement continu)
            if (p.x < 0 || p.x > this.canvas.width) {
                p.velocity.x *= -1;
                p.x = Math.max(0, Math.min(this.canvas.width, p.x));
            }
            if (p.y < 0 || p.y > this.canvas.height) {
                p.velocity.y *= -1;
                p.y = Math.max(0, Math.min(this.canvas.height, p.y));
            }

            // Opacité fixe à 100%
            p.opacity = 1;

            // Dessiner la particule
            this.drawParticle(p);
        }

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    drawParticle(p) {
        this.ctx.save();

        const alpha = p.opacity;

        // Couleur avec transparence
        this.ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${alpha})`;

        // Dessiner un cercle simple
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.restore();
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// Initialisation automatique
document.addEventListener('DOMContentLoaded', () => {
    new HeroAnimation();
});