// Dots Grid Pattern Animation - Interactive grid of dots that reacts to hover
class DotsGridAnimation {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.dots = [];
        this.mouse = { x: -1000, y: -1000 };
        this.animationId = null;
        
        this.config = {
            dotSize: 8,
            dotSpacing: 30,
            hoverRadius: 80,
            maxScale: 2.5,
            color: '#4A7FFF',
            inactiveColor: '#4A7FFF',
            inactiveOpacity: 0.4
        };

        this.init();
    }

    init() {
        this.resize();
        this.createDots();
        this.setupEventListeners();
        this.animate();
    }

    resize() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        this.cols = Math.ceil(this.canvas.width / this.config.dotSpacing) + 1;
        this.rows = Math.ceil(this.canvas.height / this.config.dotSpacing) + 1;
    }

    createDots() {
        this.dots = [];
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                this.dots.push({
                    x: col * this.config.dotSpacing,
                    y: row * this.config.dotSpacing,
                    baseSize: this.config.dotSize,
                    currentSize: this.config.dotSize,
                    targetSize: this.config.dotSize,
                    opacity: 0.7
                });
            }
        }
    }

    setupEventListeners() {
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });

        this.canvas.addEventListener('mouseleave', () => {
            this.mouse.x = -1000;
            this.mouse.y = -1000;
        });

        window.addEventListener('resize', () => {
            this.resize();
            this.createDots();
        });
    }

    getDistance(x1, y1, x2, y2) {
        return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.dots.forEach(dot => {
            const distance = this.getDistance(dot.x, dot.y, this.mouse.x, this.mouse.y);
            
            if (distance < this.config.hoverRadius) {
                const influence = 1 - (distance / this.config.hoverRadius);
                const scale = 1 + (influence * (this.config.maxScale - 1));
                dot.targetSize = this.config.dotSize * scale;
                dot.opacity = 0.7 + (influence * 0.3);
            } else {
                dot.targetSize = this.config.dotSize;
                dot.opacity = 0.7;
            }

            // Smooth transition
            dot.currentSize += (dot.targetSize - dot.currentSize) * 0.15;
            
            // Draw dot
            this.ctx.beginPath();
            this.ctx.arc(dot.x, dot.y, dot.currentSize / 2, 0, Math.PI * 2);
            const isHovered = this.mouse.x > -1000 && distance < this.config.hoverRadius;
            this.ctx.fillStyle = this.config.color;
            this.ctx.globalAlpha = isHovered ? dot.opacity : this.config.inactiveOpacity;
            this.ctx.fill();
            this.ctx.globalAlpha = 1;
        });

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const canvas1 = document.getElementById('dots-grid-canvas');
    const canvas2 = document.getElementById('bts-dots-grid-canvas');
    
    if (canvas1) {
        new DotsGridAnimation('dots-grid-canvas');
    }
    
    if (canvas2) {
        new DotsGridAnimation('bts-dots-grid-canvas');
    }
});

