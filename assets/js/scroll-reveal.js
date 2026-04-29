// Scroll Reveal Animation System - Enhanced with multiple animation effects
class ScrollReveal {
    constructor() {
        this.elements = [];
        this.options = {
            threshold: 0.05,
            rootMargin: '0px 0px -80px 0px'
        };
        this.observer = null;
        this.animationTypes = [
            'up', 'down', 'left', 'right', 'fade', 'scale', 'rotate',
            'bounce', 'slide', 'zoom', 'flip', 'blur', 'skew', 'elastic'
        ];
        this.init();
    }

    init() {
        try {
            if ('IntersectionObserver' in window && window.IntersectionObserver) {
                this.observer = new IntersectionObserver((entries) => {
                    try {
                        entries.forEach(entry => {
                            if (entry && entry.isIntersecting && entry.target) {
                                this.animate(entry.target);
                                if (this.observer && this.observer.unobserve) {
                                    this.observer.unobserve(entry.target);
                                }
                            }
                        });
                    } catch (e) {
                        console.warn('Erreur dans l\'observer IntersectionObserver:', e);
                    }
                }, this.options);

                this.observeElements();
            } else {
                this.animateAll();
            }
        } catch (e) {
            console.warn('Erreur lors de l\'initialisation de ScrollReveal:', e);
            // Fallback : animer tout immédiatement
            this.animateAll();
        }
    }

    observeElements() {
        try {
            if (!this.observer || typeof this.observer.observe !== 'function') {
                this.animateAll();
                return;
            }

            // Observer les éléments avec stagger pour les groupes
            const groups = document.querySelectorAll('[data-reveal-group]');
            if (groups && groups.forEach) {
                groups.forEach(group => {
                    if (!group || !group.querySelectorAll) return;
                    const elements = group.querySelectorAll('.reveal, [data-reveal]');
                    if (elements && elements.forEach) {
                        elements.forEach((el, index) => {
                            if (el && el.style && el.style.setProperty) {
                                el.style.setProperty('--stagger-delay', index);
                            }
                            if (this.observer && this.observer.observe) {
                                this.observer.observe(el);
                            }
                        });
                    }
                });
            }
            
            // Observer les éléments individuels
            const revealElements = document.querySelectorAll('.reveal:not([data-reveal-group] .reveal)');
            if (revealElements && revealElements.forEach) {
                revealElements.forEach(el => {
                    if (el && this.observer && this.observer.observe) {
                        this.observer.observe(el);
                    }
                });
            }

            const dataRevealElements = document.querySelectorAll('[data-reveal]:not([data-reveal-group] [data-reveal])');
            if (dataRevealElements && dataRevealElements.forEach) {
                dataRevealElements.forEach(el => {
                    if (el && this.observer && this.observer.observe) {
                        this.observer.observe(el);
                    }
                });
            }
        } catch (e) {
            console.warn('Erreur lors de l\'observation des éléments:', e);
            this.animateAll();
        }
    }

    getRandomAnimation() {
        return this.animationTypes[Math.floor(Math.random() * this.animationTypes.length)];
    }

    animate(element) {
        try {
            if (!element || !element.style) return;

            const delay = (element.dataset && element.dataset.revealDelay) 
                ? parseInt(element.dataset.revealDelay) || 0 
                : 0;
            const staggerDelay = (element.style && element.style.getPropertyValue) 
                ? parseInt(element.style.getPropertyValue('--stagger-delay')) || 0 
                : 0;
            const totalDelay = delay + (staggerDelay * 100); // stagger en ms
            
            const direction = (element.dataset && element.dataset.reveal) 
                ? element.dataset.reveal 
                : (element.dataset && element.dataset.revealDirection) 
                    ? element.dataset.revealDirection 
                    : (element.dataset && element.dataset.revealAnimation) 
                        ? element.dataset.revealAnimation 
                        : 'up';
            
            // Détecter automatiquement le type de contenu pour animation appropriée
            const contentType = this.detectContentType(element);
            const animationType = direction !== 'up' ? direction : contentType;
            
            // Ajouter l'attribut data-reveal si nécessaire pour déclencher les animations CSS
            if (element.setAttribute && !element.dataset.reveal && animationType !== 'up') {
                element.setAttribute('data-reveal', animationType);
            }
            
            // Add initial styles based on animation type
            this.setInitialState(element, animationType);
            
            setTimeout(() => {
                if (element && element.classList && element.classList.add) {
                    element.classList.add('revealed');
                }
                this.applyAnimation(element, animationType);
            }, totalDelay);
        } catch (e) {
            console.warn('Erreur lors de l\'animation de l\'élément:', e);
        }
    }
    
    detectContentType(element) {
        // Détecter le type de contenu pour animation appropriée
        if (element.classList.contains('project-item') || 
            element.classList.contains('veille-card') ||
            element.classList.contains('bts-option-card')) {
            return 'scale'; // Cartes: animation scale
        }
        if (element.tagName === 'IMG' || element.querySelector('img')) {
            return 'blur'; // Images: fade-in avec blur
        }
        if (element.tagName === 'H1' || element.tagName === 'H2' || 
            element.tagName === 'H3' || element.classList.contains('page-title') ||
            element.classList.contains('section-title')) {
            return 'scale-rotate'; // Titres: scale + rotation subtile
        }
        return 'up'; // Par défaut: slide up
    }

