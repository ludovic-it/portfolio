// Skills Radar Chart
class SkillsRadar {
    constructor(canvasId, data) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.data = data || this.getDefaultData();
        this.init();
    }

    getDefaultData() {
        return {
            labels: ['PHP/Symfony', 'JavaScript', 'HTML/CSS', 'Python', 'MySQL', 'Git'],
            values: [85, 80, 90, 70, 75, 85]
        };
    }

    init() {
        this.resize();
        this.draw();
        window.addEventListener('resize', () => {
            this.resize();
            this.draw();
        });
    }

    resize() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.width; // Square
        this.center = {
            x: this.canvas.width / 2,
            y: this.canvas.height / 2
        };
        this.radius = Math.min(this.center.x, this.center.y) * 0.8;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const numPoints = this.data.labels.length;
        const angleStep = (Math.PI * 2) / numPoints;

        // Draw grid circles
        this.drawGrid(angleStep, numPoints);

        // Draw data polygon
        this.drawDataPolygon(angleStep, numPoints);

        // Draw labels
        this.drawLabels(angleStep, numPoints);
    }

    drawGrid(angleStep, numPoints) {
        // Draw concentric circles
        for (let i = 1; i <= 5; i++) {
            const radius = (this.radius / 5) * i;
            this.ctx.strokeStyle = 'rgba(74, 127, 255, 0.1)';
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.arc(this.center.x, this.center.y, radius, 0, Math.PI * 2);
            this.ctx.stroke();
        }

        // Draw axes
        this.ctx.strokeStyle = 'rgba(74, 127, 255, 0.2)';
        this.ctx.lineWidth = 1;
        for (let i = 0; i < numPoints; i++) {
            const angle = (i * angleStep) - (Math.PI / 2);
            const x = this.center.x + Math.cos(angle) * this.radius;
            const y = this.center.y + Math.sin(angle) * this.radius;
            
            this.ctx.beginPath();
            this.ctx.moveTo(this.center.x, this.center.y);
            this.ctx.lineTo(x, y);
            this.ctx.stroke();
        }
    }

    drawDataPolygon(angleStep, numPoints) {
        this.ctx.fillStyle = 'rgba(74, 127, 255, 0.3)';
        this.ctx.strokeStyle = 'rgba(74, 127, 255, 1)';
        this.ctx.lineWidth = 2;

        this.ctx.beginPath();
        for (let i = 0; i < numPoints; i++) {
            const angle = (i * angleStep) - (Math.PI / 2);
            const value = this.data.values[i] / 100;
            const radius = this.radius * value;
            const x = this.center.x + Math.cos(angle) * radius;
            const y = this.center.y + Math.sin(angle) * radius;

            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
    }

    drawLabels(angleStep, numPoints) {
        this.ctx.fillStyle = 'var(--text-primary)';
        this.ctx.font = '12px Inter, sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';

        for (let i = 0; i < numPoints; i++) {
            const angle = (i * angleStep) - (Math.PI / 2);
            const labelRadius = this.radius * 1.15;
            const x = this.center.x + Math.cos(angle) * labelRadius;
            const y = this.center.y + Math.sin(angle) * labelRadius;

            this.ctx.fillText(this.data.labels[i], x, y);
        }
    }
}

// Auto-initialize
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('skills-radar-chart');
    if (canvas) {
        new SkillsRadar('skills-radar-chart');
    }
});

