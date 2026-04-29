/**
 * ShaderGradient animé pour la page contact
 * Utilise les couleurs bleues du site avec des formes organiques animées
 */

class ContactShaderGradient {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.error('Canvas non trouvé:', canvasId);
            return;
        }

        this.ctx = this.canvas.getContext('2d');
        if (!this.ctx) {
            console.error('Impossible d\'obtenir le contexte 2D');
            return;
        }
        
        this.time = 0;
        this.animationId = null;

        // Couleurs bleues du site (pour effet ShaderGradient)
        this.colors = {
            primary: { r: 74, g: 127, b: 255 },    // #4A7FFF - Bleu principal
            light: { r: 107, g: 154, b: 255 },     // #6B9AFF - Bleu clair
            lighter: { r: 163, g: 191, b: 255 },   // #A3BFFF - Bleu très clair
            cyan: { r: 100, g: 200, b: 255 },      // Cyan-bleu pour variété
            purple: { r: 120, g: 140, b: 255 }     // Bleu-violet pour effet
        };

        // Configuration des blobs organiques
        this.blobs = [];
        this.initBlobs();
        this.init();
    }

    initBlobs() {
        // Créer plusieurs blobs organiques animés (style ShaderGradient)
        // Positionner les blobs pour créer un effet visible comme l'image 2
        const blobCount = 5;
        const positions = [
            { x: 10, y: 10 },   // Haut gauche
            { x: 20, y: 30 },   // Milieu gauche
            { x: 80, y: 60 },   // Bas droite
            { x: 70, y: 20 },   // Haut droite
            { x: 50, y: 50 }    // Centre
        ];
        
        for (let i = 0; i < blobCount; i++) {
            const pos = positions[i] || { x: Math.random() * 100, y: Math.random() * 100 };
            this.blobs.push({
                x: pos.x, // Pourcentage de la largeur
                y: pos.y, // Pourcentage de la hauteur
                size: 400 + Math.random() * 600, // Plus grands pour être plus visibles
                speedX: (Math.random() - 0.5) * 0.3,
                speedY: (Math.random() - 0.5) * 0.3,
                phaseX: Math.random() * Math.PI * 2,
                phaseY: Math.random() * Math.PI * 2,
                colorIndex: i % Object.keys(this.colors).length, // Différentes couleurs
                amplitude: 30 + Math.random() * 50, // Mouvement modéré
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.015
            });
        }
    }

    init() {
        this.resize();
        this.setupEventListeners();
        this.animate();
    }

    resize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        // Définir les dimensions internes du canvas (taille réelle du bitmap)
        this.canvas.width = width;
        this.canvas.height = height;
        
        // Les dimensions CSS sont gérées par le CSS (100vw/100vh)
        // Pas besoin de définir style.width/height ici car le CSS le gère déjà
        
        this.width = this.canvas.width;
        this.height = this.canvas.height;
    }

    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.resize();
        });
    }

    // Fonction de bruit simple pour mouvement organique
    noise(x, y, time) {
        return Math.sin(x * 0.01 + time) * Math.cos(y * 0.01 + time * 0.7);
    }

    // Obtenir une couleur par index
    getColor(index) {
        const colorKeys = Object.keys(this.colors);
        const key = colorKeys[index % colorKeys.length];
        return this.colors[key];
    }

    // Dessiner un blob organique (style ShaderGradient avec formes dynamiques)
    drawBlob(blob, time) {
        const ctx = this.ctx;
        const x = (blob.x / 100) * this.width;
        const y = (blob.y / 100) * this.height;

        // Animation de position avec mouvement organique
        const offsetX = Math.sin(time * blob.speedX + blob.phaseX) * blob.amplitude;
        const offsetY = Math.cos(time * blob.speedY + blob.phaseY) * blob.amplitude;

        const currentX = x + offsetX;
        const currentY = y + offsetY;

        // Variation de taille avec pulsation
        const sizeVariation = Math.sin(time * 0.4 + blob.phaseX) * 100;
        const currentSize = blob.size + sizeVariation;

        // Rotation du blob
        blob.rotation += blob.rotationSpeed;

        // Obtenir la couleur
        const color = this.getColor(blob.colorIndex);
        // Opacité optimisée pour blend mode 'screen' (plus visible)
        const baseOpacity = 1.0; // Opacité maximale pour effet ShaderGradient visible
        const opacityVariation = Math.sin(time * 0.4 + blob.phaseX) * 0.1;
        const opacity = Math.min(1, baseOpacity + opacityVariation);

        // Créer un gradient radial avec intensité plus forte
        const gradient = ctx.createRadialGradient(
            currentX, currentY, 0,
            currentX, currentY, currentSize
        );

        // Gradient avec transitions pour blend mode 'screen'
        // Avec screen, on peut utiliser des opacités élevées
        const rgba1 = `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity})`;
        const rgba2 = `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity * 0.9})`;
        const rgba3 = `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity * 0.7})`;
        const rgba4 = `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity * 0.5})`;
        const rgba5 = `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity * 0.2})`;
        const rgba6 = `rgba(${color.r}, ${color.g}, ${color.b}, 0)`;

        gradient.addColorStop(0, rgba1);
        gradient.addColorStop(0.15, rgba2);
        gradient.addColorStop(0.35, rgba3);
        gradient.addColorStop(0.55, rgba4);
        gradient.addColorStop(0.75, rgba5);
        gradient.addColorStop(1, rgba6);

        // Dessiner le blob avec rotation
        ctx.save();
        ctx.translate(currentX, currentY);
        ctx.rotate(blob.rotation);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        
        // Créer une forme plus organique (légèrement déformée plutôt qu'un cercle parfait)
        const points = 8;
        for (let i = 0; i < points; i++) {
            const angle = (i / points) * Math.PI * 2;
            const radiusVariation = Math.sin(time * 0.5 + blob.phaseX + angle) * 30;
            const radius = currentSize + radiusVariation;
            const px = Math.cos(angle) * radius;
            const py = Math.sin(angle) * radius;
            
            if (i === 0) {
                ctx.moveTo(px, py);
            } else {
                ctx.lineTo(px, py);
            }
        }
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();
    }

    // Dessiner le fond blanc
    drawBackground() {
        const ctx = this.ctx;
        
        // Fond blanc
        ctx.save();
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = '#ffffff'; // Fond blanc
        ctx.fillRect(0, 0, this.width, this.height);
        ctx.restore();
    }

    // Fonction principale d'animation
    animate() {
        if (!this.ctx) {
            return;
        }

        this.time += 0.015; // Animation fluide et visible

        // Effacer complètement le canvas
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Dessiner le fond bleu
        this.drawBackground();

        // Utiliser le blend mode 'screen' pour un effet ShaderGradient classique
        // Screen éclaircit l'image - parfait pour les couleurs vives sur fond bleu sombre
        this.ctx.globalCompositeOperation = 'screen';

        // Dessiner tous les blobs
        this.blobs.forEach((blob, index) => {
            try {
                this.drawBlob(blob, this.time);
            } catch (e) {
                console.warn('Erreur lors du dessin du blob:', e);
            }
        });

        // Réinitialiser le blend mode
        this.ctx.globalCompositeOperation = 'source-over';

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    // Arrêter l'animation
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// Initialiser quand le DOM est prêt
function initGradient() {
    const canvas = document.getElementById('contact-shader-canvas');
    
    if (canvas) {
        const gradient = new ContactShaderGradient('contact-shader-canvas');
        window.contactShaderGradient = gradient;
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGradient);
} else {
    // DOM déjà chargé
    initGradient();
}