    setInitialState(element, direction) {
        const style = element.style;
        // Liste des animations qui utilisent des animations CSS @keyframes
        const cssKeyframeAnimations = ['blur', 'scale', 'rotate', 'scale-rotate', 'bounce', 'elastic'];
        
        // Pour les animations CSS, ne pas définir de transition (l'animation CSS gère tout)
        if (!cssKeyframeAnimations.includes(direction)) {
            style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        } else {
            // Pour les animations CSS, on garde juste la transition pour les autres propriétés si nécessaire
            style.transition = 'transform 0.1s, filter 0.1s';
        }
        
        switch(direction) {
            case 'up':
                style.transform = 'translateY(60px)';
                break;
            case 'down':
                style.transform = 'translateY(-60px)';
                break;
            case 'left':
                style.transform = 'translateX(60px)';
                break;
            case 'right':
                style.transform = 'translateX(-60px)';
                break;
            case 'fade':
                style.transform = 'scale(0.95)';
                break;
            case 'scale':
                style.transform = 'scale(0.7)';
                break;
            case 'rotate':
                style.transform = 'rotate(-10deg) scale(0.9)';
                break;
            case 'bounce':
                style.transform = 'translateY(100px)';
                break;
            case 'slide':
                style.transform = 'translateX(100%)';
                break;
            case 'zoom':
                style.transform = 'scale(0.5)';
                break;
            case 'flip':
                style.transform = 'rotateY(90deg)';
                style.perspective = '1000px';
                break;
            case 'blur':
                style.transform = 'translateY(30px) scale(0.95)';
                style.filter = 'blur(10px)';
                break;
            case 'scale-rotate':
                style.transform = 'scale(0.5) rotate(-15deg)';
                style.filter = 'blur(5px)';
                break;
            case 'skew':
                style.transform = 'skewY(10deg) translateY(50px)';
                break;
            case 'elastic':
                style.transform = 'scale(0.3) translateY(80px)';
                break;
            default:
                style.transform = 'translateY(60px)';
        }
    }

    applyAnimation(element, direction) {
        const style = element.style;
        
        // Liste des animations qui utilisent des animations CSS @keyframes
        const cssKeyframeAnimations = ['blur', 'scale', 'rotate', 'scale-rotate', 'bounce', 'elastic'];
        
        // Pour les animations CSS, ne JAMAIS modifier l'opacité ici - elle sera gérée par l'animation
        // Pour les autres, définir une transition et mettre l'opacité à 1
        if (!cssKeyframeAnimations.includes(direction)) {
            // S'assurer que l'opacité reste à 0 jusqu'à ce que la transition commence
            style.opacity = '0';
            // Forcer un reflow pour que la transition se déclenche
            void element.offsetHeight;
            // Maintenant on peut mettre l'opacité à 1 et la transition se fera
            requestAnimationFrame(() => {
                style.opacity = '1';
            });
        } else {
            // Pour les animations CSS, s'assurer que l'opacité reste à 0
            // L'animation CSS la gérera via @keyframes
            style.opacity = '0';
        }
        
        switch(direction) {
            case 'up':
            case 'down':
            case 'left':
            case 'right':
                style.transform = 'translate(0, 0)';
                break;
            case 'fade':
                style.transform = 'scale(1)';
                break;
            case 'scale':
            case 'rotate':
            case 'blur':
            case 'scale-rotate':
                // Les animations CSS gèrent tout, ne rien modifier ici
                // L'opacité reste à 0, l'animation CSS la fera passer à 1
                break;
            case 'bounce':
                style.animation = 'bounceIn 0.8s ease-out forwards';
                break;
            case 'slide':
                style.transform = 'translateX(0)';
                break;
            case 'zoom':
                style.transform = 'scale(1)';
                break;
            case 'flip':
                style.transform = 'rotateY(0deg)';
                break;
            case 'skew':
                style.transform = 'skewY(0deg) translateY(0)';
                break;
            case 'elastic':
                style.animation = 'elasticIn 0.9s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards';
                break;
            default:
                style.transform = 'translate(0, 0)';
        }
    }

    animateAll() {
        document.querySelectorAll('.reveal, [data-reveal]').forEach(el => {
            this.animate(el);
        });
    }
}

// Add keyframe animations for special effects
const style = document.createElement('style');
style.textContent = `
    @keyframes bounceIn {
        0% {
            opacity: 0;
            transform: translateY(100px) scale(0.3);
        }
        50% {
            transform: translateY(-20px) scale(1.05);
        }
        70% {
            transform: translateY(10px) scale(0.95);
        }
        100% {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }
    
    @keyframes elasticIn {
        0% {
            opacity: 0;
            transform: scale(0.3) translateY(80px);
        }
        50% {
            transform: scale(1.1) translateY(-10px);
        }
        70% {
            transform: scale(0.95) translateY(5px);
        }
        100% {
            opacity: 1;
            transform: scale(1) translateY(0);
        }
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(60px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes scaleIn {
        from {
            opacity: 0;
            transform: scale(0.7);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
`;
document.head.appendChild(style);

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    new ScrollReveal();
});

